import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getInsight, insightDetails, getClient, getProgram, type InsightDetail } from "@/lib/mock-data";
import { Sparkles, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, ArrowRight, ShieldCheck, Activity, FileText } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect } from "react";

export const Route = createFileRoute("/insights/$insightId")({
  head: ({ params }) => ({ meta: [{ title: `${params.insightId} · AI Insight · Pulse OPS` }] }),
  loader: ({ params }) => {
    const insight = getInsight(params.insightId);
    if (!insight) throw notFound();
    return { insight: insight as InsightDetail };
  },
  component: InsightDetail,
  notFoundComponent: () => <div className="p-10 text-muted-foreground">Insight not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-critical">{error.message}</div>,
});

const KIND_LABEL: Record<string, { label: string; cls: string }> = {
  anomaly: { label: "Anomaly", cls: "bg-critical-soft text-critical border-critical/30" },
  forecast: { label: "Forecast", cls: "bg-warning-soft text-warning border-warning/30" },
  trend: { label: "Trend", cls: "bg-info-soft text-info border-info/30" },
  pattern: { label: "Pattern", cls: "bg-info-soft text-info border-info/30" },
  improvement: { label: "Improvement", cls: "bg-healthy-soft text-healthy border-healthy/30" },
};

function InsightDetail() {
  const { insight } = Route.useLoaderData();
  const navigate = useNavigate();
  const idx = insightDetails.findIndex(i => i.id === insight.id);
  const prev = insightDetails[(idx - 1 + insightDetails.length) % insightDetails.length];
  const next = insightDetails[(idx + 1) % insightDetails.length];
  const client = insight.clientId ? getClient(insight.clientId) : undefined;
  const program = insight.programId ? getProgram(insight.programId) : undefined;
  const kind = KIND_LABEL[insight.kind];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight") navigate({ to: "/insights/$insightId", params: { insightId: next.id } });
      if (e.key === "ArrowLeft") navigate({ to: "/insights/$insightId", params: { insightId: prev.id } });
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate, next.id, prev.id]);

  return (
    <AppShell
      title="AI Insight"
      subtitle={`${idx + 1} of ${insightDetails.length} · ← → to navigate`}
      breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "AI Insights", to: "/insights" }, { label: insight.id }]}
      actions={
        <div className="flex items-center gap-1">
          <Link to="/insights/$insightId" params={{ insightId: prev.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-secondary">
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </Link>
          <Link to="/insights/$insightId" params={{ insightId: next.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:bg-secondary">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      }
    >
      {/* Slide progress */}
      <div className="mb-4 flex items-center gap-1">
        {insightDetails.map((d, i) => (
          <Link key={d.id} to="/insights/$insightId" params={{ insightId: d.id }} className={`h-1 flex-1 rounded-full transition-colors ${i === idx ? "bg-info" : i < idx ? "bg-info/40" : "bg-border"}`} />
        ))}
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-info/30 bg-gradient-to-br from-info-soft/40 via-card to-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${kind.cls}`}>{kind.label}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-info" /> AI-generated · confidence {Math.round(insight.confidence * 100)}%</span>
          <span className="font-mono text-[11px] text-muted-foreground">{insight.id}</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-foreground">{insight.headline}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{insight.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-md border border-info/30 bg-info-soft/40 px-2.5 py-1 font-mono text-info">{insight.metric}</span>
          {client && (
            <Link to="/clients/$clientId" params={{ clientId: client.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2.5 py-1 text-foreground hover:border-info/40">
              {client.name} <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          {program && (
            <Link to="/programs/$programId" params={{ programId: program.id }} className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2.5 py-1 text-foreground hover:border-info/40">
              {program.name} <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Validation + Pattern Detection */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-healthy" /> AI Validation</div>
          <p className="mt-1 text-xs text-muted-foreground">How the model verified this finding before surfacing it.</p>
          <ul className="mt-4 space-y-2">
            {insight.validation.map((v: InsightDetail["validation"][number], i: number) => (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
                <span className="mt-0.5">
                  {v.status === "passed" ? <CheckCircle2 className="h-4 w-4 text-healthy" /> : v.status === "failed" ? <XCircle className="h-4 w-4 text-critical" /> : <Info className="h-4 w-4 text-info" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{v.label}</div>
                  <div className="text-xs text-muted-foreground">{v.detail}</div>
                </div>
                <span className={`text-[10px] font-mono uppercase ${v.status === "passed" ? "text-healthy" : v.status === "failed" ? "text-critical" : "text-info"}`}>{v.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Activity className="h-4 w-4 text-info" /> Pattern Detection</div>
          <p className="mt-1 text-xs text-muted-foreground">Signals contributing to this insight, ranked by weight.</p>
          <ul className="mt-4 space-y-3">
            {insight.patterns.map((p: InsightDetail["patterns"][number], i: number) => (
              <li key={i} className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium">{p.label}</div>
                  <span className="font-mono text-[11px] text-info">{Math.round(p.weight * 100)}%</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{p.detail}</div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-gradient-to-r from-info to-healthy" style={{ width: `${Math.round(p.weight * 100)}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Chart + Recommendation */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="text-sm font-semibold">Signal vs baseline</div>
          <div className="text-xs text-muted-foreground">The series the model used to derive this insight.</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insight.series} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gIns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.17 220)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.022 250)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.72 0.17 220)" fill="url(#gIns)" strokeWidth={2} name="Signal" />
                <Line type="monotone" dataKey="baseline" stroke="oklch(0.68 0.02 250)" strokeDasharray="4 4" dot={false} name="Baseline" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-healthy/30 bg-healthy-soft/20 p-5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Recommended action</div>
            <div className="mt-2 text-sm leading-snug">{insight.recommendation}</div>
            <div className="mt-3 flex gap-2">
              <button className="rounded-md bg-healthy px-3 py-1.5 text-xs font-medium text-healthy-foreground hover:opacity-90">Apply</button>
              <button className="rounded-md border border-border bg-background/40 px-3 py-1.5 text-xs hover:bg-secondary">Snooze 24h</button>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-muted-foreground" /> Evidence</div>
            <ul className="mt-3 space-y-1.5 text-xs">
              {insight.evidence.map((e: string, i: number) => (
                <li key={i} className="flex gap-2 text-muted-foreground"><span className="text-info">▸</span>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next/Prev preview */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to="/insights/$insightId" params={{ insightId: prev.id }} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-info/40">
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-info" />
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Previous</div>
            <div className="truncate text-sm font-medium">{prev.headline}</div>
          </div>
        </Link>
        <Link to="/insights/$insightId" params={{ insightId: next.id }} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-info/40 sm:justify-end sm:text-right">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Next</div>
            <div className="truncate text-sm font-medium">{next.headline}</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-info" />
        </Link>
      </div>
    </AppShell>
  );
}