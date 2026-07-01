import api from "./api";

export interface GraphNode {
  id: string;
  name: string;
  group?: string;
  val?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  relation?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

type RawGraphResponse =
  | GraphData
  | { nodes: any[]; edges?: any[]; links?: any[] }
  | { graph: { nodes: any[]; edges?: any[]; links?: any[] } };

function normalize(raw: RawGraphResponse): GraphData {
  const g: any = (raw as any).graph ?? raw;
  const rawNodes: any[] = g.nodes ?? [];
  const rawLinks: any[] = g.links ?? g.edges ?? [];

  const nodes: GraphNode[] = rawNodes.map((n, i) => {
    if (typeof n === "string") return { id: n, name: n };
    const id = String(n.id ?? n.name ?? n.label ?? `node-${i}`);
    return {
      id,
      name: String(n.name ?? n.label ?? id),
      group: n.group ?? n.type ?? n.category,
      val: n.val ?? n.weight ?? n.size,
    };
  });

  const links: GraphLink[] = rawLinks.map((l) => ({
    source: String(l.source ?? l.from ?? l.src),
    target: String(l.target ?? l.to ?? l.dst),
    relation: l.relation ?? l.label ?? l.type,
  }));

  return { nodes, links };
}

export async function fetchKnowledgeGraph(): Promise<GraphData> {
  try {
    const { data } = await api.get<RawGraphResponse>("/knowledge-graph");
    return normalize(data);
  } catch {
    const { data } = await api.get<RawGraphResponse>("/graph-data");
    return normalize(data);
  }
}
