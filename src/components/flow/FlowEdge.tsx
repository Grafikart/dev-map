import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { Edge } from "../../type.ts";
import { clsx } from "clsx";

type Props = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type: string;
  data: Edge["data"];
};

export function FlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  type,
  data,
}: Props) {
  // Offset the position of the edge to center it
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 10,
    targetX,
    targetY: targetY + 10,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className={clsx(
        `react-flow__edge react-flow__edge-${type}`,
        data.completed && "react-flow__edge-done",
        data.reachable && "react-flow__edge-solid",
      )}
    />
  );
}
