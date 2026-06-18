import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — ResearchMind AI" }, { name: "description", content: "Theme, API, database, agents and export preferences." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your ResearchMind workspace.</p>
      </div>

      <Section title="Theme" desc="Choose your preferred appearance.">
        <div className="flex gap-2">
          <ThemeOpt active={theme === "dark"} onClick={() => theme !== "dark" && toggle()} icon={Moon} label="Dark" />
          <ThemeOpt active={theme === "light"} onClick={() => theme !== "light" && toggle()} icon={Sun} label="Light" />
        </div>
      </Section>

      <Section title="API Configuration" desc="External research sources.">
        <Row label="arXiv API" value="Connected" ok />
        <Row label="Semantic Scholar" value="Connected" ok />
        <Row label="PubMed" value="Connected" ok />
        <Row label="OpenAlex" value="Not connected" />
      </Section>

      <Section title="Database Status" desc="Vector store and metadata.">
        <Row label="Vector DB" value="Healthy · 128k vectors" ok />
        <Row label="Metadata Store" value="Healthy · 42k rows" ok />
      </Section>

      <Section title="Agent Settings" desc="Toggle individual agents.">
        {["Search Agent","Reader Agent","Graph Agent","Gap Detection Agent","Innovation Agent","Literature Review Agent","Proposal Agent"].map((a) => (
          <Toggle key={a} label={a} defaultOn />
        ))}
      </Section>

      <Section title="Export Preferences" desc="Defaults for review and proposal exports.">
        <Row label="Default format" value="PDF" />
        <Row label="Citation style" value="IEEE" />
        <Row label="Include appendix" value="On" />
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold">{title}</h2>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ThemeOpt({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
        active ? "border-foreground bg-background" : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" /> {label}
      {active && <Check className="size-3.5 ml-1" />}
    </button>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {ok && <span className="size-1.5 rounded-full bg-foreground" />}
        {value}
      </span>
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="size-4 accent-foreground" />
    </label>
  );
}
