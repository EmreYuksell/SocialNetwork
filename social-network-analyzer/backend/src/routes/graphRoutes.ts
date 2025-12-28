import { Router } from "express";
import { graphInstance } from "../graphInstance";
import { NodeProps } from "../models/Node";
import { GraphJsonStorage } from "../services/GraphJsonStorage";

export const graphRouter = Router();

// Tüm grafı getir
graphRouter.get("/", (_req, res) => {
  const nodes = graphInstance.getAllNodes();
  const edges = graphInstance.getAllEdges();

  res.json({ nodes, edges });
});

// Node ekle
graphRouter.post("/nodes", (req, res) => {
  try {
    const props: NodeProps = req.body;
    const node = graphInstance.addNode(props);
    res.status(201).json(node);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Node güncelle
graphRouter.put("/nodes/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const node = graphInstance.updateNode(id, updates);
    res.json(node);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Node sil
graphRouter.delete("/nodes/:id", (req, res) => {
  try {
    const id = req.params.id;
    graphInstance.removeNode(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Edge ekle
graphRouter.post("/edges", (req, res) => {
  try {
    const { fromId, toId } = req.body;
    const edge = graphInstance.addEdge(fromId, toId);
    res.status(201).json(edge);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Edge sil
graphRouter.delete("/edges", (req, res) => {
  try {
    const { fromId, toId } = req.body;
    graphInstance.removeEdge(fromId, toId);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
// Grafı JSON dosyaya kaydet
graphRouter.post("/save", async (_req, res) => {
  try {
    await GraphJsonStorage.save(graphInstance);
    res.json({ message: "Graph saved." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// JSON dosyadan grafı yükle
graphRouter.post("/load", async (_req, res) => {
  try {
    await GraphJsonStorage.load(graphInstance);
    const nodes = graphInstance.getAllNodes();
    const edges = graphInstance.getAllEdges();
    res.json({ message: "Graph loaded.", nodes, edges });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});