// frontend/src/components/GraphCanvas.tsx
import type { GraphResponse } from "../types/graph";

/* eslint-disable @typescript-eslint/no-unused-vars */

type ColoringMap = Record<string, number>;

interface GraphCanvasProps {
  graph: GraphResponse | null;
  coloring?: ColoringMap;      // Welsh–Powell: nodeId -> colorIndex
  highlightPath?: string[];    // Dijkstra path: ["1","2","3",...]
  selectedNodeId?: string;     // BFS için seçili node
  onNodeClick?: (nodeId: string) => void;
  centralityMap?: Record<string, number>; // degree centrality için
  dijkstraStartId?: string;
  dijkstraEndId?: string;

  // Yeni ekler:
  bfsDistances?: Record<string, number>;  // BFS mesafeleri
  componentMap?: Record<string, number>;  // nodeId -> componentIndex
}

const COLOR_PALETTE = [
  "#ff6b6b",
  "#4ecdc4",
  "#ffd93b",
  "#1a535c",
  "#ff9f1c",
  "#9b5de5",
  "#00bbf9",
  "#00f5d4",
];

// BFS için basit gradient
const BFS_COLORS = ["#22c55e", "#84cc16", "#facc15", "#f97316", "#ef4444"];

export function GraphCanvas({
  graph,
  coloring,
  highlightPath,
  selectedNodeId,
  onNodeClick,
  centralityMap,
  dijkstraStartId,
  dijkstraEndId,
  bfsDistances,
  componentMap,
}: GraphCanvasProps) {
  if (!graph || graph.nodes.length === 0) {
    return <div style={{ padding: 16 }}>Henüz node yok, ekleyince burada göreceksin.</div>;
  }

  const width = 600;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 50;

  // Node pozisyonlarını daire etrafına diz
  const nodePositions = graph.nodes.reduce<Record<string, { x: number; y: number }>>(
    (acc, node, index) => {
      const angle = (2 * Math.PI * index) / graph.nodes.length;
      acc[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
      return acc;
    },
    {}
  );

  // highlightPath'te sırayla geçen edge'leri set'e koy
  const highlightedEdges = new Set<string>();
  if (highlightPath && highlightPath.length > 1) {
    for (let i = 0; i < highlightPath.length - 1; i++) {
      const a = highlightPath[i];
      const b = highlightPath[i + 1];
      const key = [a, b].sort().join("->"); // yönsüz edge anahtarı
      highlightedEdges.add(key);
    }
  }

  const isEdgeHighlighted = (fromId: string, toId: string) => {
    const key = [fromId, toId].sort().join("->");
    return highlightedEdges.has(key);
  };

  // Welsh–Powell default rengi
  const getWelshColor = (nodeId: string) => {
    if (!coloring) return "#ffffff";
    const idx = coloring[nodeId] ?? 0;
    return COLOR_PALETTE[idx % COLOR_PALETTE.length];
  };

  // BFS renklendirme
  const maxDistance =
    bfsDistances && Object.keys(bfsDistances).length > 0
      ? Math.max(...Object.values(bfsDistances))
      : 0;

  const getBfsColor = (nodeId: string) => {
    if (!bfsDistances || maxDistance === 0) return null;
    const d = bfsDistances[nodeId];
    if (d == null || d === Infinity) return "#444"; // ulaşılamayanlar
    const idx = Math.min(
      BFS_COLORS.length - 1,
      Math.floor((d / maxDistance) * (BFS_COLORS.length - 1))
    );
    return BFS_COLORS[idx];
  };

  // Connected components renklendirme
  const getComponentColor = (nodeId: string) => {
    if (!componentMap) return null;
    const compIndex = componentMap[nodeId];
    if (compIndex == null) return "#ffffff";
    return COLOR_PALETTE[compIndex % COLOR_PALETTE.length];
  };

  // Degree centrality'ye göre radius
  let radiusForNode = (id: string) => 18; // default
  if (centralityMap) {
    const values = Object.values(centralityMap);
    if (values.length > 0) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const span = max - min || 1;
      const minR = 14;
      const maxR = 28;

      radiusForNode = (id: string) => {
        const v = centralityMap[id];
        if (v == null) return 18;
        const t = (v - min) / span; // 0..1
        return minR + t * (maxR - minR);
      };
    }
  }

  return (
    <svg
      width={width}
      height={height}
      style={{
        background: "#181818",
        borderRadius: 12,
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
      }}
    >
      {/* Kenarlar */}
      {graph.edges.map((edge, idx) => {
        const fromPos = nodePositions[edge.from.id];
        const toPos = nodePositions[edge.to.id];
        if (!fromPos || !toPos) return null;

        const highlighted = isEdgeHighlighted(edge.from.id, edge.to.id);

        return (
          <g key={idx}>
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={highlighted ? "#ffcc00" : "#888"}
              strokeWidth={highlighted ? 4 : 2}
            />
            {/* Ağırlığı kenarın ortasında göster */}
            <text
              x={(fromPos.x + toPos.x) / 2}
              y={(fromPos.y + toPos.y) / 2}
              fill="#ccc"
              fontSize={10}
              textAnchor="middle"
            >
              {edge.weight.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Node'lar */}
      {graph.nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;

        // Öncelik: BFS renklendirme > Component renklendirme > Welsh–Powell
        const bfsColor = getBfsColor(node.id);
        const compColor = getComponentColor(node.id);
        const baseFill = bfsColor || compColor || getWelshColor(node.id);

        const isSelected = node.id === selectedNodeId;
        const isStart = node.id === dijkstraStartId;
        const isEnd = node.id === dijkstraEndId;

        const baseRadius = radiusForNode(node.id);
        const r = isSelected ? baseRadius + 4 : baseRadius;

        let strokeColor = "#ffffff";
        let strokeWidth = 2;

        if (isStart) {
          strokeColor = "#00ff7f"; // yeşil
          strokeWidth = 4;
        } else if (isEnd) {
          strokeColor = "#ff4d4f"; // kırmızı
          strokeWidth = 4;
        } else if (isSelected) {
          strokeColor = "#00e0ff";
          strokeWidth = 4;
        }

        return (
          <g
            key={node.id}
            onClick={() => onNodeClick?.(node.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Tooltip – browser default tooltip */}
            <title>
              {`id: ${node.id}
name: ${node.name}
activity: ${node.activity}
interaction: ${node.interaction}
connections: ${node.connectionCount}`}
            </title>

            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={baseFill}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <text
              x={pos.x}
              y={pos.y + 4}
              textAnchor="middle"
              fill="#000"
              fontWeight="bold"
              fontSize={12}
            >
              {node.id}
            </text>
            <text
              x={pos.x}
              y={pos.y + 30}
              textAnchor="middle"
              fill="#fff"
              fontSize={10}
            >
              {node.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
