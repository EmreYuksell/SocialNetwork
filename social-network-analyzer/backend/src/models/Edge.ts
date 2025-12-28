import { Node } from "./Node";

export class Edge {
  from: Node;
  to: Node;
  weight: number;

  constructor(from: Node, to: Node, weight: number = 1) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}
