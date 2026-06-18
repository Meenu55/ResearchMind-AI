import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { semanticSearch, flattenDocs } from "@/services/searchService";

export const Route = createFileRoute("/semantic-search")({
  head: () => ({ meta: [
    { title: "Semantic Search — ResearchMind AI" },
    { name: "description", content: "Embedding-based semantic search across the indexed corpus." },
  ]}),
  component: SemanticSearchPage,
});

function SemanticSearchPage() {
  const [q, setQ] = useState("");
  const m = useMutation({ mutationFn: (query: string) => semanticSearch(query) });
  const results = m.data ? flattenDocs(m.data) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Semantic Search</h1>
      <p className="text-sm text-muted-foreground mt-1">Find conceptually similar passages across the indexed corpus.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) m.mutate(q.trim()); }}
        className="mt-6 relative"
      >
        <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Describe the concept or question…"
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-sm outline-none focus:border-foreground/30 transition"
        />
      </form>

      {m.isPending && <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Searching…</div>}

      {m.isError && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive p-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{(m.error as Error).message}</span>
        </div>
      )}

      {m.isSuccess && results.length === 0 && (
        <div className="mt-6 text-sm text-muted-foreground">No matching passages.</div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-3">
        {results.map((doc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Match #{i + 1}</div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{doc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
