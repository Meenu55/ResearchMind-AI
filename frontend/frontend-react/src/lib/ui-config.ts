// Static UI scaffolding (labels, chips, demo charts) — not research content.
export const agents = [
  { name: "Search Agent", desc: "Queries arXiv, Semantic Scholar, PubMed" },
  { name: "Reader Agent", desc: "Parses and summarises full papers" },
  { name: "Graph Agent", desc: "Builds the concept knowledge graph" },
  { name: "Gap Detection Agent", desc: "Surfaces unexplored directions" },
  { name: "Innovation Agent", desc: "Generates novel research ideas" },
  { name: "Literature Review Agent", desc: "Synthesises structured reviews" },
  { name: "Proposal Agent", desc: "Drafts complete research proposals" },
];

export const suggestedTopics = [
  { title: "Agentic AI", desc: "Autonomous multi-agent systems" },
  { title: "Healthcare AI", desc: "Clinical decision support & diagnostics" },
  { title: "Multimodal AI", desc: "Vision–language–audio fusion" },
  { title: "Scientific Discovery", desc: "AI for hypothesis generation" },
  { title: "Computer Vision", desc: "Perception, segmentation, 3D" },
];

export const dashboardMetrics = [
  { label: "Papers Indexed", value: "—", delta: "" },
  { label: "Knowledge Nodes", value: "—", delta: "" },
  { label: "Relationships", value: "—", delta: "" },
  { label: "Literature Reviews", value: "—", delta: "" },
  { label: "Ideas Generated", value: "—", delta: "" },
  { label: "Proposals Generated", value: "—", delta: "" },
];

export const recentActivity: { type: string; title: string; time: string }[] = [];

// Demo arrays for the Analytics charts (no backend endpoint provided).
export const analyticsTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  papers: 200 + Math.round(Math.sin(i / 1.7) * 80 + i * 22),
  reviews: 8 + Math.round(Math.cos(i / 2) * 4 + i * 1.6),
  proposals: 2 + Math.round(Math.sin(i / 1.3) * 2 + i * 0.7),
}));

export const topicDistribution = [
  { topic: "Agentic AI", value: 28 },
  { topic: "Healthcare", value: 22 },
  { topic: "Multimodal", value: 19 },
  { topic: "Vision", value: 14 },
  { topic: "NLP", value: 11 },
  { topic: "Other", value: 6 },
];
