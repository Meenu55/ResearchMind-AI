import { AlertTriangle, Inbox, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground py-12 justify-center">
      <span className="relative flex size-2.5">
        <span className="absolute inline-flex size-full rounded-full bg-foreground/40 pulse-dot" />
        <span className="relative inline-flex size-2.5 rounded-full bg-foreground" />
      </span>
      <span className="shimmer-text font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const clean = message?.length > 220 ? "Something went wrong while reaching the research backend." : message;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 flex items-start gap-3"
    >
      <div className="size-9 rounded-full bg-destructive/15 grid place-items-center text-destructive shrink-0">
        <AlertTriangle className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground">Something didn't work</div>
        <div className="text-sm text-muted-foreground mt-1 break-words">{clean}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center rounded-md bg-foreground text-background px-3 py-1.5 text-xs font-medium hover:opacity-90"
          >
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center"
    >
      <div className="mx-auto size-11 rounded-full bg-muted grid place-items-center mb-3">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="text-base font-medium">{title}</div>
      {hint && <div className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">{hint}</div>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-3.5 py-2 text-sm font-medium hover:opacity-90"
        >
          <Sparkles className="size-3.5" /> {action.label}
        </button>
      )}
    </motion.div>
  );
}

/* ────────── Skeletons ────────── */

export function ReportSkeleton({ label = "Generating report…" }: { label?: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-foreground pulse-dot" />
        <span className="shimmer-text font-medium">{label}</span>
      </div>
      <div className="h-7 w-1/2 rounded-md bg-muted animate-pulse" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 rounded bg-muted animate-pulse" style={{ width: `${85 - i * 4}%` }} />
            <div className="h-3 rounded bg-muted animate-pulse" style={{ width: `${72 - i * 5}%` }} />
            <div className="h-3 rounded bg-muted animate-pulse" style={{ width: `${60 - i * 6}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaperGridSkeleton({ count = 6, label }: { count?: number; label?: string }) {
  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 rounded-full bg-foreground pulse-dot" />
          <span className="shimmer-text font-medium">{label}</span>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded animate-pulse w-11/12" />
              <div className="h-3 bg-muted rounded animate-pulse w-4/5" />
              <div className="h-3 bg-muted rounded animate-pulse w-3/5" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GraphSkeleton({ label = "Building knowledge graph…" }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-foreground pulse-dot" />
        <span className="shimmer-text font-medium">{label}</span>
      </div>
      <div className="relative h-[420px] rounded-2xl border border-border bg-card overflow-hidden subtle-grid">
        {[
          { x: "20%", y: "30%", s: 14 },
          { x: "40%", y: "55%", s: 22 },
          { x: "65%", y: "25%", s: 18 },
          { x: "78%", y: "60%", s: 14 },
          { x: "30%", y: "75%", s: 16 },
          { x: "55%", y: "78%", s: 12 },
        ].map((n, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/40 animate-pulse"
            style={{ left: n.x, top: n.y, width: n.s, height: n.s, animationDelay: `${i * 120}ms` }}
          />
        ))}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="20%" y1="30%" x2="40%" y2="55%" stroke="currentColor" strokeWidth="1" />
          <line x1="40%" y1="55%" x2="65%" y2="25%" stroke="currentColor" strokeWidth="1" />
          <line x1="40%" y1="55%" x2="78%" y2="60%" stroke="currentColor" strokeWidth="1" />
          <line x1="40%" y1="55%" x2="30%" y2="75%" stroke="currentColor" strokeWidth="1" />
          <line x1="30%" y1="75%" x2="55%" y2="78%" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

/* Back-compat aliases used elsewhere */
export const SkeletonGrid = PaperGridSkeleton;
export const SkeletonLines = ({ count = 6 }: { count?: number }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-3 bg-muted rounded" style={{ width: `${55 + ((i * 13) % 45)}%` }} />
    ))}
  </div>
);
