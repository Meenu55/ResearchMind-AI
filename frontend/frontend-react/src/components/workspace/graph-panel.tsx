import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { Maximize2 } from "lucide-react";
import { useTopic } from "@/context/TopicContext";
import { useResearchStore } from "@/store/researchStore";
import { fetchKnowledgeGraph } from "@/services/graphService";
import { GraphSkeleton, ErrorState, EmptyState } from "./states";

function Inner() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.graph);
  const setGraph = useResearchStore((s) => s.setGraph);

  const q = useQuery({
    queryKey: ["ws-graph", topic],
    queryFn: fetchKnowledgeGraph,
    enabled: !!topic && !cached,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (q.data) setGraph(q.data);
  }, [q.data, setGraph]);

  const g = cached ?? q.data;

  const { initialNodes, initialEdges } = useMemo(() => {
    if (!g) return { initialNodes: [] as Node[], initialEdges: [] as Edge[] };
    const N = g.nodes.length || 1;
    const R = 220 + Math.min(380, N * 6);
    const nodes: Node[] = g.nodes.map((n, i) => {
      const a = (i / N) * Math.PI * 2;
      return {
        id: n.id,
        position: { x: Math.cos(a) * R, y: Math.sin(a) * R },
        data: { label: n.name },
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "6px 10px",
          fontSize: 12,
          fontWeight: 500,
        },
      };
    });
    const edges: Edge[] = g.links.map((l, i) => ({
      id: `e-${i}`,
      source: String(l.source),
      target: String(l.target),
      label: l.relation,
      animated: false,
      style: { stroke: "var(--muted-foreground)", strokeOpacity: 0.45 },
      labelStyle: { fill: "var(--muted-foreground)", fontSize: 10 },
    }));
    return { initialNodes: nodes, initialEdges: edges };
  }, [g]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (g) setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [g, fitView]);

  if (q.isLoading) return <GraphSkeleton />;
  if (q.isError) return <ErrorState message={(q.error as Error).message} onRetry={() => q.refetch()} />;
  if (!g || g.nodes.length === 0)
    return <EmptyState title="No graph yet" hint="The backend hasn't returned a knowledge graph for this topic." />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div><span className="text-foreground font-semibold">{g.nodes.length}</span> nodes</div>
        <div><span className="text-foreground font-semibold">{g.links.length}</span> relationships</div>
        <button
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium"
        >
          <Maximize2 className="size-3.5" /> Fit view
        </button>
      </div>
      <div className="h-[560px] rounded-2xl border border-border bg-card overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.1}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border)" />
          <MiniMap
            pannable
            zoomable
            maskColor="color-mix(in oklab, var(--background) 80%, transparent)"
            nodeColor={() => "var(--muted-foreground)"}
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          />
          <Controls showInteractive={false} className="!bg-card !border-border" />
        </ReactFlow>
      </div>
    </div>
  );
}

export function GraphPanel() {
  return (
    <ReactFlowProvider>
      <Inner />
    </ReactFlowProvider>
  );
}
