import { Graph } from "../models/Graph";
import { AlgorithmResult } from "./AlgorithmTypes";

export interface AlgorithmParams {
  startNodeId?: string;
  targetNodeId?: string;
}

export interface IGraphAlgorithm {
  name: string;
  run(graph: Graph, params: AlgorithmParams): AlgorithmResult;
}
