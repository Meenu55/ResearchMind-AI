export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".md") ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Lightweight PDF export via print dialog with a styled print window. */
export function exportMarkdownAsPDF(title: string, markdownAsHTML: string) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
  <style>
    *{box-sizing:border-box}
    body{font:14px/1.7 -apple-system,Segoe UI,Inter,sans-serif;color:#111;max-width:760px;margin:48px auto;padding:0 32px}
    h1{font-size:26px;margin:0 0 8px;letter-spacing:-.01em}
    h2{font-size:18px;margin:28px 0 8px;border-bottom:1px solid #eee;padding-bottom:6px}
    h3{font-size:15px;margin:20px 0 6px}
    p,li{font-size:13.5px}
    pre,code{background:#f5f5f5;border-radius:6px;padding:2px 6px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
    pre{padding:12px;overflow:auto}
    blockquote{border-left:3px solid #ddd;padding-left:12px;color:#555;margin:12px 0}
    a{color:#0a66c2;text-decoration:none}
    hr{border:none;border-top:1px solid #eee;margin:24px 0}
    @media print{body{margin:0;padding:24px}}
  </style></head><body><h1>${escapeHtml(title)}</h1>${markdownAsHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
