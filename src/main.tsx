import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { ReactFlowProvider } from "@xyflow/react";
import type { Graph } from "./type.ts";

fetch("/path.json").then(async (r) => {
  const graph: Graph = await r.json();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ReactFlowProvider>
        <App {...graph} />
      </ReactFlowProvider>
    </StrictMode>,
  );
});
