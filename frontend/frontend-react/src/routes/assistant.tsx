import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowRight, Check, Circle, Loader2, AlertCircle } from "lucide-react";
import { agents, suggestedTopics } from "@/lib/ui-config";
import { generateResearch } from "@/services/researchService";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [
    { title: "Research Assistant — ResearchMind AI" },
    { name: "description", content: "Run the multi-agent research pipeline on any topic." },
  ]}),
  component: AssistantPage,
});

type Status = "pending" | "running" | "completed";

function AssistantPage() {
  const [topic, setTopic] = useState("");
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    () => Object.fromEntries(agents.map((a) => [a.name, "pending"])) as Record<string, Status>,
  );
  const research = useMutation({ mutationFn: (t: string) => generateResearch(t) });

  // Animate agent statuses while the request is in flight.
  useEffect(() => {
    if (!research.isPending) return;
    setStatuses(Object.fromEntries(agents.map((a) => [a.name, "pending"])) as Record<string, Status>);
    const timers: number[] = [];
    agents.forEach((a, i) => {
      timers.push(window.setTimeout(() => {
        setStatuses((s) => ({ ...s, [a.name]: "running" }));
      }, 250 + i * 500));
    });
    return () => timers.forEach(window.clearTimeout);
  }, [research.isPending]);

  useEffect(() => {
    if (research.isSuccess) {
      setStatuses(Object.fromEntries(agents.map((a) => [a.name, "completed"])) as Record<string, Status>);
    }
  }, [research.isSuccess]);

  const sections = research.data ? splitReport(research.data.report) : null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Research Assistant</h1>
            <p className="text-sm text-muted-foreground mt-1">Submit a topic — the multi-agent pipeline produces a complete research dashboard.</p>
          </header>

          <form
            onSubmit={(e) => { e.preventDefault(); if (topic.trim()) research.mutate(topic.trim()); }}
            className="mt-6 flex gap-2"
          >
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Multimodal LLMs for clinical reasoning"
              className="flex-1 h-11 rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-foreground/30"
            />
            <button
              type="submit"
              disabled={research.isPending || !topic.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {research.isPending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              {research.isPending ? "Researching…" : "Start research"}
            </button>
          </form>

          {!research.data && !research.isPending && (
            <div className="mt-6 grid sm:grid-cols-3 gap-2">
              {suggestedTopics.slice(0, 3).map((t) => (
                <button
                  key={t.title}
                  onClick={() => { setTopic(t.title); research.mutate(t.title); }}
                  className="text-left rounded-xl border border-border bg-card p-4 text-sm hover:border-foreground/30 transition"
                >
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                </button>
              ))}
            </div>
          )}

          {research.isError && (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm flex items-start gap-2">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>{(research.error as Error).message}</span>
            </div>
          )}

          {research.isPending && <ReportSkeleton />}

          {sections && (
            <div className="mt-10 space-y-10">
              <Section title="Research Report" md={sections.report} />
              <Section title="Key Findings" md={sections.findings} />
              <Section title="Research Gaps" md={sections.gaps} />
              <Section title="Generated Ideas" md={sections.ideas} />
            </div>
          )}
        </div>
      </div>

      <aside className="hidden lg:flex w-80 shrink-0 border-l border-border bg-surface flex-col">
        <div className="px-5 h-14 flex items-center border-b border-border">
          <h2 className="text-sm font-semibold">Agents</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {Object.values(statuses).filter((s) => s === "completed").length}/{agents.length}
          </span>
        </div>
        <div className="p-3 space-y-1.5 overflow-y-auto">
          {agents.map((a) => {
            const s = statuses[a.name];
            return (
              <div key={a.name} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2.5">
                  <StatusIcon status={s} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{a.desc}</div>
                  </div>
                  <StatusBadge status={s} />
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

/**
 * Split the report into the four dashboard sections.
 * Looks for markdown H1/H2 headings containing matching keywords.
 * Falls back to putting the entire report under "Research Report".
 */
function splitReport(md: string) {
  const out = { report: "", findings: "", gaps: "", ideas: "" };
  const blocks = md.split(/\n(?=#{1,3}\s)/);
  let assignedAny = false;
  for (const block of blocks) {
    const head = block.match(/^#{1,3}\s+(.+)/)?.[1]?.toLowerCase() ?? "";
    const body = block.replace(/^#{1,3}\s+.+\n?/, "").trim();
    if (/finding|insight/.test(head)) { out.findings += (out.findings ? "\n\n" : "") + body; assignedAny = true; }
    else if (/gap|open problem|limitation/.test(head)) { out.gaps += (out.gaps ? "\n\n" : "") + body; assignedAny = true; }
    else if (/idea|proposal|future|direction/.test(head)) { out.ideas += (out.ideas ? "\n\n" : "") + body; assignedAny = true; }
    else { out.report += (out.report ? "\n\n" : "") + block; }
  }
  if (!assignedAny) out.report = md;
  return out;
}

function Section({ title, md }: { title: string; md: string }) {
  if (!md.trim()) return null;
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-lg font-semibold tracking-tight border-b border-border pb-2">{title}</h2>
      <article className="mt-4 prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{md}</ReactMarkdown>
      </article>
    </motion.section>
  );
}

function ReportSkeleton() {
  return (
    <div className="mt-10 space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-11/12 bg-muted rounded" />
          <div className="h-3 w-9/12 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "completed") return <div className="size-6 rounded-full bg-foreground text-background grid place-items-center"><Check className="size-3.5" /></div>;
  if (status === "running") return <div className="size-6 rounded-full bg-muted grid place-items-center"><Loader2 className="size-3.5 animate-spin" /></div>;
  return <div className="size-6 rounded-full bg-muted grid place-items-center"><Circle className="size-2 fill-muted-foreground text-muted-foreground" /></div>;
}

function StatusBadge({ status }: { status: Status }) {
  const map = { pending: "text-muted-foreground", running: "text-foreground", completed: "text-muted-foreground" } as const;
  const label = { pending: "Pending", running: "Running", completed: "Done" }[status];
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
        className={cn("text-[10px] uppercase tracking-wider", map[status])}
      >
        {label}
      </motion.span>
    </AnimatePresence>
  );
}
