import api from "./api";

export type SemanticSearchResponse = { documents: string[][] };

export async function semanticSearch(query: string): Promise<SemanticSearchResponse> {
  const { data } = await api.get<SemanticSearchResponse>("/semantic-search", { params: { query } });
  return data;
}

/** Flatten nested `documents` to a single string list. */
export function flattenDocs(res: SemanticSearchResponse): string[] {
  return (res.documents ?? []).flat().filter(Boolean);
}
