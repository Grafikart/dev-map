export type Node = {
  id: string;
  type: string;
  data: {
    name: string;
  };
  position: {
    x: number;
    y: number;
  };
};

export type Edge = {
  id: string;
  source: string;
  target: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};
