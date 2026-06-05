import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getClient, getClientPrograms, alerts as allAlerts, insightDetails } from "@/lib/mock-data";
import { KpiCard } from "@/components/kpi-card";
import { HealthPill } from "@/components/status-pill";
import { Building2, CheckCircle2, AlertTriangle, Clock, ChevronRight, Sparkles, Activity, TrendingUp, ArrowRight, Layers } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/clients/$clientId")({
  head: ({ params }) => ({ meta: [{ title: `${params.clientId} · Client · Pulse OPS` }] }),
  loader: ({ params }) => {
    const client = getClient(params.clientId);
    if (!client) throw notFound();
    return { client };
  },
  component: ClientPage,
  notFoundComponent: () => <div className="p-10 text-muted-foreground">Client not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-critical">{error.message}</div>,
});

function ClientPage() {
  const { client } = Route.useLoaderData();
  const ps = getClientPrograms(client.id);
  const clientAlerts = allAlerts.filter(a => a.clientId === client.id);
  const clientInsights = insightDetails.filter(i => i.clientId === client.id);

  // Aggregate 24h trend across all programs of this client
  const trend24h = Array.from({ length: 24 }, (_, h) => {
    const slot = ps.reduce(
      (acc, p) => {
        const t = p.trend[h];
        if (t) { acc.success += t.success; acc.failed += t.failed; acc.volume += t.volume; }
        return acc;
      },
      { t: `${h}:00`, success: 0, failed: 0, volume: 0 },
    );
    return slot;
  });
  const totalVolume = ps.reduce((a, p) => a + p.volume, 0);
  const avgSuccess = ps.length ? +(ps.reduce((a, p) => a + p.successRate, 0) / ps.length).toFixed(1) : 0;
  const avgFailure = ps.length ? +(ps.reduce((a, p) => a + p.failureRate, 0) / ps.length).toFixed(1) : 0;

  // Aggregate stage breakdown across all programs
  const stageAgg = (["receiving", "validation", "quality", "output"] as const).map(k => {
    const label = { receiving: "Receiving", validation: "Validation", quality: "Quality Check", output: "Final Output" }[k];
    const sums = ps.reduce(
      (acc, p) => {
        const s = p.stages.find(st => st.key === k);
        if (s) { acc.total += s.total; acc.success += s.success; acc.failed += s.failed; acc.pending += s.pending; }
        return acc;
      },
      { total: 0, success: 0, failed: 0, pending: 0 },
    );
    const failPct = sums.total > 0 ? +((sums.failed / sums.total) * 100).toFixed(2) : 0;
    const status: "healthy" | "warning" | "critical" = failPct > 8 ? "critical" : failPct > 3 ? "warning" : "healthy";
    return { key: k, label, ...sums, failPct, status };
  });

  return (
    <AppShell
      title={client.name}
      subtitle={client.industry}
      breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Clients", to: "/clients" }, { label: client.name }]}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard label="Health Score" value={client.healthScore} tone={client.health} icon={<Building2 className="h-4 w-4" />} sub={`${client.health} status`} />
        <KpiCard label="Volume / 24h" value={totalVolume.toLocaleString()} icon={<Activity className="h-4 w-4" />} sub={`${ps.length} programs`} />
        <KpiCard label="Avg Success" value={`${avgSuccess}%`} tone="healthy" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Avg Failure" value={`${avgFailure}%`} tone={avgFailure > 5 ? "critical" : "warning"} />
        <KpiCard label="At Risk" value={client.atRisk} tone={client.atRisk ? "warning" : "healthy"} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="SLA Breaches" value={client.slaBreaches} tone={client.slaBreaches ? "critical" : "healthy"} icon={<Clock className="h-4 w-4" />} sub="last 7 days" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">24-hour pipeline</div>
              <div className="text-xs text-muted-foreground">Aggregated success vs failure across {ps.length} programs</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-healthy" /> Success</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-critical" /> Failed</span>
            </div>
          </div>
          <div className="mt-4 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend24h} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.022 250)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="success" stackId="1" stroke="oklch(0.72 0.17 155)" fill="oklch(0.72 0.17 155 / 0.5)" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="oklch(0.65 0.22 25)" fill="oklch(0.65 0.22 25 / 0.6)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Layers className="h-4 w-4 text-info" /> Stage breakdown</div>
          <div className="text-xs text-muted-foreground">Where records are being lost</div>
          <div className="mt-3 space-y-3">
            {stageAgg.map(s => (
              <div key={s.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{s.label}</span>
                  <span className={`tabular ${s.status === "critical" ? "text-critical" : s.status === "warning" ? "text-warning" : "text-healthy"}`}>{s.failPct}% failed</span>
                </div>
                <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="bg-healthy" style={{ width: `${(s.success / Math.max(1, s.total)) * 100}%` }} />
                  <div className="bg-warning" style={{ width: `${(s.pending / Math.max(1, s.total)) * 100}%` }} />
                  <div className="bg-critical" style={{ width: `${(s.failed / Math.max(1, s.total)) * 100}%` }} />
                </div>
                <div className="mt-1 grid grid-cols-3 gap-1 text-[10px] text-muted-foreground">
                  <span>✓ {s.success.toLocaleString()}</span>
                  <span>⏳ {s.pending.toLocaleString()}</span>
                  <span>✕ {s.failed.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-3 text-[11px] text-muted-foreground">
            CSM: <span className="text-foreground">{client.owner}</span>
          </div>
        </div>
      </div>

      {clientInsights.length > 0 && (
        <div className="mt-6 rounded-xl border border-info/30 bg-info-soft/20 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-info" /> AI insights for {client.name}</div>
          <div className="grid gap-3 md:grid-cols-2">
            {clientInsights.map(i => (
              <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }} className="group rounded-lg border border-border bg-background/40 p-3 hover:border-info/60">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <span>{i.kind}</span>
                  <span>confidence {Math.round(i.confidence * 100)}%</span>
                </div>
                <div className="mt-1 text-sm font-medium leading-snug">{i.headline}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{i.summary}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-info">Open detail <ArrowRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 text-sm font-semibold">Programs ({ps.length})</div>
          <div className="space-y-2">
            {ps.map(p => (
              <Link key={p.id} to="/programs/$programId" params={{ programId: p.id }} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3 hover:border-info/40">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <HealthPill health={p.status} />
                    <span className="font-medium">{p.name}</span>
                  </div>
                  <div className="mt-1 grid grid-cols-4 gap-3 text-xs text-muted-foreground">
                    <span>Volume <span className="tabular text-foreground">{p.volume.toLocaleString()}</span></span>
                    <span>Success <span className="tabular text-healthy">{p.successRate}%</span></span>
                    <span>Failure <span className={`tabular ${p.failureRate > 5 ? "text-critical" : "text-foreground"}`}>{p.failureRate}%</span></span>
                    <span>Stage <span className="text-foreground capitalize">{p.currentStage}</span></span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 text-sm font-semibold">Alerts for this client</div>
          {clientAlerts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-healthy" />
              No active alerts. All systems nominal.
            </div>
          ) : (
            <div className="space-y-2">
              {clientAlerts.map(a => (
                <Link key={a.id} to="/alerts/$alertId" params={{ alertId: a.id }} className="block rounded-lg border border-border bg-background/40 p-3 hover:border-info/40">
                  <div className="text-xs font-mono text-muted-foreground">{a.id} · {a.openedAt}</div>
                  <div className="text-sm font-medium">{a.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}