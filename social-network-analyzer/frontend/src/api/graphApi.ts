import { api } from "./client";
import type { GraphResponse, NodeDto } from "../types/graph";

export async function getGraph(): Promise<GraphResponse> {
  const res = await api.get<GraphResponse>("/graph");
  return res.data;
}

export async function addNode(node: NodeDto): Promise<NodeDto> {
  const res = await api.post<NodeDto>("/graph/nodes", node);
  return res.data;
}

export async function addEdge(fromId: string, toId: string) {
  const res = await api.post("/graph/edges", { fromId, toId });
  return res.data;
}
