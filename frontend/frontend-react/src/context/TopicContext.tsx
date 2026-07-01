import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useResearchStore } from "@/store/researchStore";

type TopicCtx = {
  topic: string;
  setTopic: (t: string) => void;
  resetForNewTopic: (t: string) => void;
};

const Ctx = createContext<TopicCtx | null>(null);

export function TopicProvider({ children }: { children: ReactNode }) {
  const topic = useResearchStore((s) => s.currentTopic);
  const setTopic = useResearchStore((s) => s.setTopic);
  const resetForNewTopic = useResearchStore((s) => s.resetForNewTopic);

  const value = useMemo(() => ({ topic, setTopic, resetForNewTopic }), [topic, setTopic, resetForNewTopic]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTopic(): TopicCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTopic must be used inside <TopicProvider>");
  return v;
}
