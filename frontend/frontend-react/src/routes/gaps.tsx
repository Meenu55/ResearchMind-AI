import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gaps")({
  beforeLoad: () => {
    throw redirect({ to: "/assistant", search: { tab: "gaps" } });
  },
});
