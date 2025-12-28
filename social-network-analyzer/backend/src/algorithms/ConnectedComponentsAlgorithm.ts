import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import {
  AlgorithmResult,
  ConnectedComponent,
  ConnectedComponentsResultDetails,
} from "./AlgorithmTypes";
import { Graph } from "../models/Graph";

export class ConnectedComponentsAlgorithm implements IGraphAlgorithm {
  name = "ConnectedComponents";

  run(graph: Graph, _params: AlgorithmParams): AlgorithmResult {
    const nodes = graph.getAllNodes();
    const visited = new Set<string>();
    const components: ConnectedComponent[] = [];

    let compIndex = 0;

    for (const node of nodes) {
      if (visited.has(node.id)) continue;

      const queue: string[] = [];
      const compNodes: string[] = [];

      queue.push(node.id);
      visited.add(node.id);

      while (queue.length > 0) {
        const currentId = queue.shift()!;
        compNodes.push(currentId);

        const neighbors = graph.getNeighbors(currentId);
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor.id)) {
            visited.add(neighbor.id);
            queue.push(neighbor.id);
          }
        }
      }

      components.push({
        id: compIndex,
        nodes: compNodes,
      });

      compIndex++;
    }

    const details: ConnectedComponentsResultDetails = {
      components,
      componentCount: components.length,
    };

    return {
      algorithm: this.name,
      details,
    };
  }
}
