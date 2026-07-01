import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BookOpen, Loader2, AlertCircle, Download, List } from "lucide-react";
import { generateLiteratureReview } from "@/services/reviewService";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Literature Reviews — ResearchMind AI" }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [topic, setTopic] = useState("");
  const mut = useMutation({
    mutationFn: (t: string) => generateLiteratureReview(t),
  });

  const content = mut.data?.content ?? "";
  const sections = useMemo(() => extractSections(content), [content]);

  const onExport = () => {
    if (!mut.data) return;
    const blob = new Blob([mut.data.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${mut.data.topic.replace(/\s+/g, "-").toLowerCase()}-literature-review.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-start gap-4">
        <div className="size-10 rounded-xl bg-foreground text-background grid place-items-center">
          <BookOpen className="size-5" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Literature Review Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Produce a structured, citation-ready literature review on any topic.
          </p>
        </div>
        {mut.data && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs"
          >
            <Download className="size-3.5" /> Export Markdown
          </button>
        )}
      </header>

      <form
        onSubmit={(e) => { e.preventDefault(); if (topic.trim()) mut.mutate(topic.trim()); }}
        className="mt-6 flex gap-2"
      >
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Retrieval-augmented generation"
          className="flex-1 h-11 rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-foreground/30"
        />
        <button
          type="submit"
          disabled={mut.isPending || !topic.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 className="size-4 animate-spin" /> : <BookOpen className="size-4" />}
          {mut.isPending ? "Generating…" : "Generate review"}
        </button>
      </form>

      {mut.isError && (
        <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5" /> {(mut.error as Error).message}
        </div>
      )}

      {mut.isPending && (
        <div className="mt-8 space-y-3 animate-pulse">
          <div className="h-6 w-1/3 bg-muted rounded" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      )}

      {!mut.isPending && !mut.data && !mut.isError && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Enter a topic above to generate a literature review.
        </div>
      )}

      {mut.data && content && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid lg:grid-cols-[200px_1fr] gap-8"
        >
          <aside className="hidden lg:block sticky top-20 self-start">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <List className="size-3.5" /> Sections
            </div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-xs text-muted-foreground hover:text-foreground py-1"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>
          <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 id={slug(String(children))}>{children}</h1>,
                h2: ({ children }) => <h2 id={slug(String(children))}>{children}</h2>,
                h3: ({ children }) => <h3 id={slug(String(children))}>{children}</h3>,
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </motion.div>
      )}
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractSections(md: string) {
  const out: { id: string; title: string }[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^#{1,3}\s+(.+)/);
    if (m) out.push({ id: slug(m[1]), title: m[1].trim() });
  }
  return out;
}
