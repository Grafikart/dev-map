import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type OnConnect,
  type OnConnectEnd,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { CustomNode } from "./components/CustomNode";
import { useSync } from "./hooks/useSync.ts";
import type { Graph } from "./type.ts";
import { Lasso } from "./components/Lasso.tsx";

const nodeTypes = {
  custom: CustomNode,
};

export const App = (data: Graph) => {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const id = Date.now().toString();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          type: "custom",
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { name: "" },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectionState.fromNode!.id,
            target: id,
            sourceHandle: connectionState.fromHandle.id,
          }),
        );
      }
    },
    [screenToFlowPosition],
  );

  const onDblClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const id = Date.now().toString();
    e.preventDefault();
    e.stopPropagation();
    if (e.target.tagName === "INPUT") {
      return;
    }
    setNodes((nodes) => {
      return [
        ...nodes,
        {
          id,
          type: "custom",
          data: {
            name: "",
          },
          position: screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          }),
          origin: [0.5, 0.0],
        },
      ];
    });
  };

  useEffect(() => {
    const listener = (e: Event & { detail: { value: string; id: string } }) => {
      console.log("change listener");
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === e.detail.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  name: e.detail.value,
                },
              }
            : node,
        ),
      );
    };
    document.body.addEventListener("namechange", listener);
    return () => {
      document.body.removeEventListener("namechange", listener);
    };
  }, []);

  useSync(
    useMemo(
      () => ({
        nodes,
        edges,
      }),
      [nodes, edges],
    ),
  );

  const [spacePressed, setSpacePressed] = useState(false);

  useEffect(() => {
    document.body.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        setSpacePressed(true);
      }
    });
    document.body.addEventListener("keyup", (e) => {
      if (e.key === " ") {
        setSpacePressed(false);
      }
    });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      deleteKeyCode={"Delete"}
      defaultEdgeOptions={{
        type: "smoothstep",
        className: "animated",
      }}
      fitView
      className="bg-teal-50"
      onDoubleClickCapture={onDblClick}
    >
      <MiniMap />
      <Controls />
      <Background
        id="1"
        gap={20}
        color="#f1f1f1"
        variant={BackgroundVariant.Lines}
      />
      {spacePressed && <Lasso partial />}
    </ReactFlow>
  );
};
