import { Node, NodeProps } from "./Node";
import { Edge } from "./Edge";
import { WeightCalculator } from "../services/WeightCalculator";

export interface EdgeDTO {
  fromId: string;
  toId: string;
}

export interface GraphDTO {
  nodes: NodeProps[];
  edges: EdgeDTO[];
}

export class Graph {
  private nodes: Map<string, Node> = new Map();
  private edges: Edge[] = [];
  private adjacency: Map<string, Edge[]> = new Map();

  addNode(props: NodeProps): Node {
    if (this.nodes.has(props.id)) {
      throw new Error(`Node with id ${props.id} already exists.`);
    }

    const node = new Node(props);
    this.nodes.set(node.id, node);
    this.adjacency.set(node.id, []);
    return node;
  }

  updateNode(id: string, updates: Partial<NodeProps>): Node {
    const node = this.nodes.get(id);
    if (!node) {
      throw new Error(`Node with id ${id} not found.`);
    }

    if (updates.name !== undefined) node.name = updates.name;
    if (updates.activity !== undefined) node.activity = updates.activity;
    if (updates.interaction !== undefined) node.interaction = updates.interaction;
    if (updates.connectionCount !== undefined)
      node.connectionCount = updates.connectionCount;

    this.recalculateAllWeights();
    return node;
  }

  removeNode(id: string): void {
    if (!this.nodes.has(id)) {
      throw new Error(`Node with id ${id} not found.`);
    }

    this.edges = this.edges.filter(
      (e) => e.from.id !== id && e.to.id !== id
    );

    this.adjacency.delete(id);
    for (const [nodeId, edges] of this.adjacency.entries()) {
      this.adjacency.set(
        nodeId,
        edges.filter((e) => e.to.id !== id)
      );
    }

    this.nodes.delete(id);
  }

  addEdge(fromId: string, toId: string): Edge {
    if (fromId === toId) {
      throw new Error("Self-loop edges are not allowed.");
    }

    const from = this.nodes.get(fromId);
    const to = this.nodes.get(toId);

    if (!from || !to) {
      throw new Error("Both nodes must exist to create an edge.");
    }

    const exists = this.edges.some(
      (e) =>
        (e.from.id === fromId && e.to.id === toId) ||
        (e.from.id === toId && e.to.id === fromId)
    );
    if (exists) {
      throw new Error("Edge already exists between these nodes.");
    }

    const weight = WeightCalculator.calculate(from, to);
    const edge = new Edge(from, to, weight);

    this.edges.push(edge);

    const fromAdj = this.adjacency.get(fromId);
    const toAdj = this.adjacency.get(toId);
    if (fromAdj) fromAdj.push(edge);
    if (toAdj) toAdj.push(new Edge(to, from, weight));

    from.connectionCount++;
    to.connectionCount++;

    return edge;
  }

  removeEdge(fromId: string, toId: string): void {
    this.edges = this.edges.filter(
      (e) =>
        !(
          (e.from.id === fromId && e.to.id === toId) ||
          (e.from.id === toId && e.to.id === fromId)
        )
    );

    const adjFrom = this.adjacency.get(fromId);
    if (adjFrom) {
      this.adjacency.set(
        fromId,
        adjFrom.filter((e) => e.to.id !== toId)
      );
    }

    const adjTo = this.adjacency.get(toId);
    if (adjTo) {
      this.adjacency.set(
        toId,
        adjTo.filter((e) => e.to.id !== fromId)
      );
    }

    const from = this.nodes.get(fromId);
    const to = this.nodes.get(toId);
    if (from && from.connectionCount > 0) from.connectionCount--;
    if (to && to.connectionCount > 0) to.connectionCount--;
  }

  getNode(id: string): Node | undefined {
    return this.nodes.get(id);
  }

  getNeighbors(id: string): Node[] {
    const edges = this.adjacency.get(id) || [];
    return edges.map((e) => e.to);
  }

  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getAllEdges(): Edge[] {
    return this.edges;
  }

  recalculateAllWeights(): void {
    for (const edge of this.edges) {
      edge.weight = WeightCalculator.calculate(edge.from, edge.to);
    }

    for (const edges of this.adjacency.values()) {
      for (const edge of edges) {
        edge.weight = WeightCalculator.calculate(edge.from, edge.to);
      }
    }
  }

  // ========= NEW: persist için yardımcı metodlar =========

  clear(): void {
    this.nodes.clear();
    this.edges = [];
    this.adjacency.clear();
  }

  toDTO(): GraphDTO {
    const nodes: NodeProps[] = this.getAllNodes().map((n) => ({
      id: n.id,
      name: n.name,
      activity: n.activity,
      interaction: n.interaction,
      connectionCount: n.connectionCount,
    }));

    const edges: EdgeDTO[] = this.getAllEdges().map((e) => ({
      fromId: e.from.id,
      toId: e.to.id,
    }));

    return { nodes, edges };
  }

  loadFromDTO(dto: GraphDTO): void {
    this.clear();
    for (const nodeProps of dto.nodes) {
      // connectionCount addEdge ile zaten artacağı için 0 verebiliriz, ama
      // orijinal değeri de saklayalım
      this.addNode(nodeProps);
    }
    for (const edge of dto.edges) {
      try {
        this.addEdge(edge.fromId, edge.toId);
      } catch {
        // duplicate vs. olursa sessiz geç
      }
    }
  }
}
