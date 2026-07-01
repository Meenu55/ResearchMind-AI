import api from "./api";

export interface LiteratureReview {
  topic: string;
  content: string;
}

export async function generateLiteratureReview(topic: string): Promise<LiteratureReview> {
  const { data } = await api.get<any>("/literature-review", { params: { topic } });
  const content: string =
    data?.review ?? data?.content ?? data?.markdown ?? data?.text ?? (typeof data === "string" ? data : "");
  return { topic, content };
}
