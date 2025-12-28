import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import { AlgorithmResult, DijkstraResultDetails } from "./AlgorithmTypes";
import { Graph } from "../models/Graph";
import { Edge } from "../models/Edge";

export class DijkstraAlgorithm implements IGraphAlgorithm {
  name = "Dijkstra";

  run(graph: Graph, params: AlgorithmParams): AlgorithmResult {
    const startId = params.startNodeId;
    if (!startId) {
      throw new Error("Dijkstra requires 'startNodeId' parameter.");
    }

    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    if (!graph.getNode(startId)) {
      throw new Error(`Start node with id ${startId} not found.`);
    }

    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    for (const node of nodes) {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    }
    distances[startId] = 0;

    // yardımcı: iki node arasındaki edge ağırlığını bul
    const getWeight = (fromId: string, toId: string): number | null => {
      const e = edges.find(
        (edge: Edge) =>
          (edge.from.id === fromId && edge.to.id === toId) ||
          (edge.from.id === toId && edge.to.id === fromId)
      );
      return e ? e.weight : null;
    };

    while (unvisited.size > 0) {
      // unvisited içinden en küçük distance'a sahip node'u bul
      let currentId: string | null = null;
      let currentDist = Infinity;
      for (const id of unvisited) {
        if (distances[id] < currentDist) {
          currentDist = distances[id];
          currentId = id;
        }
      }

      if (currentId === null) break;

      unvisited.delete(currentId);

      // komşulara bak
      for (const neighbor of graph.getNeighbors(currentId)) {
        if (!unvisited.has(neighbor.id)) continue;

        const w = getWeight(currentId, neighbor.id);
        if (w == null) continue;

        const alt = distances[currentId] + w;
        if (alt < distances[neighbor.id]) {
          distances[neighbor.id] = alt;
          previous[neighbor.id] = currentId;
        }
      }
    }

    let path: string[] | undefined = undefined;
    let totalDistance: number | undefined = undefined;

    if (params.targetNodeId) {
      const targetId = params.targetNodeId;
      if (!graph.getNode(targetId)) {
        throw new Error(`Target node with id ${targetId} not found.`);
      }

      path = [];
      let current: string | null = targetId;
      while (current) {
        path.unshift(current);
        current = previous[current];
      }

      // eğer yol gerçekten start'tan başlamıyorsa, path geçersizdir
      if (path[0] !== startId) {
        path = undefined;
      } else {
        totalDistance = distances[targetId];
      }
    }

    const details: DijkstraResultDetails = {
      startNodeId: startId,
      targetNodeId: params.targetNodeId,
      distances,
      previous,
      path,
      totalDistance
    };

    return {
      algorithm: this.name,
      details
    };
  }
}
