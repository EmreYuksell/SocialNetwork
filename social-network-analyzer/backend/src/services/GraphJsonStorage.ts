import { Graph, GraphDTO } from "../models/Graph";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(__dirname, "../../data/graph.json");

export class GraphJsonStorage {
  static async save(graph: Graph): Promise<void> {
    const dto: GraphDTO = graph.toDTO();
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(dto, null, 2), "utf-8");
    console.log("[GraphJsonStorage] Graph saved to", DATA_FILE);
  }

  static async load(graph: Graph): Promise<void> {
    try {
      const content = await fs.readFile(DATA_FILE, "utf-8");
      const dto = JSON.parse(content) as GraphDTO;
      graph.loadFromDTO(dto);
      console.log("[GraphJsonStorage] Graph loaded from", DATA_FILE);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.log("[GraphJsonStorage] No existing graph file, starting empty.");
        return;
      }
      console.error("[GraphJsonStorage] Error loading graph:", err);
    }
  }
}
