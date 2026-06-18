import api from "./api";

export type PaperResult = { title: string; abstract: string };
export type SearchResponse = { query: string; results: PaperResult[] };

export async function searchPapers(query: string): Promise<SearchResponse> {
  const { data } = await api.get<SearchResponse>("/search", { params: { query } });
  return data;
}

export type AnalyzeResponse = { analysis: string };

export async function analyzePaper(filePath: string): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>("/analyze", { file_path: filePath });
  return data;
}
