import { IGraphAlgorithm, AlgorithmParams } from "./IGraphAlgorithm";
import { AlgorithmResult, WelshPowellResultDetails } from "./AlgorithmTypes";
import { Graph } from "../models/Graph";

export class WelshPowellColoringAlgorithm implements IGraphAlgorithm {
  name = "WelshPowellColoring";

  run(graph: Graph, _params: AlgorithmParams): AlgorithmResult {
    const nodes = graph.getAllNodes();

    // 1) Düğümleri dereceye göre azalan sırala
    const ordered = [...nodes].sort(
      (a, b) => graph.getNeighbors(b.id).length - graph.getNeighbors(a.id).length
    );
    const orderIds = ordered.map((n) => n.id);

    // 2) Renk ataması
    const colorOf: Record<string, number> = {};
    let currentColor = 0;

    for (const node of ordered) {
      if (colorOf[node.id] !== undefined) continue;

      // Bu node'a yeni bir renk ver
      colorOf[node.id] = currentColor;

      // Aynı rengi alabilecek diğer düğümleri bul
      for (const other of ordered) {
        if (colorOf[other.id] !== undefined) continue;
        // other, şimdiye kadar bu renge boyanmış düğümlerden hiçbirine komşu olmamalı
        const conflicts = Object.entries(colorOf)
          .filter(([_, c]) => c === currentColor)
          .some(([coloredId]) => {
            const neighbors = graph.getNeighbors(coloredId);
            return neighbors.some((n) => n.id === other.id);
          });

        if (!conflicts) {
          colorOf[other.id] = currentColor;
        }
      }

      currentColor++;
    }

    const details: WelshPowellResultDetails = {
      colors: colorOf,
      colorCount: currentColor,
      order: orderIds,
    };

    return {
      algorithm: this.name,
      details,
    };
  }
}
