import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PaperResult } from "@/services/paperService";
import type { GraphData } from "@/services/graphService";

export type WorkspaceTab =
  | "report"
  | "papers"
  | "review"
  | "gaps"
  | "ideas"
  | "proposal"
  | "semantic"
  | "graph";

export type Activity = {
  type: "Search" | "Analyze" | "Ideas" | "Proposal" | "Review" | "Gaps" | "Graph" | "Semantic";
  title: string;
  time: number; // epoch ms
};

type State = {
  currentTopic: string;
  activeTab: WorkspaceTab;
  researchReport: string;
  papers: PaperResult[] | null;
  literatureReview: string;
  gaps: string;
  ideas: string;
  proposal: string;
  graph: GraphData | null;
  selectedIdea: string | null;
  uploadedAnalysis: { fileName: string; analysis: string } | null;
  analyzedCount: number;
  activity: Activity[];
};

type Actions = {
  setTopic: (t: string) => void;
  setActiveTab: (t: WorkspaceTab) => void;
  setReport: (md: string) => void;
  setPapers: (p: PaperResult[]) => void;
  setReview: (md: string) => void;
  setGaps: (md: string) => void;
  setIdeas: (md: string) => void;
  setProposal: (md: string) => void;
  setGraph: (g: GraphData) => void;
  setSelectedIdea: (idea: string | null) => void;
  setUploadedAnalysis: (v: { fileName: string; analysis: string } | null) => void;
  incAnalyzed: () => void;
  pushActivity: (a: Omit<Activity, "time"> & { time?: number }) => void;
  resetForNewTopic: (t: string) => void;
};

const initial: State = {
  currentTopic: "",
  activeTab: "report",
  researchReport: "",
  papers: null,
  literatureReview: "",
  gaps: "",
  ideas: "",
  proposal: "",
  graph: null,
  selectedIdea: null,
  uploadedAnalysis: null,
  analyzedCount: 0,
  activity: [],
};

export const useResearchStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      setTopic: (currentTopic) => set({ currentTopic }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setReport: (researchReport) => {
        set({ researchReport });
        if (researchReport) get().pushActivity({ type: "Search", title: `Report generated for "${get().currentTopic}"` });
      },
      setPapers: (papers) => set({ papers }),
      setReview: (literatureReview) => {
        set({ literatureReview });
        if (literatureReview) get().pushActivity({ type: "Review", title: `Literature review for "${get().currentTopic}"` });
      },
      setGaps: (gaps) => {
        set({ gaps });
        if (gaps) get().pushActivity({ type: "Gaps", title: `Gaps detected for "${get().currentTopic}"` });
      },
      setIdeas: (ideas) => {
        set({ ideas });
        if (ideas) get().pushActivity({ type: "Ideas", title: `Ideas generated for "${get().currentTopic}"` });
      },
      setProposal: (proposal) => {
        set({ proposal });
        if (proposal) get().pushActivity({ type: "Proposal", title: `Proposal drafted for "${get().currentTopic}"` });
      },
      setGraph: (graph) => {
        set({ graph });
        get().pushActivity({ type: "Graph", title: `Knowledge graph updated (${graph?.nodes?.length ?? 0} nodes)` });
      },
      setSelectedIdea: (selectedIdea) => set({ selectedIdea, proposal: "" }),
      setUploadedAnalysis: (uploadedAnalysis) => {
        set({ uploadedAnalysis });
        if (uploadedAnalysis) {
          set({ analyzedCount: get().analyzedCount + 1 });
          get().pushActivity({ type: "Analyze", title: `Analyzed paper: ${uploadedAnalysis.fileName}` });
        }
      },
      incAnalyzed: () => set({ analyzedCount: get().analyzedCount + 1 }),
      pushActivity: (a) =>
        set({
          activity: [{ time: Date.now(), ...a } as Activity, ...get().activity].slice(0, 25),
        }),
      resetForNewTopic: (t) =>
        set({
          ...initial,
          currentTopic: t,
          activeTab: "report",
          // preserve cross-topic history
          activity: get().activity,
          analyzedCount: get().analyzedCount,
        }),
    }),
    {
      name: "researchmind-workspace",
      partialize: (s) => ({
        currentTopic: s.currentTopic,
        researchReport: s.researchReport,
        papers: s.papers,
        literatureReview: s.literatureReview,
        gaps: s.gaps,
        ideas: s.ideas,
        proposal: s.proposal,
        graph: s.graph,
        selectedIdea: s.selectedIdea,
        uploadedAnalysis: s.uploadedAnalysis,
        analyzedCount: s.analyzedCount,
        activity: s.activity,
      }),
    },
  ),
);
