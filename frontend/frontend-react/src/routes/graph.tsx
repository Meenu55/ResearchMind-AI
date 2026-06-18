import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [{ title: "Knowledge Graph — ResearchMind AI" }, { name: "description", content: "Interactive knowledge graph of concepts, technologies, methods and applications." }] }),
  component: GraphPage,
});

function GraphPage() {
  const { nodes, edges } = useMemo(() => buildGraph(), []);
  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-2xl font-semibold tracking-tight">Knowledge Graph</h1>
        <p className="text-sm text-muted-foreground mt-1">Concepts · Technologies · Methods · Applications</p>
      </div>
      <div className="flex-1 bg-surface">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          panOnScroll
        >
          <Background gap={24} size={1} color="var(--border)" />
          <MiniMap pannable zoomable className="!bg-card !border !border-border" />
          <Controls className="!bg-card !border !border-border [&_button]:!bg-card [&_button]:!border-border" />
        </ReactFlow>
      </div>
    </div>
  );
}

const kindStyle: Record<string, string> = {
  concept: "bg-foreground text-background",
  tech: "bg-card border border-border",
  method: "bg-card border border-border",
  app: "bg-card border border-border",
};

function n(id: string, label: string, x: number, y: number, kind: keyof typeof kindStyle = "tech"): Node {
  return {
    id,
    position: { x, y },
    data: { label: <div className={`rounded-md px-3 py-1.5 text-xs font-medium ${kindStyle[kind]}`}>{label}</div> },
    type: "default",
    style: { background: "transparent", border: "none", padding: 0, boxShadow: "none", width: "auto" },
  };
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    n("agentic", "Agentic AI", 0, 0, "concept"),
    n("rag", "RAG", -240, -120),
    n("tools", "Tool Use", 240, -120),
    n("reflect", "Self-Reflection", 240, 120),
    n("memory", "Memory", -240, 120),
    n("llm", "LLMs", 0, -240, "concept"),
    n("multimodal", "Multimodal", -380, -240, "concept"),
    n("vision", "Vision", -560, -120),
    n("speech", "Speech", -560, 30),
    n("clinic", "Clinical AI", 380, 0, "app"),
    n("discovery", "Scientific Discovery", 0, 260, "app"),
    n("eval", "Evaluation", -120, 260, "method"),
    n("bench", "Benchmarks", 140, 260, "method"),
  ];
  const e = (s: string, t: string): Edge => ({
    id: `${s}-${t}`, source: s, target: t, animated: false,
    style: { stroke: "var(--border)" },
  });
  const edges = [
    e("agentic", "rag"), e("agentic", "tools"), e("agentic", "reflect"), e("agentic", "memory"),
    e("llm", "agentic"), e("llm", "multimodal"),
    e("multimodal", "vision"), e("multimodal", "speech"),
    e("agentic", "clinic"), e("agentic", "discovery"),
    e("eval", "discovery"), e("bench", "discovery"),
    e("multimodal", "clinic"),
  ];
  return { nodes, edges };
}
