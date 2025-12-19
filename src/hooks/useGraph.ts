import type { Edge, Graph, Node } from "../type.ts";
import { createContext, useCallback, useContext, useEffect } from "react";
import {
  addEdge,
  type OnConnect,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { url } from "../utils/url.ts";

/**
 * Custom hook that manages the state of a graph, including nodes, edges, and interactions between them.
 */
export const useGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Initial fetch
  useEffect(() => {
    fetch(url("path.json"))
      .then((r) => r.json() as Promise<Graph>)
      .then((graph) => {
        setNodes(graph.nodes);
        setEdges(
          graph.edges.map((e) => ({
            ...e,
            id: `${e.source}-${e.target}`,
            deletable: true,
          })),
        );
      });
  }, []);

  // Push change to the server everytime a node is updated
  useEffect(() => {
    if (nodes.length === 0) {
      return;
    }
    const data = { nodes, edges };
    const timer = setTimeout(async () => {
      const r = await fetch("/api", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        alert("Erreur lors de la synchronisation");
      }
    }, 3_000);
    return () => {
      clearTimeout(timer);
    };
  }, [nodes, edges]);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edges) => addEdge(params, edges)),
    [],
  );
  const addNode = useCallback(({ x, y }: { x: number; y: number }) => {
    const id = Date.now().toString();
    setNodes((nodes) => [
      ...nodes,
      {
        id,
        data: {
          name: "",
        },
        position: { x, y },
        origin: [0.5, 0.5],
      },
    ]);
  }, []);
  const updateNode = useCallback((node: { id: string } & Partial<Node>) => {
    setNodes((nodes) =>
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              ...node,
            }
          : n,
      ),
    );
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNode,
    addNode,
  };
};

export const GraphContext = createContext<
  Pick<ReturnType<typeof useGraph>, "updateNode">
>({ updateNode: () => {} });

export const useNodeUpdate = () => useContext(GraphContext).updateNode;
