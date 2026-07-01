import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Loader2, BookOpen, FileSearch, Network,
  Lightbulb, Sparkles, FileText, Search, ScrollText, RefreshCw, Check, Wand2,
} from "lucide-react";
import { suggestedTopics } from "@/lib/ui-config";
import { generateResearch } from "@/services/researchService";
import { useResearchStore, type WorkspaceTab } from "@/store/researchStore";
import { TopicProvider, useTopic } from "@/context/TopicContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ReportPanel, PapersPanel, ReviewPanel,
  GapsPanel, IdeasPanel, ProposalPanel, GraphPanel, SemanticPanel,
} from "@/components/workspace/panels";
import { ErrorState } from "@/components/workspace/states";

type AssistantSearch = { topic?: string; tab?: WorkspaceTab };

const VALID_TABS: WorkspaceTab[] = ["report", "papers", "semantic", "review", "gaps", "ideas", "proposal", "graph"];

export const Route = createFileRoute("/assistant")({
  validateSearch: (s: Record<string, unknown>): AssistantSearch => ({
    topic: typeof s.topic === "string" ? s.topic : undefined,
    tab: typeof s.tab === "string" && (VALID_TABS as string[]).includes(s.tab)
      ? (s.tab as WorkspaceTab) : undefined,
  }),
  head: () => ({ meta: [
    { title: "Research Workspace — ResearchMind AI" },
    { name: "description", content: "Enter a topic once, then explore the report, papers, gaps, ideas, review, proposal and knowledge graph." },
  ]}),
  component: () => (
    <TopicProvider>
      <AssistantPage />
    </TopicProvider>
  ),
});

const TABS: { value: WorkspaceTab; label: string; icon: any }[] = [
  { value: "report",   label: "Report",            icon: ScrollText },
  { value: "papers",   label: "Papers",            icon: FileSearch },
  { value: "semantic", label: "Semantic Search",   icon: Wand2 },
  { value: "review",   label: "Literature Review", icon: BookOpen },
  { value: "gaps",     label: "Research Gaps",     icon: Lightbulb },
  { value: "ideas",    label: "Ideas",             icon: Sparkles },
  { value: "proposal", label: "Proposal",          icon: FileText },
  { value: "graph",    label: "Knowledge Graph",   icon: Network },
];

const AGENTS = [
  { key: "search",   label: "Search Agent" },
  { key: "review",   label: "Review Agent" },
  { key: "gap",      label: "Gap Agent" },
  { key: "proposal", label: "Proposal Agent" },
];

function AssistantPage() {
  const { topic: topicParam, tab: tabParam } = Route.useSearch();
  const navigate = Route.useNavigate();

  const { topic: currentTopic, resetForNewTopic } = useTopic();
  const researchReport = useResearchStore((s) => s.researchReport);
  const activeTab = useResearchStore((s) => s.activeTab);
  const setReport = useResearchStore((s) => s.setReport);
  const setActiveTab = useResearchStore((s) => s.setActiveTab);

  const [draft, setDraft] = useState(currentTopic);
  const [editing, setEditing] = useState(!currentTopic);

  const research = useMutation({
    mutationFn: (t: string) => generateResearch(t),
    onSuccess: (data) => {
      setReport(data.report ?? "");
      setActiveTab("report");
    },
  });

  // Sync URL ?tab=
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) setActiveTab(tabParam);
  }, [tabParam]);

  // Auto-run when a new topic arrives via URL
  const autoRan = useRef<string | null>(null);
  useEffect(() => {
    const t = topicParam?.trim();
    if (!t || autoRan.current === t) return;
    autoRan.current = t;
    setDraft(t);
    setEditing(false);
    if (t !== currentTopic || !researchReport) {
      resetForNewTopic(t);
      research.mutate(t);
    }
  }, [topicParam]);

  const submitTopic = (t: string) => {
    const topic = t.trim();
    if (!topic) return;
    resetForNewTopic(topic);
    setDraft(topic);
    setEditing(false);
    research.mutate(topic);
    navigate({ search: { topic, tab: "report" } });
  };

  const onTabChange = (v: string) => {
    const next = v as WorkspaceTab;
    setActiveTab(next);
    navigate({ search: (prev: AssistantSearch) => ({ ...prev, tab: next }) });
  };

  const hasWorkspace = !!currentTopic && (!!researchReport || research.isPending);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">
      {/* ════════ Topic header ════════ */}
      <AnimatePresence mode="wait">
        {!currentTopic || editing ? (
          <motion.section
            key="entry"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-foreground pulse-dot" />
                Research Workspace
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-4">
                What would you like to research?
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Enter a topic once — ResearchMind will generate a report and unlock papers, gaps, ideas, reviews,
                proposals and a knowledge graph.
              </p>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); submitTopic(draft); }}
              className="mt-7 max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="e.g. Agentic AI, Multimodal Healthcare, Diffusion models for science…"
                  className="w-full h-14 pl-11 pr-36 rounded-2xl border border-border bg-card text-[15px] outline-none focus:border-foreground/40 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={research.isPending || !draft.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 h-10 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
                >
                  {research.isPending ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                  {research.isPending ? "Researching" : "Start research"}
                </button>
              </div>
            </form>

            {!research.isPending && !research.isError && (
              <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
                {suggestedTopics.slice(0, 6).map((t, i) => (
                  <motion.button
                    key={t.title}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}
                    onClick={() => submitTopic(t.title)}
                    className="text-left rounded-xl border border-border bg-card p-4 text-sm hover:border-foreground/30 hover:-translate-y-0.5 hover:shadow-sm transition-all"
                  >
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="header"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 md:p-6"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Current topic</div>
                <div className="flex items-center gap-2 mt-1">
                  <h1 className="text-xl md:text-2xl font-semibold tracking-tight truncate">{currentTopic}</h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
                    <span className={`size-1.5 rounded-full ${research.isPending ? "bg-amber-400 pulse-dot" : "bg-green-500"}`} />
                    {research.isPending ? "Working" : "Ready"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 ml-auto">
                {AGENTS.map((a) => (
                  <div key={a.key} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    {research.isPending ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <span className="size-4 rounded-full bg-green-500/15 text-green-500 grid place-items-center">
                        <Check className="size-2.5" />
                      </span>
                    )}
                    {a.label}
                  </div>
                ))}
                <div className="w-px h-5 bg-border" />
                <button
                  onClick={() => { setEditing(true); setDraft(currentTopic); }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs font-medium"
                >
                  <RefreshCw className="size-3.5" /> Change topic
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {research.isError && (
        <div className="mt-6">
          <ErrorState
            message={(research.error as Error).message}
            onRetry={() => currentTopic && research.mutate(currentTopic)}
          />
        </div>
      )}

      {/* ════════ Workspace tabs ════════ */}
      <AnimatePresence>
        {hasWorkspace && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <div className="overflow-x-auto -mx-2 px-2 pb-1">
                <TabsList className="flex w-max h-auto bg-card border border-border p-1 gap-1 rounded-xl">
                  {TABS.map(({ value, label, icon: Icon }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="gap-1.5 data-[state=active]:bg-foreground data-[state=active]:text-background rounded-lg px-3 py-1.5 text-xs md:text-sm whitespace-nowrap transition-colors"
                    >
                      <Icon className="size-3.5" /> {label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                  >
                    <TabsContent value="report">
                      <ReportPanel isGenerating={research.isPending} />
                    </TabsContent>
                    <TabsContent value="papers"><PapersPanel /></TabsContent>
                    <TabsContent value="semantic"><SemanticPanel /></TabsContent>
                    <TabsContent value="review"><ReviewPanel /></TabsContent>
                    <TabsContent value="gaps"><GapsPanel /></TabsContent>
                    <TabsContent value="ideas"><IdeasPanel /></TabsContent>
                    <TabsContent value="proposal"><ProposalPanel /></TabsContent>
                    <TabsContent value="graph"><GraphPanel /></TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
