import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import { AlgorithmResult, BfsResultDetails } from "./AlgorithmTypes";
import { Graph } from "../models/Graph";
import { Node } from "../models/Node";

export class BfsAlgorithm implements IGraphAlgorithm {
  name = "BFS";

  run(graph: Graph, params: AlgorithmParams): AlgorithmResult {
    const startId = params.startNodeId;
    if (!startId) {
      throw new Error("BFS requires 'startNodeId' parameter.");
    }

    const startNode = graph.getNode(startId);
    if (!startNode) {
      throw new Error(`Start node with id ${startId} not found.`);
    }

    const visited = new Set<string>();
    const queue: Node[] = [];
    const visitOrder: string[] = [];
    const distances: Record<string, number> = {};

    queue.push(startNode);
    visited.add(startNode.id);
    distances[startNode.id] = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      visitOrder.push(current.id);

      const neighbors = graph.getNeighbors(current.id);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          queue.push(neighbor);
          distances[neighbor.id] = distances[current.id] + 1;
        }
      }
    }

    const details: BfsResultDetails = {
      startNodeId: startNode.id,
      visitOrder,
      distances,
    };

    return {
      algorithm: this.name,
      details,
    };
  }
}
