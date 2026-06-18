import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Search, Sparkles, Loader2, X, Upload, FileText, AlertCircle,
} from "lucide-react";
import { searchPapers, analyzePaper, type PaperResult } from "@/services/paperService";
import { uploadPdf } from "@/services/uploadService";

export const Route = createFileRoute("/papers")({
  head: () => ({ meta: [
    { title: "Paper Search — ResearchMind AI" },
    { name: "description", content: "Search papers and analyze uploaded PDFs." },
  ]}),
  component: PapersPage,
});

function PapersPage() {
  const [q, setQ] = useState("");
  const search = useMutation({ mutationFn: (query: string) => searchPapers(query) });
  const [selected, setSelected] = useState<PaperResult | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Paper Search</h1>
      <p className="text-sm text-muted-foreground mt-1">Search the index, or analyze your own PDFs.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) search.mutate(q.trim()); }}
        className="mt-6 relative"
      >
        <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search papers, authors, abstracts…"
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-sm outline-none focus:border-foreground/30 transition"
        />
      </form>

      <UploadAndAnalyze />

      <SearchStatus
        loading={search.isPending}
        error={search.isError ? (search.error as Error).message : null}
        empty={search.isSuccess && (search.data?.results?.length ?? 0) === 0}
      />

      <div className="mt-6 space-y-3">
        {search.isPending && <ResultsSkeleton />}
        {search.data?.results?.map((p, i) => (
          <motion.article
            key={`${p.title}-${i}`}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-border bg-card p-5 hover:border-foreground/30 transition-colors"
          >
            <h3 className="text-lg font-medium leading-snug">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-4">{p.abstract}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelected(p)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs hover:bg-muted transition-colors"
              >
                <Sparkles className="size-3.5" /> View details
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {selected && <DetailDialog paper={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SearchStatus({ loading, error, empty }: { loading: boolean; error: string | null; empty: boolean }) {
  if (loading) return <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Searching…</div>;
  if (error) return <ErrorAlert message={error} />;
  if (empty) return <div className="mt-6 text-sm text-muted-foreground">No results. Try another query.</div>;
  return null;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="mt-3 h-3 w-full bg-muted rounded" />
          <div className="mt-2 h-3 w-5/6 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

function UploadAndAnalyze() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const upload = useMutation({ mutationFn: (f: File) => uploadPdf(f) });
  const analyze = useMutation({ mutationFn: (path: string) => analyzePaper(path) });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    analyze.reset();
    const res = await upload.mutateAsync(f).catch(() => null);
    if (res?.file_path) setFilePath(res.file_path);
  };

  return (
    <div className="mt-6 rounded-xl border border-dashed border-border bg-card/50 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm cursor-pointer hover:bg-muted">
          <Upload className="size-4" />
          Upload PDF
          <input type="file" accept="application/pdf" className="hidden" onChange={onFile} />
        </label>
        {fileName && <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><FileText className="size-3.5" /> {fileName}</span>}
        {upload.isPending && <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><Loader2 className="size-3.5 animate-spin" /> Uploading…</span>}
        {filePath && !analyze.isPending && (
          <button
            onClick={() => analyze.mutate(filePath)}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium"
          >
            <Sparkles className="size-4" /> Analyze
          </button>
        )}
        {analyze.isPending && <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5"><Loader2 className="size-3.5 animate-spin" /> Analyzing…</span>}
      </div>

      {upload.isError && <ErrorAlert message={(upload.error as Error).message} />}
      {analyze.isError && <ErrorAlert message={(analyze.error as Error).message} />}

      {analyze.data && (
        <article className="mt-5 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{analyze.data.analysis}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}

function DetailDialog({ paper, onClose }: { paper: PaperResult; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-base font-semibold leading-snug">{paper.title}</h2>
          <button onClick={onClose} className="size-7 grid place-items-center rounded-md hover:bg-muted"><X className="size-4" /></button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{paper.abstract}</p>
      </div>
    </div>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm flex items-start gap-2">
      <AlertCircle className="size-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
