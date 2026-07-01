import api from "./api";
import { toMarkdown } from "@/lib/to-markdown";

export async function generateProposal(topic: string, idea?: string): Promise<string> {
  const params: Record<string, string> = { topic };
  if (idea && idea.trim()) params.idea = idea.trim();
  const { data } = await api.get<unknown>("/proposal", { params });
  return toMarkdown(data);
}
