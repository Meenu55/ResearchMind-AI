import api from "./api";

export interface NodeRelationship {
  related: string;
  relation: string;
}

export interface NodeDetails {
  node: string;
  relationships: NodeRelationship[];
}

export async function fetchNodeDetails(name: string): Promise<NodeDetails> {
  const { data } = await api.get<NodeDetails>("/node-details", { params: { name } });
  return {
    node: data.node ?? name,
    relationships: Array.isArray(data.relationships) ? data.relationships : [],
  };
}
