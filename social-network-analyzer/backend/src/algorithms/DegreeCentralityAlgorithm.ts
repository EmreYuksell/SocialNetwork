import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import {
  AlgorithmResult,
  DegreeCentralityEntry,
  DegreeCentralityResultDetails,
} from "./AlgorithmTypes";
import { Graph } from "../models/Graph";

export class DegreeCentralityAlgorithm implements IGraphAlgorithm {
  name = "DegreeCentrality";

  // params'ta özel bir şeye ihtiyacımız yok, topK sabit 5
  run(graph: Graph, _params: AlgorithmParams): AlgorithmResult {
    const nodes = graph.getAllNodes();

    const degrees: DegreeCentralityEntry[] = nodes.map((node) => ({
      nodeId: node.id,
      degree: graph.getNeighbors(node.id).length,
    }));

    // büyükten küçüğe sırala
    degrees.sort((a, b) => b.degree - a.degree);

    const K = 5;
    const topK = degrees.slice(0, K);

    const details: DegreeCentralityResultDetails = {
      degrees,
      topK,
    };

    return {
      algorithm: this.name,
      details,
    };
  }
}
