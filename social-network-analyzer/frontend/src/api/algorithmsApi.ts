// frontend/src/api/algorithmsApi.ts
import { api } from "./client";

export async function runBfs(startNodeId: string) {
  const res = await api.get("/algorithms/bfs", { params: { startNodeId } });
  return res.data;
}

export async function runDijkstra(startNodeId: string, targetNodeId: string) {
  const res = await api.get("/algorithms/dijkstra", {
    params: { startNodeId, targetNodeId },
  });
  return res.data;
}

export async function runConnectedComponents() {
  const res = await api.get("/algorithms/connected-components");
  return res.data;
}

export async function runWelshPowell() {
  const res = await api.get("/algorithms/welsh-powell");
  return res.data;
}

// NEW: Degree Centrality
export async function runDegreeCentrality() {
  const res = await api.get("/algorithms/degree-centrality");
  return res.data;
}
