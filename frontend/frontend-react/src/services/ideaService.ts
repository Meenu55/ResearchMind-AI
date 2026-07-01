import api from "./api";
import { toMarkdown } from "@/lib/to-markdown";

export async function generateIdeas(topic: string): Promise<string> {
  const { data } = await api.get<unknown>("/ideas", { params: { topic } });
  return toMarkdown(data);
}
