import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { alerts as allAlerts, clients, programs } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/status-pill";
import { useState } from "react";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alert Center · Pulse OPS" }] }),
  component: AlertsLayout,
});

function AlertsLayout() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  if (pathname !== "/alerts") return <Outlet />;
  return <AlertsList />;
}

function AlertsList() {
  const [sev, setSev] = useState<string>("all");
  const filtered = sev === "all" ? allAlerts : allAlerts.filter(a => a.severity === sev);

  return (
    <AppShell title="Alert Center" subtitle="Centralized incident triage" breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Alerts" }]}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", "critical", "high", "medium", "low"].map(s => (
          <button key={s} onClick={() => setSev(s)} className={`rounded-md border px-3 py-1.5 text-xs capitalize ${sev === s ? "border-info bg-info-soft text-info" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
            {s} <span className="ml-1 tabular text-foreground">{s === "all" ? allAlerts.length : allAlerts.filter(a => a.severity === s).length}</span>
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card">
        {filtered.map(a => {
          const client = clients.find(c => c.id === a.clientId)!;
          const program = programs.find(p => p.id === a.programId)!;
          return (
            <Link key={a.id} to="/alerts/$alertId" params={{ alertId: a.id }} className="grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-3 last:border-0 hover:bg-secondary/20">
              <SeverityBadge severity={a.severity} />
              <span className="font-mono text-[11px] text-muted-foreground">{a.id}</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{a.title}</div>
                <div className="truncate text-xs text-muted-foreground">{a.description}</div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{client.name}</div>
                <div className="truncate max-w-[14ch]">{program.name.split("•")[0]}</div>
              </div>
              <div className="text-right text-[11px] font-mono text-muted-foreground">
                {a.openedAt}
                <div className={`mt-0.5 capitalize ${a.status === "investigating" ? "text-warning" : "text-info"}`}>{a.status}</div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full border border-healthy/40 bg-healthy-soft/40 grid place-items-center text-healthy">✓</div>
            No alerts at this severity. Systems nominal.
          </div>
        )}
      </div>
    </AppShell>
  );
}