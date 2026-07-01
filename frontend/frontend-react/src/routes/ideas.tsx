import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ideas")({
  beforeLoad: () => {
    throw redirect({ to: "/assistant", search: { tab: "ideas" } });
  },
});
