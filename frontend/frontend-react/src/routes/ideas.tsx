import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import EmptyEndpoint from "@/components/empty-endpoint";

export const Route = createFileRoute("/ideas")({
  head: () => ({ meta: [{ title: "Idea Generator — ResearchMind AI" }] }),
  component: () => (
    <EmptyEndpoint
      icon={Sparkles}
      title="Idea Generator"
      message="No dedicated ideas endpoint is wired yet. Run a topic through the Research Assistant — generated ideas appear in the dashboard."
      ctaTo="/assistant"
      ctaLabel="Open Research Assistant"
    />
  ),
});
