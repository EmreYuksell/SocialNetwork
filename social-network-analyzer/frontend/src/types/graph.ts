export interface NodeDto {
  id: string;
  name: string;
  activity: number;
  interaction: number;
  connectionCount: number;
}

export interface EdgeDto {
  from: NodeDto;
  to: NodeDto;
  weight: number;
}

export interface GraphResponse {
  nodes: NodeDto[];
  edges: EdgeDto[];
}
