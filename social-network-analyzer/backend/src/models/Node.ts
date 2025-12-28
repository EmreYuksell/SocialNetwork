export interface NodeProps {
  id: string;
  name: string;
  activity: number;        // Aktiflik (Özellik I)
  interaction: number;     // Etkileşim (Özellik II)
  connectionCount: number; // Bağlantı sayısı (Özellik III)
}

export class Node {
  id: string;
  name: string;
  activity: number;
  interaction: number;
  connectionCount: number;

  constructor(props: NodeProps) {
    this.id = props.id;
    this.name = props.name;
    this.activity = props.activity;
    this.interaction = props.interaction;
    this.connectionCount = props.connectionCount;
  }
}
