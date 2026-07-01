import api from "./api";
import { toMarkdown } from "@/lib/to-markdown";

export async function detectGaps(topic: string): Promise<string> {
  const { data } = await api.get<unknown>("/gaps", { params: { topic } });
  return toMarkdown(data);
}
