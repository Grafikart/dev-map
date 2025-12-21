import { type MouseEventHandler, useEffect, useMemo } from "react";
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
import { Course } from "../components/Course.tsx";
import useToggle from "../hooks/useToggle.tsx";

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
  const [showCourse, toggleCourse, setCourse] = useToggle(false);
  const { setCenter } = useReactFlow();
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

  useEffect(() => {
    const listener = (e: any) => {
      toggleCourse();
      document.body.classList.add("hide-title");
      console.log(e.detail);
      setCenter(
        e.detail.x + window.innerWidth / 8,
        e.detail.y + (3 * window.innerHeight) / 16,
        {
          duration: 800,
          zoom: 2,
        },
      );
    };
    document.addEventListener("nodeclick", listener);
    return () => {
      document.removeEventListener("nodeclick", listener);
    };
  }, []);

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
      {showCourse && <Course />}
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
        onPaneClick={() => {
          reset();
          setCourse(false);
        }}
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
