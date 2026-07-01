import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle, Network, Link2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchNodeDetails } from "@/services/nodeService";

export default function NodePanel({
  name,
  open,
  onClose,
}: {
  name: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["node-details", name],
    queryFn: () => fetchNodeDetails(name!),
    enabled: open && !!name,
    staleTime: 60_000,
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            <header className="h-14 px-5 flex items-center border-b border-border shrink-0">
              <div className="size-8 rounded-lg bg-foreground text-background grid place-items-center mr-3">
                <Network className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Node</div>
                <div className="text-sm font-semibold truncate">{name ?? "—"}</div>
              </div>
              <button
                onClick={onClose}
                className="ml-auto size-8 grid place-items-center rounded-md hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {isLoading && <PanelSkeleton />}

              {isError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="size-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">Failed to load node details</div>
                      <div className="text-xs opacity-80 mt-1">{(error as Error).message}</div>
                      <button
                        onClick={() => refetch()}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {data && !isLoading && (
                <>
                  <Section title="Node Overview">
                    <div className="rounded-xl border border-border bg-surface p-4">
                      <div className="text-base font-semibold">{data.node}</div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {[...new Set(data.relationships.map((r) => r.relation))].map((rel) => (
                          <span
                            key={rel}
                            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border border-border bg-card text-muted-foreground"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {data.relationships.length} connected concept
                        {data.relationships.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </Section>

                  <Section title="Research Context">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="text-foreground font-medium">{data.node}</span> sits at the
                      intersection of {data.relationships.length} related concepts in this knowledge
                      graph. The relationship types below describe how it interacts with neighbouring
                      ideas, methods and applications across the indexed research corpus.
                    </p>
                  </Section>

                  <Section title="Knowledge Connections">
                    {data.relationships.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        No relationships found for this node yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {data.relationships.map((r, i) => (
                          <motion.div
                            key={`${r.related}-${i}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="rounded-lg border border-border bg-surface p-3 flex items-center gap-3"
                          >
                            <div className="size-8 rounded-md bg-card border border-border grid place-items-center shrink-0">
                              <Link2 className="size-3.5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate">{r.related}</div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                                {r.relation}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </Section>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{title}</h3>
      {children}
    </section>
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <div className="h-5 w-2/3 bg-muted rounded" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded" />
          <div className="h-5 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-11/12 bg-muted rounded" />
        <div className="h-3 w-8/12 bg-muted rounded" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  );
}
