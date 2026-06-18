import api from "./api";

export type ResearchResponse = { report: string };

export async function generateResearch(topic: string): Promise<ResearchResponse> {
  const { data } = await api.get<ResearchResponse>("/research", { params: { topic } });
  return data;
}
