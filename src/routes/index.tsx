import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { HealthPill } from "@/components/status-pill";
import { portfolio, clients, alerts, portfolioTrend, aiInsights } from "@/lib/mock-data";
import { Users, Workflow, Database, CheckCircle2, XCircle, Clock, Flame, AlertTriangle, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio Overview · Pulse OPS" },
      { name: "description", content: "Operational command center for data lifecycle monitoring across clients and programs." },
      { property: "og:title", content: "Pulse OPS — Portfolio Overview" },
      { property: "og:description", content: "Real-time data lifecycle monitoring command center." },
    ],
  }),
  component: Index,
});

function Index() {
  const topAlerts = alerts.slice(0, 5);
  const criticalClients = clients.filter(c => c.health !== "healthy").slice(0, 8);

  return (
    <AppShell
      title="Portfolio Overview"
      subtitle="What requires attention right now?"
      breadcrumbs={[{ label: "Operations" }, { label: "Portfolio" }]}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Clients" value={portfolio.totalClients} icon={<Users className="h-4 w-4" />} sub="20 active engagements" />
        <KpiCard label="Programs" value={portfolio.totalPrograms} icon={<Workflow className="h-4 w-4" />} sub="across all clients" />
        <KpiCard label="Records / 24h" value={`${(portfolio.recordsProcessed / 1000).toFixed(0)}K`} icon={<Database className="h-4 w-4" />} sub="processed today" />
        <KpiCard label="Success Rate" value={`${portfolio.successRate}%`} tone="healthy" icon={<CheckCircle2 className="h-4 w-4" />} delta={{ value: "+0.4 pts", positive: true }} />
        <KpiCard label="Rejection Rate" value={`${portfolio.rejectionRate}%`} tone="warning" icon={<XCircle className="h-4 w-4" />} delta={{ value: "+1.1 pts", positive: false }} />
        <KpiCard label="SLA Compliance" value={`${portfolio.slaCompliance}%`} tone={portfolio.slaCompliance > 95 ? "healthy" : "warning"} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Active Incidents" value={portfolio.activeIncidents} tone="critical" icon={<Flame className="h-4 w-4" />} sub="needs triage" />
        <KpiCard label="Programs at Risk" value={portfolio.programsAtRisk} tone="warning" icon={<AlertTriangle className="h-4 w-4" />} sub={`${portfolio.totalPrograms - portfolio.programsAtRisk} healthy`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Operational health — last 14 days</div>
              <div className="text-xs text-muted-foreground">Success rate, SLA compliance, daily volume</div>
            </div>
            <div className="flex gap-1 text-xs">
              {["1H", "24H", "7D", "14D", "30D"].map((p, i) => (
                <button key={p} className={`rounded px-2 py-1 ${i === 3 ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioTrend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSla" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.17 220)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 220)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.022 250)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="success" stroke="oklch(0.72 0.17 155)" fill="url(#gSuccess)" strokeWidth={2} name="Success %" />
                <Area type="monotone" dataKey="sla" stroke="oklch(0.72 0.17 220)" fill="url(#gSla)" strokeWidth={2} name="SLA %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-info" />
                AI Insights
              </div>
              <div className="text-xs text-muted-foreground">Pattern detection · 3 active</div>
            </div>
            <Link to="/insights" className="text-xs text-info hover:underline inline-flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="mt-4 space-y-3">
            {aiInsights.map(i => (
              <Link key={i.id} to="/insights/$insightId" params={{ insightId: i.id }} className="block rounded-lg border border-info/20 bg-info-soft/30 p-3 transition-colors hover:border-info/50">
                <div className="text-sm text-foreground leading-snug">{i.text}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-info">{i.metric}</span>
                  <span className="text-muted-foreground">confidence {(i.confidence * 100).toFixed(0)}%</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {/* Client risk heatmap */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Client Health Grid</div>
              <div className="text-xs text-muted-foreground">20 clients × 5 programs · click a cell to drill in</div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-healthy" /> healthy</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-warning" /> warning</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-critical" /> critical</span>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {clients.map(c => <ClientHeatRow key={c.id} clientId={c.id} clientName={c.name} />)}
          </div>
        </div>

        {/* Top alerts */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Top Open Alerts</div>
              <div className="text-xs text-muted-foreground">Ordered by severity & recency</div>
            </div>
            <Link to="/alerts" className="text-xs text-info hover:underline inline-flex items-center gap-1">Alert Center <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="mt-3 space-y-2">
            {topAlerts.map(a => (
              <Link key={a.id} to="/alerts/$alertId" params={{ alertId: a.id }} className="block rounded-lg border border-border bg-background/40 p-3 transition-colors hover:border-info/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${a.severity === "critical" ? "bg-critical pulse-dot" : a.severity === "high" ? "bg-warning" : "bg-info"}`} />
                      <span className="text-[10px] font-mono uppercase text-muted-foreground">{a.id}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{a.openedAt}</span>
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground">{a.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{a.description}</div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Daily volume vs rejections</div>
          <div className="text-xs text-muted-foreground">14-day rolling window</div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioTrend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="oklch(0.30 0.02 250)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.22 0.022 250)", border: "1px solid oklch(0.30 0.02 250)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="volume" fill="oklch(0.72 0.17 220)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Clients requiring intervention</div>
          <div className="text-xs text-muted-foreground">Ranked by health score</div>
          <div className="mt-4 space-y-2">
            {criticalClients.map(c => (
              <Link key={c.id} to="/clients/$clientId" params={{ clientId: c.id }} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3 hover:border-info/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`tabular text-xl font-semibold ${c.health === "critical" ? "text-critical" : "text-warning"}`}>{c.healthScore}</div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.industry} · {c.atRisk} at risk · {c.slaBreaches} SLA</div>
                  </div>
                </div>
                <HealthPill health={c.health} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ClientHeatRow({ clientId, clientName }: { clientId: string; clientName: string }) {
  // get 5 programs for this client
  // hashed deterministic colors via mock-data
  // we keep it tiny inline to avoid an extra fetch
  return (
    <Link to="/clients/$clientId" params={{ clientId }} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md px-2 py-1.5 hover:bg-secondary/40">
      <div className="truncate text-xs text-foreground">{clientName}</div>
      <HeatCells clientId={clientId} />
    </Link>
  );
}

import { programs } from "@/lib/mock-data";
function HeatCells({ clientId }: { clientId: string }) {
  const ps = programs.filter(p => p.clientId === clientId);
  return (
    <div className="flex gap-1">
      {ps.map(p => (
        <span key={p.id} title={`${p.name} · ${p.successRate}%`} className={`h-4 w-8 rounded-sm ${p.status === "critical" ? "bg-critical" : p.status === "warning" ? "bg-warning" : "bg-healthy"}`} />
      ))}
    </div>
  );
}
