import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { fetchKnowledgeGraph, type GraphData } from "@/services/graphService";
import { useResearchStore } from "@/store/researchStore";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — ResearchMind AI" },
      { name: "description", content: "Live analytics derived from the research backend." },
    ],
  }),
  component: AnalyticsPage,
});

const stroke = "var(--border)";
const fg = "var(--foreground)";
const muted = "var(--muted-foreground)";
const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--foreground)",
} as const;

function AnalyticsPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["knowledge-graph"],
    queryFn: fetchKnowledgeGraph,
    staleTime: 60_000,
  });

  const papers = useResearchStore((s) => s.papers);
  const analyzedCount = useResearchStore((s) => s.analyzedCount);
  const ideas = useResearchStore((s) => s.ideas);
  const ideasCount = ideas ? (ideas.match(/^#{2,3}\s+/gm)?.length ?? (ideas.trim() ? 1 : 0)) : 0;

  const derived = useMemo(() => derive(data), [data]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live metrics derived from the knowledge graph backend.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs"
        >
          <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </button>
      </header>

      {isLoading && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading analytics…
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5" /> {(error as Error).message}
        </div>
      )}

      {data && (
        <>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Papers Retrieved" value={papers?.length ?? 0} />
            <Stat label="Papers Analyzed" value={analyzedCount} />
            <Stat label="Research Ideas Generated" value={ideasCount} />
            <Stat label="Avg. Graph Connections" value={derived.avgDegree.toFixed(1)} />
            <Stat label="Knowledge Graph Nodes" value={derived.nodes} />
            <Stat label="Knowledge Graph Relationships" value={derived.links} />
            <Stat label="Unique Topics" value={derived.groups} />
            <Stat label="Relationship Types" value={derived.relationTypes.length} />
          </div>

          <div className="mt-6 grid lg:grid-cols-2 gap-4">
            <Card title="Research Topic Distribution">
              {derived.topicDist.length === 0 ? (
                <Empty msg="No topic groups in graph data." />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={derived.topicDist} dataKey="value" nameKey="topic" innerRadius={60} outerRadius={95} paddingAngle={2}>
                      {derived.topicDist.map((_, i) => (
                        <Cell key={i} fill={`oklch(${0.35 + i * 0.07} 0 0)`} stroke="var(--card)" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card title="Connectivity Distribution">
              {derived.degreeBuckets.length === 0 ? (
                <Empty msg="No relationship data." />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={derived.degreeBuckets}>
                    <CartesianGrid stroke={stroke} vertical={false} />
                    <XAxis dataKey="bucket" stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill={fg} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card title="Most Connected Concepts">
              {derived.topNodes.length === 0 ? (
                <Empty msg="No nodes available." />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart layout="vertical" data={derived.topNodes} margin={{ left: 20 }}>
                    <CartesianGrid stroke={stroke} horizontal={false} />
                    <XAxis type="number" stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke={muted} fontSize={11} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="degree" fill={fg} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card title="Relationship Types">
              {derived.relationTypes.length === 0 ? (
                <Empty msg="No relationship labels in graph data." />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {derived.relationTypes.map((r) => (
                    <div key={r.type} className="rounded-lg border border-border bg-surface p-3">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{r.type}</div>
                      <div className="mt-1 text-xl font-semibold tabular-nums">{r.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      {children}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="h-[260px] grid place-items-center text-xs text-muted-foreground">{msg}</div>;
}

function nodeId(ref: any) { return typeof ref === "object" ? ref.id : ref; }

function derive(data?: GraphData) {
  if (!data) {
    return {
      nodes: 0, links: 0, groups: 0, avgDegree: 0,
      topicDist: [] as { topic: string; value: number }[],
      degreeBuckets: [] as { bucket: string; count: number }[],
      topNodes: [] as { name: string; degree: number }[],
      relationTypes: [] as { type: string; count: number }[],
    };
  }
  const degree = new Map<string, number>();
  data.nodes.forEach((n) => degree.set(n.id, 0));
  for (const l of data.links) {
    const s = nodeId(l.source); const t = nodeId(l.target);
    degree.set(s, (degree.get(s) ?? 0) + 1);
    degree.set(t, (degree.get(t) ?? 0) + 1);
  }
  const groupMap = new Map<string, number>();
  for (const n of data.nodes) {
    const g = n.group || "Uncategorized";
    groupMap.set(g, (groupMap.get(g) ?? 0) + 1);
  }
  const buckets = [
    { bucket: "1", min: 1, max: 1 },
    { bucket: "2-3", min: 2, max: 3 },
    { bucket: "4-6", min: 4, max: 6 },
    { bucket: "7-10", min: 7, max: 10 },
    { bucket: "10+", min: 11, max: Infinity },
  ];
  const degreeBuckets = buckets.map((b) => ({
    bucket: b.bucket,
    count: [...degree.values()].filter((d) => d >= b.min && d <= b.max).length,
  }));
  const topNodes = data.nodes
    .map((n) => ({ name: n.name, degree: degree.get(n.id) ?? 0 }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 8);
  const relMap = new Map<string, number>();
  for (const l of data.links) {
    const r = l.relation || "related";
    relMap.set(r, (relMap.get(r) ?? 0) + 1);
  }
  const totalDeg = [...degree.values()].reduce((a, b) => a + b, 0);
  return {
    nodes: data.nodes.length,
    links: data.links.length,
    groups: groupMap.size,
    avgDegree: data.nodes.length ? totalDeg / data.nodes.length : 0,
    topicDist: [...groupMap.entries()].map(([topic, value]) => ({ topic, value })),
    degreeBuckets,
    topNodes,
    relationTypes: [...relMap.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
  };
}
