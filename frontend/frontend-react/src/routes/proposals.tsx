import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import EmptyEndpoint from "@/components/empty-endpoint";

export const Route = createFileRoute("/proposals")({
  head: () => ({ meta: [{ title: "Proposal Generator — ResearchMind AI" }] }),
  component: () => (
    <EmptyEndpoint
      icon={FileText}
      title="Proposal Generator"
      message="No proposal endpoint is wired on the backend. Use the Research Assistant report as the basis for a proposal."
      ctaTo="/assistant"
      ctaLabel="Open Research Assistant"
    />
  ),
});
