import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import { AlgorithmResult, DfsResultDetails } from "./AlgorithmTypes";
import { Graph } from "../models/Graph";

export class DfsAlgorithm implements IGraphAlgorithm {
  name = "DFS";

  run(graph: Graph, params: AlgorithmParams): AlgorithmResult {
    const startId = params.startNodeId;
    if (!startId) {
      throw new Error("DFS requires 'startNodeId' parameter.");
    }

    const startNode = graph.getNode(startId);
    if (!startNode) {
      throw new Error(`Start node with id ${startId} not found.`);
    }

    const visited = new Set<string>();
    const visitOrder: string[] = [];

    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      visitOrder.push(nodeId);

      const neighbors = graph.getNeighbors(nodeId);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          dfs(neighbor.id);
        }
      }
    };

    dfs(startNode.id);

    const details: DfsResultDetails = {
      startNodeId: startNode.id,
      visitOrder,
    };

    return {
      algorithm: this.name,
      details,
    };
  }
}
