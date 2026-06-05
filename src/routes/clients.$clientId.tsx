import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getClient, getClientPrograms, alerts as allAlerts, insightDetails } from "@/lib/mock-data";
import { KpiCard } from "@/components/kpi-card";
import { HealthPill, SeverityBadge, LiveDot } from "@/components/status-pill";
import { LifecycleFlow } from "@/components/lifecycle-flow";
import {
  Building2, CheckCircle2, AlertTriangle, Clock, ChevronRight, Sparkles,
  Activity, TrendingUp, ArrowRight, Layers, Bell, Mail, Phone, FileText,
  Workflow, Gauge, ShieldCheck, Zap, History,
} from "lucide-react";
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

  // Aggregated lifecycle stages for the LifecycleFlow component
  const aggregatedStages = stageAgg.map((s, idx) => ({
    key: s.key as "receiving" | "validation" | "quality" | "output",
    label: s.label,
    total: s.total,
    success: s.success,
    failed: s.failed,
    pending: s.pending,
    avgMs: Math.round(ps.reduce((a, p) => a + (p.stages[idx]?.avgMs ?? 0), 0) / Math.max(1, ps.length)),
    status: s.status,
  }));

  // Top failure reasons (mocked but derived from program data)
  const failureReasons = [
    { reason: "Schema mismatch on member_dob", count: Math.floor(totalVolume * 0.018), stage: "Validation", pct: 38 },
    { reason: "QC-117 range check < $0.01", count: Math.floor(totalVolume * 0.012), stage: "Quality Check", pct: 25 },
    { reason: "Missing required field plan_id", count: Math.floor(totalVolume * 0.009), stage: "Validation", pct: 18 },
    { reason: "Duplicate composite key", count: Math.floor(totalVolume * 0.006), stage: "Receiving", pct: 12 },
    { reason: "Output sink timeout", count: Math.floor(totalVolume * 0.004), stage: "Final Output", pct: 7 },
  ];

  // SLA performance 7d (derived)
  const slaSeries = Array.from({ length: 7 }, (_, i) => ({
    day: `D-${6 - i}`,
    sla: Math.max(60, Math.min(100, 92 + Math.round(Math.sin(i + client.id.length) * 6) - (client.slaBreaches * 2))),
  }));

  // Recent activity timeline
  const activity = [
    ...clientAlerts.slice(0, 4).map(a => ({
      kind: "alert" as const, id: a.id, when: a.openedAt, title: a.title, severity: a.severity, to: `/alerts/${a.id}`,
    })),
    ...clientInsights.slice(0, 2).map(i => ({
      kind: "insight" as const, id: i.id, when: "earlier today", title: i.headline, severity: "medium" as const, to: `/insights/${i.id}`,
    })),
    { kind: "system" as const, id: "sys-1", when: "2h ago", title: `Connector v3.11 deployed for ${client.name}`, severity: "low" as const, to: "" },
    { kind: "system" as const, id: "sys-2", when: "6h ago", title: `SLA window updated to 30 min on critical programs`, severity: "low" as const, to: "" },
  ];

  return (
    <AppShell
      title={client.name}
      subtitle={client.industry}
      breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Clients", to: "/clients" }, { label: client.name }]}
    >
      {/* Header strip: identity + status + quick actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info-soft text-info">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">{client.name}</div>
              <HealthPill health={client.health} />
              <LiveDot />
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {client.industry} · CSM <span className="text-foreground">{client.owner}</span> · {ps.length} programs · client id <span className="font-mono">{client.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary"><Mail className="h-3.5 w-3.5" /> Email CSM</button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary"><Phone className="h-3.5 w-3.5" /> Page on-call</button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs hover:bg-secondary"><FileText className="h-3.5 w-3.5" /> Runbook</button>
          <Link to="/alerts" className="inline-flex items-center gap-1.5 rounded-md bg-info px-3 py-1.5 text-xs font-medium text-info-foreground hover:opacity-90"><Bell className="h-3.5 w-3.5" /> Alert center</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard label="Health Score" value={client.healthScore} tone={client.health} icon={<Building2 className="h-4 w-4" />} sub={`${client.health} status`} />
        <KpiCard label="Volume / 24h" value={totalVolume.toLocaleString()} icon={<Activity className="h-4 w-4" />} sub={`${ps.length} programs`} />
        <KpiCard label="Avg Success" value={`${avgSuccess}%`} tone="healthy" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Avg Failure" value={`${avgFailure}%`} tone={avgFailure > 5 ? "critical" : "warning"} />
        <KpiCard label="At Risk" value={client.atRisk} tone={client.atRisk ? "warning" : "healthy"} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="SLA Breaches" value={client.slaBreaches} tone={client.slaBreaches ? "critical" : "healthy"} icon={<Clock className="h-4 w-4" />} sub="last 7 days" />
      </div>

      {/* Lifecycle flow across all programs */}
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold"><Workflow className="h-4 w-4 text-info" /> Data lifecycle — aggregated across {ps.length} programs</div>
            <div className="text-xs text-muted-foreground">Receiving → Validation → Quality Check → Final Output</div>
          </div>
          <div className="text-[11px] text-muted-foreground">click a stage to investigate</div>
        </div>
        <LifecycleFlow stages={aggregatedStages} />
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

      {/* SLA + Top failure reasons */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Gauge className="h-4 w-4 text-info" /> SLA compliance (7d)</div>
          <div className="mt-3 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={slaSeries} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 250)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} stroke="oklch(0.68 0.02 250)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.022 250)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="sla" stroke="oklch(0.72 0.17 155)" fill="oklch(0.72 0.17 155 / 0.35)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            <div><div className="text-muted-foreground">Current</div><div className="tabular font-semibold text-healthy">{slaSeries[slaSeries.length - 1].sla}%</div></div>
            <div><div className="text-muted-foreground">7d avg</div><div className="tabular font-semibold">{Math.round(slaSeries.reduce((a, s) => a + s.sla, 0) / slaSeries.length)}%</div></div>
            <div><div className="text-muted-foreground">Breaches</div><div className={`tabular font-semibold ${client.slaBreaches ? "text-critical" : "text-muted-foreground"}`}>{client.slaBreaches}</div></div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold"><Zap className="h-4 w-4 text-warning" /> Top failure reasons (24h)</div>
            <div className="text-[11px] text-muted-foreground">why records are dropping</div>
          </div>
          <div className="space-y-2.5">
            {failureReasons.map(f => (
              <div key={f.reason} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium">{f.reason}</span>
                    <span className="tabular text-muted-foreground">{f.count.toLocaleString()} · {f.pct}%</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <div className="h-full bg-critical" style={{ width: `${f.pct}%` }} />
                    </div>
                    <span className="rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{f.stage}</span>
                  </div>
                </div>
              </div>
            ))}
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
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-muted-foreground">{a.id} · {a.openedAt}</div>
                    <SeverityBadge severity={a.severity} />
                  </div>
                  <div className="mt-1 text-sm font-medium">{a.title}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.description}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity timeline + Compliance card */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><History className="h-4 w-4 text-info" /> Recent activity</div>
          <ol className="relative ml-3 space-y-3 border-l border-border pl-5">
            {activity.map(ev => {
              const dotColor = ev.severity === "critical" ? "bg-critical" : ev.severity === "high" ? "bg-warning" : ev.kind === "insight" ? "bg-info" : "bg-muted-foreground";
              const body = (
                <>
                  <span className={`absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${dotColor}`} />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="uppercase tracking-wider">{ev.kind}</span>
                    <span>{ev.when}</span>
                  </div>
                  <div className="text-sm">{ev.title}</div>
                </>
              );
              return (
                <li key={ev.id} className="relative">
                  {ev.to ? (
                    <Link to={ev.to} className="block rounded-md p-1 hover:bg-secondary/40">{body}</Link>
                  ) : (
                    <div className="p-1">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="h-4 w-4 text-healthy" /> Compliance & contract</div>
          <div className="space-y-2 text-xs">
            {[
              { k: "Contract tier", v: "Enterprise · Tier 1" },
              { k: "Data region", v: "us-east-1 / eu-west-1" },
              { k: "Encryption", v: "AES-256 at rest, TLS 1.3 in transit" },
              { k: "Retention", v: "7 years (regulated)" },
              { k: "SLA target", v: "99.5% success, 30 min processing" },
              { k: "Last audit", v: "2026-04-12 · Passed" },
            ].map(row => (
              <div key={row.k} className="flex items-center justify-between border-b border-border/60 pb-1.5 last:border-0">
                <span className="text-muted-foreground">{row.k}</span>
                <span className="text-right text-foreground">{row.v}</span>
              </div>
            ))}
          </div>
          <Link to="/insights" className="mt-4 inline-flex items-center gap-1 text-xs text-info hover:underline">
            View all AI insights <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}