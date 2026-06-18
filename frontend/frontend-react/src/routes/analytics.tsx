import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { analyticsTrend, topicDistribution } from "@/lib/ui-config";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — ResearchMind AI" }, { name: "description", content: "Workspace analytics across papers, reviews, ideas and proposals." }] }),
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
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Trends across your workspace.</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Papers / mo", v: "1,204", d: "+12.4%" },
          { l: "Reviews / mo", v: "32", d: "+8.1%" },
          { l: "Proposals / mo", v: "9", d: "+22%" },
          { l: "Avg. novelty", v: "78", d: "+3 pts" },
        ].map((c) => (
          <div key={c.l} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs text-muted-foreground">{c.l}</div>
            <div className="mt-1 text-2xl font-semibold">{c.v}</div>
            <div className="text-[11px] text-muted-foreground">{c.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <Card title="Papers indexed over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={analyticsTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fg} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={fg} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={stroke} vertical={false} />
              <XAxis dataKey="month" stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="papers" stroke={fg} strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Research topics distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={topicDistribution} dataKey="value" nameKey="topic" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {topicDistribution.map((_, i) => (
                  <Cell key={i} fill={`oklch(${0.35 + i * 0.09} 0 0)`} stroke="var(--card)" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Generated reviews">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analyticsTrend}>
              <CartesianGrid stroke={stroke} vertical={false} />
              <XAxis dataKey="month" stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="reviews" fill={fg} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Proposal activity">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analyticsTrend}>
              <CartesianGrid stroke={stroke} vertical={false} />
              <XAxis dataKey="month" stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={muted} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="proposals" stroke={fg} strokeWidth={2} dot={{ r: 3, fill: fg }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
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
