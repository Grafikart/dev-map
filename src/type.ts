export type Node = {
  id: string;
  type?: string;
  data: {
    name: string;
    progress?: number;
    rotate?: boolean;
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
  data: {
    completed: boolean;
    reachable: boolean;
  };
  type?: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};
