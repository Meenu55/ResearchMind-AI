import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import EmptyEndpoint from "@/components/empty-endpoint";

export const Route = createFileRoute("/gaps")({
  head: () => ({ meta: [{ title: "Research Gaps — ResearchMind AI" }] }),
  component: () => (
    <EmptyEndpoint
      icon={Lightbulb}
      title="Research Gaps"
      message="No dedicated gaps endpoint is wired yet. Run a topic through the Research Assistant — gaps are extracted into the dashboard."
      ctaTo="/assistant"
      ctaLabel="Open Research Assistant"
    />
  ),
});
