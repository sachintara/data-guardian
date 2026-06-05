import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { insightDetails } from "@/lib/mock-data";
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Zap, Activity, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({ meta: [{ title: "AI Insights · Pulse OPS" }] }),
  component: InsightsPage,
});

function InsightsPage() {
  const iconFor = (k: string) =>
    k === "anomaly" ? <AlertTriangle className="h-4 w-4 text-critical" /> :
    k === "forecast" ? <Zap className="h-4 w-4 text-warning" /> :
    k === "improvement" ? <ShieldCheck className="h-4 w-4 text-healthy" /> :
    k === "trend" ? <TrendingUp className="h-4 w-4 text-info" /> :
    <Activity className="h-4 w-4 text-info" />;

  return (
    <AppShell title="AI Insights" subtitle="Pattern detection across the portfolio" breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Insights" }]}>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-info/30 bg-info-soft/30 p-3 text-sm">
        <Sparkles className="h-4 w-4 text-info" />
        <span>Open any insight for the full AI validation, pattern detection, and recommended action. Use ← → to slide between insights.</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {insightDetails.map(i => (
          <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }} className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-info/40">
            <div className="flex items-start gap-3">
              {iconFor(i.kind)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{i.kind}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{i.id}</span>
                </div>
                <div className="mt-1 text-sm font-medium leading-snug">{i.headline}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.summary}</div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-info">{i.metric}</span>
                  <span className="text-muted-foreground">confidence {Math.round(i.confidence * 100)}%</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-xs text-info opacity-0 transition-opacity group-hover:opacity-100">
                  Open detail <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}