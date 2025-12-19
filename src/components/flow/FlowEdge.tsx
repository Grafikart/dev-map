import { BaseEdge, getStraightPath } from "@xyflow/react";

type Props = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export function FlowEdge({ id, sourceX, sourceY, targetX, targetY }: Props) {
  // Offset the position of the edge to center it
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 10,
    targetX,
    targetY: targetY + 10,
  });

  return <BaseEdge id={id} path={edgePath} className="react-flow__edge" />;
}
