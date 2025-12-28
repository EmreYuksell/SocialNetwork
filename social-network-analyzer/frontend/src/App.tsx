// frontend/src/App.tsx
import { useState } from "react";
import type { GraphResponse } from "./types/graph";
import { getGraph, addNode, addEdge } from "./api/graphApi";
import {
  runBfs,
  runDijkstra,
  runConnectedComponents,
  runWelshPowell,
  runDegreeCentrality,
} from "./api/algorithmsApi";
import { GraphCanvas } from "./components/GraphCanvas";
import "./App.css";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CentralNode {
  id: string;
  score: number;
}

type OutputMode = "summary" | "raw";

function buildSummary(output: any): string {
  if (!output) return "Henüz algoritma çalıştırılmadı.";

  const alg = output.algorithm ?? "";
  const d = output.details ?? {};

  switch (alg) {
    case "BFS":
      return [
        "Algoritma: BFS",
        `Başlangıç: ${d.startNodeId}`,
        `Ziyaret sırası: ${d.visitOrder?.join(" → ")}`,
        `Mesafeler:`,
        JSON.stringify(d.distances, null, 2),
      ].join("\n");

    case "Dijkstra":
      return [
        "Algoritma: Dijkstra",
        `Başlangıç: ${d.startNodeId}`,
        `Hedef: ${d.targetNodeId}`,
        `Yol: ${d.path?.join(" → ")}`,
        `Toplam ağırlık: ${d.totalDistance}`,
      ].join("\n");

    case "ConnectedComponents":
      return [
        "Algoritma: Connected Components",
        `Bileşen sayısı: ${d.componentCount}`,
        "",
        ...(d.components || []).map(
          (c: any, i: number) => `${i + 1}. bileşen: ${c.nodes.join(", ")}`
        ),
      ].join("\n");

    case "WelshPowellColoring":
    case "Welsh–Powell Coloring":
    case "WelshPowell":
      return [
        "Algoritma: Welsh–Powell Coloring",
        `Renk sayısı: ${d.colorCount}`,
        "",
        "Renk atamaları:",
        JSON.stringify(d.colors, null, 2),
      ].join("\n");

    case "DegreeCentrality":
      return [
        "Algoritma: Degree Centrality",
        "Dereceler:",
        JSON.stringify(d.degrees ?? d.centrality ?? d.scores, null, 2),
      ].join("\n");

    default:
      return JSON.stringify(output, null, 2);
  }
}

function App() {
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [nodeForm, setNodeForm] = useState({
    id: "",
    name: "",
    activity: 0.5,
    interaction: 0.5,
  });
  const [edgeForm, setEdgeForm] = useState({ fromId: "", toId: "" });
  const [algoOutput, setAlgoOutput] = useState<any>(null);
  const [coloring, setColoring] = useState<Record<string, number> | undefined>(
    undefined
  );
  const [highlightPath, setHighlightPath] = useState<string[] | undefined>(
    undefined
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined
  );
  const [centralityMap, setCentralityMap] = useState<
    Record<string, number> | undefined
  >(undefined);
  const [topCentralNodes, setTopCentralNodes] = useState<
    CentralNode[] | undefined
  >(undefined);

  const [dijkstraStartId, setDijkstraStartId] = useState<string | undefined>(
    undefined
  );
  const [dijkstraEndId, setDijkstraEndId] = useState<string | undefined>(
    undefined
  );

  const [bfsDistances, setBfsDistances] = useState<
    Record<string, number> | undefined
  >(undefined);
  const [componentMap, setComponentMap] = useState<
    Record<string, number> | undefined
  >(undefined);

  const [outputMode, setOutputMode] = useState<OutputMode>("raw");

  async function handleLoadGraph() {
    try {
      const data = await getGraph();
      setGraph(data);
    } catch (err) {
      console.error(err);
      alert("Graph yüklenirken hata oluştu. Konsola bak.");
    }
  }

  async function handleAddNode(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addNode({
        id: nodeForm.id,
        name: nodeForm.name,
        activity: Number(nodeForm.activity),
        interaction: Number(nodeForm.interaction),
        connectionCount: 0,
      });
      await handleLoadGraph();
    } catch (err) {
      console.error(err);
      alert("Node eklenirken hata oluştu. Konsola bak.");
    }
  }

  async function handleAddEdge(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addEdge(edgeForm.fromId, edgeForm.toId);
      await handleLoadGraph();
    } catch (err) {
      console.error(err);
      alert("Edge eklenirken hata oluştu. Konsola bak.");
    }
  }

  // BFS için başlangıç nodu: seçili varsa o, yoksa "1"
  const bfsStartId = selectedNodeId ?? "1";

  function processDegreeCentralityResult(res: any) {
    const details: any = res?.details ?? res;

    let map: Record<string, number> | undefined;

    if (details?.centrality && typeof details.centrality === "object") {
      map = details.centrality as Record<string, number>;
    } else if (details?.scores && typeof details.scores === "object") {
      map = details.scores as Record<string, number>;
    }

    setCentralityMap(map);

    if (map) {
      const arr: CentralNode[] = Object.entries(map).map(([id, score]) => ({
        id,
        score,
      }));
      arr.sort((a, b) => b.score - a.score);
      setTopCentralNodes(arr.slice(0, 5));
    } else {
      setTopCentralNodes(undefined);
    }
  }

  function handleNodeClick(id: string) {
    setSelectedNodeId(id);
    setHighlightPath(undefined);
    setColoring(undefined);
    setCentralityMap(undefined);
    setTopCentralNodes(undefined);
    setBfsDistances(undefined);
    setComponentMap(undefined);

    if (!dijkstraStartId || (dijkstraStartId && dijkstraEndId)) {
      setDijkstraStartId(id);
      setDijkstraEndId(undefined);
    } else if (dijkstraStartId && !dijkstraEndId) {
      if (id === dijkstraStartId) {
        setDijkstraStartId(id);
        setDijkstraEndId(undefined);
      } else {
        setDijkstraEndId(id);
      }
    }
  }

  const dijkstraLabel = `Dijkstra ${
    dijkstraStartId ?? "?"
  } \u2192 ${dijkstraEndId ?? "?"}`;

  function handleExportGraph() {
    if (!graph) {
      alert("Önce grafı yüklemelisin.");
      return;
    }
    const blob = new Blob([JSON.stringify(graph, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <div className="app-shell">
        {/* HEADER */}
        <header className="app-header">
          <div>
            <h1 className="app-title">Social Network Analyzer</h1>
            <p className="app-subtitle">
              Sosyal ilişkileri grafik algoritmalarıyla analiz eden etkileşimli
              arayüz
            </p>
          </div>
          <div className="header-actions">
            <div className="header-buttons">
              <button className="btn btn-primary" onClick={handleLoadGraph}>
                Grafı Yükle
              </button>
              <button
                className="btn"
                onClick={handleExportGraph}
                disabled={!graph}
              >
                Grafı Dışa Aktar
              </button>
            </div>
            <div className="header-status">
              <span>BFS başlangıç: </span>
              <strong>{bfsStartId}</strong>
              {dijkstraStartId && (
                <>
                  <span style={{ marginLeft: 12 }}>Dijkstra:</span>{" "}
                  <strong>
                    {dijkstraStartId} → {dijkstraEndId ?? "?"}
                  </strong>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ANA GRID LAYOUT */}
        <div className="app-layout">
          {/* SOL PANEL */}
          <section className="panel panel-left">
            {/* GRAPH EN ÜSTE */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Graph Visualization</h2>
                <span className="card-hint">
                  Node’a tıkla → BFS başlangıcı ve Dijkstra start/hedef seç
                </span>
              </div>
              <div className="card-body graph-wrapper">
                <GraphCanvas
                  graph={graph}
                  coloring={coloring}
                  highlightPath={highlightPath}
                  selectedNodeId={selectedNodeId}
                  centralityMap={centralityMap}
                  dijkstraStartId={dijkstraStartId}
                  dijkstraEndId={dijkstraEndId}
                  bfsDistances={bfsDistances}
                  componentMap={componentMap}
                  onNodeClick={handleNodeClick}
                />
              </div>
            </div>

            {/* NODES + EDGES YAN YANA */}
            <div className="panel-row">
              {/* Nodes */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Nodes</h2>
                  <span className="card-badge">
                    {graph?.nodes.length ?? 0} adet
                  </span>
                </div>

                <form className="form-row" onSubmit={handleAddNode}>
                  <input
                    className="input"
                    placeholder="id"
                    value={nodeForm.id}
                    onChange={(e) =>
                      setNodeForm({ ...nodeForm, id: e.target.value })
                    }
                  />
                  <input
                    className="input"
                    placeholder="name"
                    value={nodeForm.name}
                    onChange={(e) =>
                      setNodeForm({ ...nodeForm, name: e.target.value })
                    }
                  />
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    placeholder="activity"
                    value={nodeForm.activity}
                    onChange={(e) =>
                      setNodeForm({
                        ...nodeForm,
                        activity: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    placeholder="interaction"
                    value={nodeForm.interaction}
                    onChange={(e) =>
                      setNodeForm({
                        ...nodeForm,
                        interaction: Number(e.target.value),
                      })
                    }
                  />
                  <button className="btn btn-secondary" type="submit">
                    Add Node
                  </button>
                </form>

                <div className="card-body">
                  <h3 className="section-label">Current Nodes</h3>
                  <pre className="code-block code-block-small">
                    {JSON.stringify(graph?.nodes ?? [], null, 2)}
                  </pre>
                </div>
              </div>

              {/* Edges */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Edges</h2>
                  <span className="card-badge">
                    {graph?.edges.length ?? 0} adet
                  </span>
                </div>

                <form
                  className="form-row form-row-edges"
                  onSubmit={handleAddEdge}
                >
                  <input
                    className="input"
                    placeholder="fromId"
                    value={edgeForm.fromId}
                    onChange={(e) =>
                      setEdgeForm({ ...edgeForm, fromId: e.target.value })
                    }
                  />
                  <input
                    className="input"
                    placeholder="toId"
                    value={edgeForm.toId}
                    onChange={(e) =>
                      setEdgeForm({ ...edgeForm, toId: e.target.value })
                    }
                  />
                  <button className="btn btn-secondary" type="submit">
                    Add Edge
                  </button>
                </form>

                <div className="card-body">
                  <h3 className="section-label">Current Edges</h3>
                  <pre className="code-block code-block-small">
                    {JSON.stringify(graph?.edges ?? [], null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* SAĞ PANEL */}
          <section className="panel panel-right">
            {/* Algorithms */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Algorithms</h2>
              </div>

              <div className="algo-buttons">
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    const res = await runBfs(bfsStartId);
                    setAlgoOutput(res);
                    setColoring(undefined);
                    setHighlightPath(undefined);
                    setCentralityMap(undefined);
                    setTopCentralNodes(undefined);
                    setComponentMap(undefined);

                    const distances = res?.details?.distances as
                      | Record<string, number>
                      | undefined;
                    setBfsDistances(distances);
                    setOutputMode("summary");
                  }}
                >
                  BFS from {bfsStartId}
                </button>

                <button
                  className="btn"
                  onClick={async () => {
                    if (!dijkstraStartId || !dijkstraEndId) {
                      alert(
                        "Dijkstra için önce grafikten başlangıç ve hedef node seçmelisin."
                      );
                      return;
                    }
                    const res = await runDijkstra(
                      dijkstraStartId,
                      dijkstraEndId
                    );
                    setAlgoOutput(res);
                    setColoring(undefined);
                    setCentralityMap(undefined);
                    setTopCentralNodes(undefined);
                    setBfsDistances(undefined);
                    setComponentMap(undefined);

                    const path = res?.details?.path as string[] | undefined;
                    setHighlightPath(path);
                    setOutputMode("summary");
                  }}
                >
                  {dijkstraLabel}
                </button>

                <button
                  className="btn"
                  onClick={async () => {
                    const res = await runConnectedComponents();
                    setAlgoOutput(res);
                    setColoring(undefined);
                    setHighlightPath(undefined);
                    setCentralityMap(undefined);
                    setTopCentralNodes(undefined);
                    setBfsDistances(undefined);

                    const comps = res?.details?.components as
                      | { nodes: string[] }[]
                      | undefined;
                    if (comps) {
                      const map: Record<string, number> = {};
                      comps.forEach((comp, idx) => {
                        comp.nodes.forEach((id) => {
                          map[id] = idx;
                        });
                      });
                      setComponentMap(map);
                    } else {
                      setComponentMap(undefined);
                    }
                    setOutputMode("summary");
                  }}
                >
                  Connected Components
                </button>

                <button
                  className="btn"
                  onClick={async () => {
                    const res = await runWelshPowell();
                    setAlgoOutput(res);
                    if (res && res.details && res.details.colors) {
                      setColoring(res.details.colors as Record<string, number>);
                    }
                    setHighlightPath(undefined);
                    setCentralityMap(undefined);
                    setTopCentralNodes(undefined);
                    setBfsDistances(undefined);
                    setComponentMap(undefined);
                    setOutputMode("summary");
                  }}
                >
                  Welsh–Powell Coloring
                </button>

                <button
                  className="btn"
                  onClick={async () => {
                    const res = await runDegreeCentrality();
                    setAlgoOutput(res);
                    setColoring(undefined);
                    setHighlightPath(undefined);
                    setBfsDistances(undefined);
                    setComponentMap(undefined);
                    processDegreeCentralityResult(res);
                    setOutputMode("summary");
                  }}
                >
                  Degree Centrality
                </button>
              </div>

              <p className="algo-hint">
                BFS: yayılım mesafelerini, Dijkstra: en kısa yolu,
                Connected Components: toplulukları, Welsh–Powell: grafik
                boyamasını, Degree Centrality ise en bağlantılı kullanıcıları
                gösterir.
              </p>

              {topCentralNodes && topCentralNodes.length > 0 && (
                <div className="card-body">
                  <h3 className="section-label">Top Central Nodes (Degree)</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Node ID</th>
                        <th>Degree</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCentralNodes.map((n) => (
                        <tr key={n.id}>
                          <td>{n.id}</td>
                          <td>{n.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Algorithm Output */}
            <div className="card">
              <div className="card-header card-header-output">
                <div>
                  <h2 className="card-title">Algorithm Output</h2>
                  <span className="card-hint">
                    Son çalıştırılan algoritmanın çıktısı
                  </span>
                </div>
                <div className="output-toggle">
                  <button
                    className={`chip ${
                      outputMode === "summary" ? "chip-active" : ""
                    }`}
                    onClick={() => setOutputMode("summary")}
                  >
                    Özet
                  </button>
                  <button
                    className={`chip ${
                      outputMode === "raw" ? "chip-active" : ""
                    }`}
                    onClick={() => setOutputMode("raw")}
                  >
                    JSON
                  </button>
                </div>
              </div>
              <div className="card-body">
                <pre className="code-block code-block-large">
                  {outputMode === "raw"
                    ? JSON.stringify(algoOutput, null, 2)
                    : buildSummary(algoOutput)}
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
