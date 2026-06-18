import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import EmptyEndpoint from "@/components/empty-endpoint";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Literature Reviews — ResearchMind AI" }] }),
  component: () => (
    <EmptyEndpoint
      icon={BookOpen}
      title="Literature Reviews"
      message="No literature-review endpoint is wired on the backend. Use the Research Assistant to generate a full markdown report."
      ctaTo="/assistant"
      ctaLabel="Open Research Assistant"
    />
  ),
});
