import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, RefreshCw, Maximize2 } from "lucide-react";
import { fetchKnowledgeGraph, type GraphData } from "@/services/graphService";
import NodePanel from "@/components/node-panel";

type ForceGraphComponent = React.ComponentType<any>;

export const Route = createFileRoute("/graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — ResearchMind AI" },
      { name: "description", content: "Interactive knowledge graph from the research backend." },
    ],
  }),
  component: GraphPage,
});

function GraphPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["knowledge-graph"],
    queryFn: fetchKnowledgeGraph,
    staleTime: 60_000,
  });

  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const fgRef = useRef<any>(null);
  const [ForceGraph, setForceGraph] = useState<ForceGraphComponent | null>(null);

  useEffect(() => {
    let mounted = true;
    import("react-force-graph-2d").then((m) => {
      if (mounted) setForceGraph(() => m.default as ForceGraphComponent);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const neighborMap = useMemo(() => buildNeighbors(data), [data]);

  const stats = data
    ? { nodes: data.nodes.length, links: data.links.length }
    : { nodes: 0, links: 0 };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="px-6 py-5 border-b border-border flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Graph</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive concept map built from the research backend.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="text-foreground font-medium">{stats.nodes}</span> nodes</span>
            <span><span className="text-foreground font-medium">{stats.links}</span> relationships</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs"
          >
            <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => fgRef.current?.zoomToFit?.(400, 60)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs"
          >
            <Maximize2 className="size-3.5" />
            Fit
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 relative bg-surface subtle-grid overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
              <Loader2 className="size-6 animate-spin" />
              Loading knowledge graph…
            </div>
          </div>
        )}

        {isError && (
          <div className="absolute inset-0 grid place-items-center px-6">
            <div className="max-w-md w-full rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="size-5 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium">Could not load knowledge graph</div>
                  <div className="text-xs opacity-80 mt-1">{(error as Error).message}</div>
                  <button
                    onClick={() => refetch()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium"
                  >
                    <RefreshCw className="size-3.5" /> Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !isError && data && data.nodes.length === 0 && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
            The backend returned an empty graph.
          </div>
        )}

        {data && data.nodes.length > 0 && ForceGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ForceGraph
              ref={fgRef as any}
              width={size.w}
              height={size.h}
              graphData={data as any}
              backgroundColor="rgba(0,0,0,0)"
              nodeLabel={(n: any) => n.name}
              nodeRelSize={5}
              cooldownTicks={120}
              linkColor={(l: any) => {
                const a = nodeId(l.source);
                const b = nodeId(l.target);
                const high =
                  (hovered && (a === hovered || b === hovered)) ||
                  (active && (a === active || b === active));
                return high ? "rgba(250,250,250,0.9)" : "rgba(150,150,150,0.25)";
              }}
              linkWidth={(l: any) => {
                const a = nodeId(l.source);
                const b = nodeId(l.target);
                return (hovered && (a === hovered || b === hovered)) ||
                  (active && (a === active || b === active))
                  ? 1.6
                  : 0.6;
              }}
              onNodeHover={(n: any) => setHovered(n?.id ?? null)}
              onNodeClick={(n: any) => {
                setActive(n.id);
                setOpen(true);
                fgRef.current?.centerAt?.(n.x, n.y, 600);
                fgRef.current?.zoom?.(2.2, 600);
              }}
              nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const label = node.name as string;
                const isHover = hovered === node.id;
                const isActive = active === node.id;
                const isNeighbor =
                  (hovered && neighborMap.get(hovered)?.has(node.id)) ||
                  (active && neighborMap.get(active)?.has(node.id));
                const fontSize = 12 / globalScale;
                ctx.beginPath();
                const r = (node.val ? 3 + Math.min(node.val, 8) : 5) + (isActive ? 2 : 0);
                ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
                ctx.fillStyle = isActive
                  ? "#fafafa"
                  : isHover
                    ? "#e5e5e5"
                    : isNeighbor
                      ? "#a1a1aa"
                      : "#71717a";
                ctx.fill();
                if (isHover || isActive || globalScale > 1.4) {
                  ctx.font = `${fontSize}px Inter, sans-serif`;
                  ctx.fillStyle = "rgba(250,250,250,0.95)";
                  ctx.textAlign = "center";
                  ctx.textBaseline = "top";
                  ctx.fillText(label, node.x, node.y + r + 2);
                }
              }}
            />
          </motion.div>
        )}
      </div>

      <NodePanel name={active} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function nodeId(ref: any): string {
  return typeof ref === "object" ? ref.id : ref;
}

function buildNeighbors(data?: GraphData) {
  const map = new Map<string, Set<string>>();
  if (!data) return map;
  for (const l of data.links) {
    const s = nodeId(l.source);
    const t = nodeId(l.target);
    if (!map.has(s)) map.set(s, new Set());
    if (!map.has(t)) map.set(t, new Set());
    map.get(s)!.add(t);
    map.get(t)!.add(s);
  }
  return map;
}
