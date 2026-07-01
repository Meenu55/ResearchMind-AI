import { useState } from "react";
import { Copy, Download, FileDown, Check } from "lucide-react";
import { toast } from "sonner";
import { copyText, downloadMarkdown } from "@/lib/download";
import { exportToPdf } from "@/utils/exportPdf";

export function DocToolbar({
  title,
  content,
  targetId,
  pdfFilename,
}: {
  title: string;
  content: string;
  /** DOM id of the rendered panel content to snapshot for PDF. */
  targetId?: string;
  /** Override the auto-generated PDF filename. */
  pdfFilename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  if (!content) return null;

  const onCopy = async () => {
    if (await copyText(content)) {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Could not copy");
    }
  };

  const onExportPdf = async () => {
    if (!targetId) {
      toast.error("PDF export target not configured");
      return;
    }
    setExporting(true);
    try {
      const filename = pdfFilename || `${slug(title)}.pdf`;
      const ok = await exportToPdf(targetId, filename);
      if (ok) toast.success("PDF downloaded");
      else toast.error("Could not export PDF");
    } catch (e) {
      console.error(e);
      toast.error("Could not export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium transition-colors"
      >
        {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <button
        onClick={() => {
          downloadMarkdown(slug(title), content);
          toast.success("Markdown downloaded");
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card hover:bg-muted px-2.5 py-1.5 text-xs font-medium transition-colors"
      >
        <Download className="size-3.5" /> Export Markdown
      </button>
      <button
        onClick={onExportPdf}
        disabled={exporting}
        className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background hover:opacity-90 px-2.5 py-1.5 text-xs font-medium transition-opacity disabled:opacity-60"
      >
        <FileDown className="size-3.5" /> {exporting ? "Exporting…" : "Export PDF"}
      </button>
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
