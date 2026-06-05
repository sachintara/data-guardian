import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getClient, getClientPrograms, alerts as allAlerts } from "@/lib/mock-data";
import { KpiCard } from "@/components/kpi-card";
import { HealthPill } from "@/components/status-pill";
import { Building2, CheckCircle2, AlertTriangle, Clock, ChevronRight } from "lucide-react";

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

  return (
    <AppShell
      title={client.name}
      subtitle={client.industry}
      breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Clients", to: "/clients" }, { label: client.name }]}
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <KpiCard label="Health Score" value={client.healthScore} tone={client.health} icon={<Building2 className="h-4 w-4" />} sub={`${client.health} status`} />
        <KpiCard label="Programs" value={client.programs} icon={<CheckCircle2 className="h-4 w-4" />} sub={`${client.healthy} healthy`} />
        <KpiCard label="At Risk" value={client.atRisk} tone={client.atRisk ? "warning" : "healthy"} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="SLA Breaches" value={client.slaBreaches} tone={client.slaBreaches ? "critical" : "healthy"} icon={<Clock className="h-4 w-4" />} sub="last 7 days" />
        <KpiCard label="Open Alerts" value={clientAlerts.length} tone={clientAlerts.length ? "warning" : "healthy"} />
        <KpiCard label="Owner" value={<span className="text-base">{client.owner}</span>} sub="CSM" />
      </div>

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