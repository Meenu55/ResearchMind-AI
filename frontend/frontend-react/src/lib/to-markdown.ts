/** Coerce arbitrary backend response into a markdown string. */
export function toMarkdown(data: unknown, fallback = ""): string {
  if (data == null) return fallback;
  if (typeof data === "string") return data;

  if (typeof data === "object") {
    const obj = data as Record<string, any>;
    const stringKeys = [
      "markdown", "report", "review", "content", "text", "result",
      "proposal", "gaps", "ideas", "analysis", "summary",
    ];
    for (const k of stringKeys) {
      if (typeof obj[k] === "string" && obj[k].trim()) return obj[k];
    }

    // Build markdown from an array of structured items.
    const arr: any[] | undefined =
      (Array.isArray(obj.gaps) && obj.gaps) ||
      (Array.isArray(obj.ideas) && obj.ideas) ||
      (Array.isArray(obj.results) && obj.results) ||
      (Array.isArray(data as any) ? (data as any[]) : undefined);

    if (Array.isArray(arr) && arr.length) {
      return arr
        .map((item, i) => {
          if (typeof item === "string") return `### ${i + 1}. ${item}`;
          const title = item.title ?? item.name ?? `Item ${i + 1}`;
          const lines: string[] = [`### ${i + 1}. ${title}`];
          for (const [k, v] of Object.entries(item)) {
            if (k === "title" || k === "name") continue;
            if (v == null || v === "") continue;
            const label = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            lines.push(`**${label}:** ${typeof v === "object" ? JSON.stringify(v) : v}`);
          }
          return lines.join("\n\n");
        })
        .join("\n\n---\n\n");
    }

    // Proposal-style object with sections.
    const sectionKeys = ["abstract", "objectives", "methodology", "expected_results", "future_work"];
    const sections = sectionKeys.filter((k) => typeof obj[k] === "string" && obj[k].trim());
    if (sections.length) {
      const title = obj.title ? `# ${obj.title}\n\n` : "";
      return (
        title +
        sections
          .map((k) => `## ${k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}\n\n${obj[k]}`)
          .join("\n\n")
      );
    }
  }

  return fallback;
}
