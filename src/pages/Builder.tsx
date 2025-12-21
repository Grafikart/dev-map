import { type MouseEventHandler, useMemo } from "react";
import { ConnectionMode, ReactFlow, useReactFlow } from "@xyflow/react";
import { FlowNode } from "../components/flow/FlowNode.tsx";
import { Lasso } from "../components/Lasso.tsx";
import { snapGrid } from "../utils/2d.ts";
import { IsoBackground } from "../components/IsoBackground.tsx";
import { FlowEdge } from "../components/flow/FlowEdge.tsx";
import { FlowNodeMenu } from "../components/flow/FlowNodeMenu.tsx";
import { GraphContext, useGraph } from "../hooks/useGraph.ts";
import { useContextMenu } from "../hooks/useContextMenu.ts";
import { useKeyDown } from "../hooks/useKeyDown.ts";
import { FlowEdgeMenu } from "../components/flow/FlowEdgeMenu.tsx";

const nodeTypes = {
  default: FlowNode,
  fork: FlowNode,
  formation: FlowNode,
  gate: FlowNode,
};

const edgeTypes = {
  default: FlowEdge,
  primary: FlowEdge,
  secondary: FlowEdge,
};

export const Builder = () => {
  const { screenToFlowPosition } = useReactFlow();
  const spacePressed = useKeyDown(" ");
  const {
    updateNode,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateEdge,
    onConnect,
  } = useGraph();

  const { node, edge, reset, position, open } = useContextMenu(nodes, edges);

  const onDblClick: MouseEventHandler = (e) => {
    if ((e.target as HTMLElement).tagName === "INPUT") {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    addNode(
      screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      }),
    );
  };

  return (
    <GraphContext value={useMemo(() => ({ updateNode }), [updateNode])}>
      <ReactFlow
        maxZoom={2}
        minZoom={0.8}
        snapGrid={snapGrid}
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeContextMenu={(event, edge) => {
          event.preventDefault();
          open(edge.id, {
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onNodeContextMenu={(event, node) => {
          event.preventDefault();
          open(node.id, {
            x: event.clientX,
            y: event.clientY,
          });
        }}
        onPaneClick={reset}
        deleteKeyCode={"Delete"}
        fitView
        onDoubleClickCapture={onDblClick}
      >
        <IsoBackground id="2" gap={snapGrid} color="var(--color-slate-300)" />
        {spacePressed && <Lasso partial />}
      </ReactFlow>
      {edge && (
        <FlowEdgeMenu
          edge={edge}
          position={position}
          onEdgeChange={updateEdge}
        />
      )}
      {node && (
        <FlowNodeMenu
          node={node}
          position={position}
          onNodeChange={updateNode}
        />
      )}
    </GraphContext>
  );
};
