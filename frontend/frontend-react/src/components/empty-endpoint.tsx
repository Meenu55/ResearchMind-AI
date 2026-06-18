import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export default function EmptyEndpoint({
  icon: Icon, title, message, ctaTo, ctaLabel,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  ctaTo?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="mx-auto size-12 rounded-2xl border border-border bg-card grid place-items-center">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {ctaTo && ctaLabel && (
        <Link
          to={ctaTo}
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-medium"
        >
          {ctaLabel} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
