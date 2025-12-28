import { Node } from "../models/Node";

export class WeightCalculator {
  static calculate(a: Node, b: Node): number {
    const dx = a.activity - b.activity;
    const dy = a.interaction - b.interaction;
    const dz = a.connectionCount - b.connectionCount;

    const distanceSquared = dx * dx + dy * dy + dz * dz;

    // Fark büyüdükçe ağırlık küçülsün
    const weight = 1 / (1 + distanceSquared);

    return weight;
  }
}
