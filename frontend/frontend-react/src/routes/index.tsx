import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Search, BookOpen, FileText, Database, Sparkles, Network,
  FileSearch, Microscope, Lightbulb, Activity as ActivityIcon,
} from "lucide-react";
import { suggestedTopics } from "@/lib/ui-config";
import { useResearchStore, type Activity } from "@/store/researchStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResearchMind AI — Home" },
      { name: "description", content: "The multi-agent research intelligence workspace. Search papers, generate reviews, surface gaps and draft proposals." },
    ],
  }),
  component: HomePage,
});

const placeholders = [
  "Find research gaps in Agentic AI",
  "Generate a literature review on multimodal learning",
  "Create a proposal for AI in healthcare",
];

const iconForActivity: Record<Activity["type"], any> = {
  Search: Search,
  Analyze: Microscope,
  Ideas: Sparkles,
  Proposal: FileText,
  Review: BookOpen,
  Gaps: Lightbulb,
  Graph: Network,
  Semantic: Database,
};

function relTime(t: number) {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

function countIdeas(md: string) {
  if (!md) return 0;
  const m = md.match(/^#{2,3}\s+/gm);
  return m ? m.length : (md.trim() ? 1 : 0);
}

function HomePage() {
  const navigate = useNavigate();
  const [ask, setAsk] = useState("");

  const {
    researchReport, papers, ideas, graph, activity, analyzedCount, proposal, literatureReview,
  } = useResearchStore();

  const metrics = useMemo(() => {
    const reportsGenerated = (researchReport ? 1 : 0) + (literatureReview ? 1 : 0) + (proposal ? 1 : 0);
    return [
      { label: "Research Reports Generated", value: reportsGenerated || "—", hint: "Reports, reviews & proposals" },
      { label: "Papers Analyzed", value: analyzedCount || "—", hint: "Reader Agent runs" },
      { label: "Papers Retrieved", value: papers?.length ?? "—", hint: "Current topic" },
      { label: "Ideas Generated", value: countIdeas(ideas) || "—", hint: "Innovation Agent" },
      { label: "Knowledge Graph Nodes", value: graph?.nodes?.length ?? "—", hint: "Graph Agent" },
      { label: "Graph Relationships", value: graph?.links?.length ?? "—", hint: "Extracted edges" },
    ];
  }, [researchReport, literatureReview, proposal, papers, ideas, graph, analyzedCount]);

  const submitAsk = (text?: string) => {
    const t = (text ?? ask).trim();
    if (!t) return;
    navigate({ to: "/assistant", search: { topic: t } });
  };

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-[420px] subtle-grid opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-foreground pulse-dot" />
            7 research agents online
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight">
            ResearchMind <span className="text-muted-foreground">AI</span>
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Multi-Agent Research Intelligence Platform
          </p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-10 mx-auto max-w-2xl"
          >
            <form
              onSubmit={(e) => { e.preventDefault(); submitAsk(); }}
              className="group relative rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-30px_rgba(0,0,0,0.6)]"
            >
              <Search className="size-4 absolute left-5 top-5 text-muted-foreground" />
              <textarea
                rows={2}
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAsk(); } }}
                placeholder="Ask ResearchMind…"
                className="w-full resize-none bg-transparent pl-12 pr-32 py-4 text-base outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                disabled={!ask.trim()}
              >
                Ask <ArrowUpRight className="size-3.5" />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              {placeholders.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setAsk(p); submitAsk(p); }}
                  className="rounded-full border border-border bg-card/60 px-2.5 py-1 hover:border-foreground/30 hover:text-foreground transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Topics */}
        <div className="mt-16">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Suggested topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {suggestedTopics.map((t, i) => (
              <motion.button
                key={t.title}
                type="button"
                onClick={() => navigate({ to: "/assistant", search: { topic: t.title } })}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                whileHover={{ y: -2 }}
                className="text-left rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-foreground/30 transition-colors"
              >
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Workspace overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{m.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{m.hint}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent activity</h2>
          {activity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/60 p-8 text-center">
              <div className="mx-auto size-10 rounded-full border border-border grid place-items-center mb-3">
                <ActivityIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">No activity yet</div>
              <div className="text-xs text-muted-foreground mt-1">
                Start a research topic to see agent activity here.
              </div>
              <button
                onClick={() => navigate({ to: "/assistant" })}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90"
              >
                Start research <ArrowUpRight className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {activity.slice(0, 10).map((a, i) => {
                const Icon = iconForActivity[a.type] ?? FileSearch;
                return (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <div className="size-9 rounded-lg bg-muted grid place-items-center shrink-0">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate">{a.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.type}</div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">{relTime(a.time)}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
