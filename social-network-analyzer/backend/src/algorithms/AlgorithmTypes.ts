export interface AlgorithmResult {
  algorithm: string;
  details: any;
}

export interface BfsResultDetails {
  startNodeId: string;
  visitOrder: string[];                // sırayla gezilen node id'leri
  distances: Record<string, number>;   // başlangıca uzaklık
}

export interface DijkstraResultDetails {
  startNodeId: string;
  targetNodeId?: string;
  distances: Record<string, number>;         // her node'a en kısa mesafe
  previous: Record<string, string | null>;   // path'i geri yürütmek için
  path?: string[];                           // start → target yolu (eğer target verildiyse)
  totalDistance?: number;                    // hedefe toplam mesafe
}

export interface DfsResultDetails {
  startNodeId: string;
  visitOrder: string[];
}

// ⇩ YENİ: Degree Centrality sonucu
export interface DegreeCentralityEntry {
  nodeId: string;
  degree: number;
}
export interface DegreeCentralityResultDetails {
  degrees: DegreeCentralityEntry[];
  topK: DegreeCentralityEntry[]; // en yüksek K (mesela 5) node
}

// --- Connected Components ---

export interface ConnectedComponent {
  id: number;        // bileşen numarası (0,1,2,...)
  nodes: string[];   // o bileşendeki node id'leri
}

export interface ConnectedComponentsResultDetails {
  components: ConnectedComponent[];
  componentCount: number;
}

// --- Welsh-Powell Coloring ---

export interface WelshPowellResultDetails {
  colors: Record<string, number>; // nodeId -> colorIndex
  colorCount: number;             // toplam kullanılan renk sayısı
  order: string[];                // algoritmanın işlediği sıra (dereceye göre)
}
