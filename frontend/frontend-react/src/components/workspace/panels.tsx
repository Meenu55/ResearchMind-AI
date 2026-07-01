import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  Loader2, Microscope, Search, ArrowDownAZ, ChevronDown, Sparkles, Check, Lightbulb,
  Upload, FileText as FileTextIcon, Wand2, X,
} from "lucide-react";
import { useTopic } from "@/context/TopicContext";
import { useResearchStore } from "@/store/researchStore";
import { searchPapers, analyzePaper } from "@/services/paperService";
import { uploadPdf } from "@/services/uploadService";
import { semanticSearch, flattenDocs } from "@/services/searchService";
import { generateLiteratureReview } from "@/services/reviewService";
import { detectGaps } from "@/services/gapService";
import { generateIdeas } from "@/services/ideaService";
import { generateProposal } from "@/services/proposalService";
import {
  Spinner, ErrorState, EmptyState,
  ReportSkeleton, PaperGridSkeleton,
} from "./states";
import { DocToolbar } from "./doc-toolbar";

export { GraphPanel } from "./graph-panel";

const fadeIn = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

function Markdown({ children }: { children: string }) {
  return (
    <motion.article
      {...fadeIn}
      className="prose prose-sm md:prose-base dark:prose-invert max-w-none
        prose-headings:tracking-tight prose-headings:font-semibold
        prose-h1:text-2xl prose-h1:mb-3
        prose-h2:text-lg prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border
        prose-h3:text-base prose-h3:mt-5
        prose-p:leading-relaxed
        prose-a:text-foreground prose-a:underline-offset-4
        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
        prose-blockquote:border-l-foreground/30 prose-blockquote:text-muted-foreground"
    >
      <ReactMarkdown>{children}</ReactMarkdown>
    </motion.article>
  );
}

function PanelHeader({
  eyebrow, title, description, right,
}: { eyebrow?: string; title: string; description?: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div>
        {eyebrow && <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</div>}
        <h2 className="text-xl font-semibold tracking-tight mt-1">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
      {right}
    </div>
  );
}

/* ───────────── REPORT ───────────── */
export function ReportPanel({ isGenerating }: { isGenerating?: boolean }) {
  const { topic } = useTopic();
  const report = useResearchStore((s) => s.researchReport);

  if (isGenerating && !report) return <ReportSkeleton label="Generating report…" />;
  if (!report) {
    return <EmptyState title="No report yet" hint="Enter a research topic above to generate your full report." />;
  }

  return (
    <section>
      <PanelHeader
        eyebrow="Research Report"
        title={topic || "Report"}
        description="A structured synthesis of the current literature, key findings, and future directions."
        right={
          <DocToolbar
            title={`${topic} — Research Report`}
            content={report}
            targetId="research-report-content"
            pdfFilename="research-report.pdf"
          />
        }
      />
      <div id="research-report-content" className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <Markdown>{report}</Markdown>
      </div>
    </section>
  );
}

/* ───────────── PAPERS ───────────── */
export function PapersPanel() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.papers);
  const setPapers = useResearchStore((s) => s.setPapers);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"relevance" | "title">("relevance");
  // Single source of truth: only one paper expanded at a time, scoped to this panel.
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["ws-papers", topic],
    queryFn: () => searchPapers(topic),
    enabled: !!topic && !cached,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (q.data?.results) setPapers(q.data.results);
  }, [q.data, setPapers]);

  const all = cached ?? q.data?.results ?? [];
  const filtered = useMemo(() => {
    const f = query.trim().toLowerCase();
    let list = f
      ? all.filter((p) => p.title.toLowerCase().includes(f) || p.abstract?.toLowerCase().includes(f))
      : all.slice();
    if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [all, query, sort]);

  if (q.isLoading) return <PaperGridSkeleton label="Searching papers…" />;
  if (q.isError) return <ErrorState message={(q.error as Error).message} onRetry={() => q.refetch()} />;
  if (all.length === 0) return <EmptyState title="No papers found" hint={`for "${topic}"`} />;

  return (
    <section>
      <PanelHeader
        eyebrow="Papers"
        title={`Found ${all.length} papers`}
        description={`Search results from the research backend for "${topic}".`}
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search within results…"
                className="h-9 w-56 pl-8 pr-3 rounded-md border border-border bg-card text-xs outline-none focus:border-foreground/30"
              />
            </div>
            <button
              onClick={() => setSort((s) => (s === "relevance" ? "title" : "relevance"))}
              className="h-9 inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-2.5 text-xs"
              title="Toggle sort"
            >
              <ArrowDownAZ className="size-3.5" />
              {sort === "relevance" ? "Relevance" : "Title"}
            </button>
          </div>
        }
      />

      {/* Upload workflow */}
      <UploadPaperCard />

      {filtered.length === 0 ? (
        <EmptyState title="No matches" hint="Try a different search term." />
      ) : (
        <div className="grid md:grid-cols-2 gap-3 mt-5">
          {filtered.map((p, i) => (
            <PaperCard
              key={p.title}
              paper={p}
              index={i}
              isExpanded={expandedPaper === p.title}
              onToggle={() =>
                setExpandedPaper((cur) => (cur === p.title ? null : p.title))
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────── UPLOAD PAPER (Workflow 2) ───────────── */
function UploadPaperCard() {
  const uploaded = useResearchStore((s) => s.uploadedAnalysis);
  const setUploaded = useResearchStore((s) => s.setUploadedAnalysis);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>(uploaded?.fileName ?? "");

  const mut = useMutation({
    mutationFn: async (file: File) => {
      const up = await uploadPdf(file);
      const analysis = await analyzePaper(up.file_path);
      return { fileName: file.name, analysis: analysis.analysis || "" };
    },
    onSuccess: (r) => {
      setUploaded(r);
      toast.success("Paper analyzed", { description: r.fileName });
    },
    onError: (e: Error) => {
      toast.error("Upload failed", { description: e.message });
    },
  });

  const pickFile = () => inputRef.current?.click();

  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }
    setFileName(f.name);
    mut.mutate(f);
  };

  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-5 mb-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="size-10 rounded-lg bg-muted grid place-items-center">
          <Upload className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium">Upload a paper (PDF)</div>
          <div className="text-xs text-muted-foreground">
            The Reader Agent will extract text and generate a structured analysis
            (Summary, Objective, Methodology, Findings, Limitations, Future Work).
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
          <button
            onClick={pickFile}
            disabled={mut.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-60"
          >
            {mut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {mut.isPending ? "Analyzing…" : "Upload Paper"}
          </button>
          {uploaded && (
            <button
              onClick={() => { setUploaded(null); setFileName(""); }}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs"
              title="Clear analysis"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {mut.isPending && (
        <div className="mt-4"><ReportSkeleton label={`Analyzing ${fileName || "paper"}…`} /></div>
      )}
      {mut.isError && (
        <div className="mt-4">
          <ErrorState message={(mut.error as Error).message} onRetry={pickFile} />
        </div>
      )}
      {uploaded && !mut.isPending && (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-2 text-xs">
              <FileTextIcon className="size-3.5 text-muted-foreground" />
              <span className="font-medium truncate max-w-[40ch]">{uploaded.fileName}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
                <Check className="size-2.5 text-green-500" /> Analyzed
              </span>
            </div>
            <DocToolbar
              title={`Paper Analysis — ${uploaded.fileName}`}
              content={uploaded.analysis}
              targetId="uploaded-analysis-content"
              pdfFilename={`${uploaded.fileName.replace(/\.pdf$/i, "")}-analysis.pdf`}
            />
          </div>
          <div id="uploaded-analysis-content" className="rounded-xl border border-border bg-card p-6">
            <Markdown>{uploaded.analysis || "_No analysis returned._"}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

function PaperCard({
  paper, index, isExpanded, onToggle,
}: {
  paper: { title: string; abstract: string };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const mut = useMutation({ mutationFn: () => analyzePaper(paper.title) });

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.3) }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col transition-all hover:border-foreground/30 hover:shadow-lg hover:-translate-y-0.5"
    >
      <h3 className="text-base font-semibold leading-snug">{paper.title}</h3>
      <p className={`text-sm text-muted-foreground mt-2 ${isExpanded ? "" : "line-clamp-4"} flex-1`}>
        {paper.abstract || "No abstract available."}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {paper.abstract && (
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium"
          >
            <ChevronDown className={`size-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            {isExpanded ? "Hide abstract" : "View full abstract"}
          </button>
        )}
        <button
          onClick={() => { setAnalysisOpen(true); if (!mut.data && !mut.isPending) mut.mutate(); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90"
        >
          {mut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Microscope className="size-3.5" />}
          Analyze
        </button>
      </div>
      <AnimatePresence>
        {analysisOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t border-border pt-4 overflow-hidden"
          >
            {mut.isPending && <Spinner label="Analyzing paper…" />}
            {mut.isError && <ErrorState message={(mut.error as Error).message} onRetry={() => mut.mutate()} />}
            {mut.data && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{mut.data.analysis || "_No analysis returned._"}</ReactMarkdown>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* Generic markdown panel factory */
function MarkdownPanel({
  eyebrow, title, description, content, isLoading, isError, error, refetch,
  loadingLabel, exportTitle, contentId, pdfFilename, document: doc,
}: {
  eyebrow: string; title: string; description?: string; content: string;
  isLoading: boolean; isError: boolean; error?: Error | null; refetch: () => void;
  loadingLabel: string; exportTitle: string;
  contentId: string; pdfFilename: string; document?: boolean;
}) {
  if (isLoading) return <ReportSkeleton label={loadingLabel} />;
  if (isError) return <ErrorState message={error?.message || "Request failed"} onRetry={refetch} />;
  if (!content) return <EmptyState title={`No ${title.toLowerCase()} yet`} />;
  return (
    <section>
      <PanelHeader eyebrow={eyebrow} title={title} description={description}
        right={<DocToolbar title={exportTitle} content={content} targetId={contentId} pdfFilename={pdfFilename} />} />
      <div id={contentId} className={doc
        ? "rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm"
        : "rounded-2xl border border-border bg-card p-6 md:p-8"}>
        <Markdown>{content}</Markdown>
      </div>
    </section>
  );
}

/* ───────────── LITERATURE REVIEW ───────────── */
export function ReviewPanel() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.literatureReview);
  const setReview = useResearchStore((s) => s.setReview);
  const q = useQuery({
    queryKey: ["ws-review", topic],
    queryFn: () => generateLiteratureReview(topic),
    enabled: !!topic && !cached,
    staleTime: Infinity,
  });
  useEffect(() => { if (q.data?.content) setReview(q.data.content); }, [q.data, setReview]);
  const content = cached || q.data?.content || "";
  return (
    <MarkdownPanel
      eyebrow="Literature Review" title="Literature Review"
      description={`A structured synthesis of recent literature on "${topic}".`}
      content={content}
      isLoading={q.isLoading} isError={q.isError} error={q.error as Error} refetch={q.refetch}
      loadingLabel="Synthesizing literature review…"
      exportTitle={`${topic} — Literature Review`}
      contentId="literature-review-content"
      pdfFilename="literature-review.pdf"
      document
    />
  );
}

/* ───────────── GAPS ───────────── */
export function GapsPanel() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.gaps);
  const setGaps = useResearchStore((s) => s.setGaps);
  const q = useQuery({
    queryKey: ["ws-gaps", topic], queryFn: () => detectGaps(topic),
    enabled: !!topic && !cached, staleTime: Infinity,
  });
  useEffect(() => { if (q.data) setGaps(q.data); }, [q.data, setGaps]);
  return (
    <MarkdownPanel
      eyebrow="Gap Analysis" title="Research Gaps"
      description="Underexplored directions and open problems surfaced by the gap-detection agent."
      content={cached || q.data || ""}
      isLoading={q.isLoading} isError={q.isError} error={q.error as Error} refetch={q.refetch}
      loadingLabel="Finding research gaps…"
      exportTitle={`${topic} — Research Gaps`}
      contentId="research-gaps-content"
      pdfFilename="research-gaps.pdf"
    />
  );
}

/* Pull idea titles out of a markdown blob produced by toMarkdown
   (which formats items as "### N. Title"). Falls back to any "### " heading. */
function extractIdeaTitles(md: string): string[] {
  if (!md) return [];
  const titles: string[] = [];
  const re = /^###\s+(?:\d+\.\s+)?(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md))) {
    const t = m[1].trim();
    if (t && !titles.includes(t)) titles.push(t);
  }
  return titles;
}

/* ───────────── IDEAS ───────────── */
export function IdeasPanel() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.ideas);
  const setIdeas = useResearchStore((s) => s.setIdeas);
  const selectedIdea = useResearchStore((s) => s.selectedIdea);
  const setSelectedIdea = useResearchStore((s) => s.setSelectedIdea);
  const setActiveTab = useResearchStore((s) => s.setActiveTab);

  const q = useQuery({
    queryKey: ["ws-ideas", topic], queryFn: () => generateIdeas(topic),
    enabled: !!topic && !cached, staleTime: Infinity,
  });
  useEffect(() => { if (q.data) setIdeas(q.data); }, [q.data, setIdeas]);

  const content = cached || q.data || "";
  const ideaTitles = useMemo(() => extractIdeaTitles(content), [content]);

  const handleSelect = (title: string) => {
    setSelectedIdea(title);
    toast.success("Idea selected", { description: title });
  };

  if (q.isLoading) return <ReportSkeleton label="Generating ideas…" />;
  if (q.isError) return <ErrorState message={(q.error as Error).message} onRetry={() => q.refetch()} />;
  if (!content) return <EmptyState title="No ideas yet" />;

  return (
    <section>
      <PanelHeader
        eyebrow="Innovation"
        title="Generated Research Ideas"
        description="Novel directions the innovation agent recommends exploring. Select one to drive your proposal."
        right={
          <DocToolbar
            title={`${topic} — Research Ideas`}
            content={content}
            targetId="ideas-content"
            pdfFilename="ideas.pdf"
          />
        }
      />

      {ideaTitles.length > 0 && (
        <div className="rounded-2xl border border-border bg-card/60 p-4 md:p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="size-4 text-amber-400" />
            <div className="text-sm font-medium">Pick an idea to use for your proposal</div>
            {selectedIdea && (
              <span className="ml-auto text-[11px] text-muted-foreground">
                Selected: <span className="text-foreground">{selectedIdea}</span>
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {ideaTitles.map((t) => {
              const active = t === selectedIdea;
              return (
                <button
                  key={t}
                  onClick={() => handleSelect(t)}
                  className={`text-left rounded-xl border p-3 text-sm transition-all hover:-translate-y-0.5 ${
                    active
                      ? "border-foreground/60 bg-foreground/[0.06]"
                      : "border-border bg-card hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 size-4 rounded-full grid place-items-center ${
                        active ? "bg-foreground text-background" : "border border-border"
                      }`}
                    >
                      {active ? <Check className="size-2.5" /> : <Sparkles className="size-2.5 text-muted-foreground" />}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium leading-snug">{t}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedIdea && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => setActiveTab("proposal")}
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90"
              >
                Continue to proposal →
              </button>
            </div>
          )}
        </div>
      )}

      <div id="ideas-content" className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <Markdown>{content}</Markdown>
      </div>
    </section>
  );
}

/* ───────────── PROPOSAL ───────────── */
export function ProposalPanel() {
  const { topic } = useTopic();
  const cached = useResearchStore((s) => s.proposal);
  const setProposal = useResearchStore((s) => s.setProposal);
  const selectedIdea = useResearchStore((s) => s.selectedIdea);
  const setActiveTab = useResearchStore((s) => s.setActiveTab);

  const mut = useMutation({
    mutationFn: () => generateProposal(topic, selectedIdea || undefined),
    onSuccess: (md) => {
      setProposal(md);
      toast.success("Proposal generated");
    },
    onError: (e: Error) => {
      toast.error("Could not generate proposal", { description: e.message });
    },
  });

  // Gate: an idea is required before generating a proposal.
  if (!selectedIdea) {
    return (
      <section>
        <PanelHeader
          eyebrow="Proposal"
          title="Research Proposal"
          description="A targeted proposal grounded in the idea you select."
        />
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="mx-auto size-10 rounded-full border border-border grid place-items-center mb-3">
            <Lightbulb className="size-4 text-amber-400" />
          </div>
          <h3 className="text-base font-semibold">No idea selected</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select an idea from the Ideas tab to generate a proposal.
          </p>
          <button
            onClick={() => setActiveTab("ideas")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90"
          >
            Go to Ideas
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PanelHeader
        eyebrow="Proposal"
        title="Research Proposal"
        description="Title, abstract, objectives, methodology, expected outcomes, and timeline."
        right={
          cached ? (
            <DocToolbar
              title={`${topic} — Research Proposal`}
              content={cached}
              targetId="proposal-content"
              pdfFilename="proposal.pdf"
            />
          ) : null
        }
      />

      <div className="rounded-xl border border-border bg-card/60 p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Selected idea</div>
        <div className="text-sm font-medium flex-1 min-w-0 truncate">{selectedIdea}</div>
        <button
          onClick={() => setActiveTab("ideas")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium"
        >
          Change idea
        </button>
        <button
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90 disabled:opacity-60"
        >
          {mut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
          {cached ? "Regenerate proposal" : "Generate proposal"}
        </button>
      </div>

      {mut.isPending && !cached && <ReportSkeleton label="Creating proposal…" />}
      {mut.isError && !cached && (
        <ErrorState message={(mut.error as Error).message} onRetry={() => mut.mutate()} />
      )}

      {cached && (
        <div id="proposal-content" className="rounded-2xl border border-border bg-card p-8 md:p-12 shadow-sm">
          <Markdown>{cached}</Markdown>
        </div>
      )}

      {!cached && !mut.isPending && !mut.isError && (
        <EmptyState
          title="Ready to generate"
          hint="Click ‘Generate proposal’ above to draft a proposal for the selected idea."
        />
      )}
    </section>
  );
}

/* ───────────── SEMANTIC SEARCH ───────────── */
export function SemanticPanel() {
  const { topic } = useTopic();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string>("");

  const q = useQuery({
    queryKey: ["semantic-search", submitted],
    queryFn: () => semanticSearch(submitted),
    enabled: !!submitted,
    staleTime: 30_000,
  });

  const results = q.data ? flattenDocs(q.data) : [];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = query.trim();
    if (!v) return;
    setSubmitted(v);
  };

  return (
    <section>
      <PanelHeader
        eyebrow="Semantic Search"
        title="Search the knowledge base"
        description={`Find semantically similar excerpts related to "${topic}". Try queries like "memory architectures" or "reasoning benchmarks".`}
      />

      <form onSubmit={submit} className="relative mb-5">
        <Wand2 className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a semantic query…"
          className="w-full h-12 pl-11 pr-32 rounded-xl border border-border bg-card text-sm outline-none focus:border-foreground/40"
        />
        <button
          type="submit"
          disabled={!query.trim() || q.isFetching}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-3.5 h-9 text-xs font-medium disabled:opacity-50"
        >
          {q.isFetching ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
          Search
        </button>
      </form>

      {!submitted && (
        <EmptyState title="No query yet" hint="Enter a phrase above to run a semantic search across the indexed corpus." />
      )}

      {submitted && q.isLoading && <PaperGridSkeleton label="Running semantic search…" />}
      {submitted && q.isError && (
        <ErrorState message={(q.error as Error).message} onRetry={() => q.refetch()} />
      )}
      {submitted && !q.isLoading && !q.isError && results.length === 0 && (
        <EmptyState title="No semantic matches" hint={`Nothing found for "${submitted}".`} />
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((doc, i) => {
            const score = Math.max(0.4, 1 - i * (0.5 / Math.max(results.length, 1)));
            const excerpt = doc.length > 420 ? doc.slice(0, 420).trim() + "…" : doc;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium tabular-nums">
                    <Sparkles className="size-2.5" /> {(score * 100).toFixed(0)}% match
                  </span>
                  <span className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    Source · Indexed corpus
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">#{i + 1}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {excerpt}
                </p>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
