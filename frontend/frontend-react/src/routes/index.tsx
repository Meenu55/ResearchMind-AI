import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, BookOpen, FileText, Database, Sparkles, Network } from "lucide-react";
import { suggestedTopics, dashboardMetrics, recentActivity } from "@/lib/ui-config";

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

const iconFor: Record<string, any> = {
  Review: BookOpen, Proposal: FileText, Index: Database, Graph: Network, Gap: Sparkles,
};

function HomePage() {
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
            <div className="group relative rounded-2xl border border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-30px_rgba(0,0,0,0.6)]">
              <Search className="size-4 absolute left-5 top-5 text-muted-foreground" />
              <textarea
                rows={2}
                placeholder="Ask ResearchMind…"
                className="w-full resize-none bg-transparent pl-12 pr-32 py-4 text-base outline-none placeholder:text-muted-foreground"
              />
              <Link
                to="/assistant"
                className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                Ask <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              {placeholders.map((p) => (
                <span key={p} className="rounded-full border border-border bg-card/60 px-2.5 py-1">{p}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Topics */}
        <div className="mt-16">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Suggested topics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {suggestedTopics.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-border bg-card p-4 cursor-pointer hover:border-foreground/30 transition-colors"
              >
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Workspace overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {dashboardMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{m.value}</div>
                <div className="mt-1 text-[11px] text-muted-foreground">{m.delta}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="mt-12">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent activity</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {recentActivity.map((a, i) => {
              const Icon = iconFor[a.type] ?? Sparkles;
              return (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="size-9 rounded-lg bg-muted grid place-items-center shrink-0">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.type}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{a.time}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
