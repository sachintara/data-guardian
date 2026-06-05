import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { aiInsights } from "@/lib/mock-data";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "AI Insights · Pulse OPS" }] }),
  component: InsightsPage,
});

function InsightsPage() {
  const extra = [
    { id: "ai-4", text: "Fabrikam Insurance — Billing Feed shows duplicate composite keys (3.2%). Likely repeated ingestion from connector retry.", metric: "3.2% dupes", confidence: 0.79, kind: "warning" as const },
    { id: "ai-5", text: "Cyberdyne IT — pipeline improved success rate by 4.7 pts in the last 7 days after rule v4.3 rollout.", metric: "+4.7 pts · 7d", confidence: 0.91, kind: "healthy" as const },
    { id: "ai-6", text: "Across Healthcare segment, Quality Check failures cluster between 02:00–04:00 UTC — investigate batch window.", metric: "02:00–04:00 UTC", confidence: 0.68, kind: "info" as const },
  ];
  const all = [...aiInsights.map(i => ({ ...i, kind: "info" as const })), ...extra];
  const iconFor = (k: string) => k === "warning" ? <AlertTriangle className="h-4 w-4 text-warning" /> : k === "healthy" ? <ShieldCheck className="h-4 w-4 text-healthy" /> : <TrendingUp className="h-4 w-4 text-info" />;

  return (
    <AppShell title="AI Insights" subtitle="Pattern detection across the portfolio" breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Insights" }]}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-info/30 bg-info-soft/30 p-3 text-sm">
        <Sparkles className="h-4 w-4 text-info" />
        <span>Insights explain reasoning and cite supporting metrics. They never take action — humans decide.</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {all.map(i => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              {iconFor(i.kind)}
              <div className="flex-1">
                <div className="text-sm leading-snug">{i.text}</div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-info">{i.metric}</span>
                  <span className="text-muted-foreground">confidence {Math.round(i.confidence * 100)}%</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs hover:bg-secondary">Investigate</button>
                  <button className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs hover:bg-secondary">Dismiss</button>
                  <button className="rounded-md border border-border bg-background/40 px-2.5 py-1 text-xs hover:bg-secondary">Snooze 24h</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}