import type { Node, Edge } from "../type.ts";
import { useCallback, useMemo, useState } from "react";
import type { Vec2 } from "../utils/2d.ts";

export function useContextMenu(nodes: Node[], edges: Edge[]) {
  const [selectedId, setId] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return {
    node: useMemo(() => nodes.find((n) => n.id === selectedId), [selectedId]),
    edge: useMemo(() => edges.find((e) => e.id === selectedId), [selectedId]),
    open: useCallback((id: string, p: Vec2) => {
      setId(id);
      setPosition(p);
    }, []),
    position,
    reset: () => setId(""),
  };
}
