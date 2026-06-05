import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { programs, clients } from "@/lib/mock-data";
import { HealthPill } from "@/components/status-pill";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({ meta: [{ title: "Programs · Pulse OPS" }] }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const sorted = [...programs].sort((a, b) => {
    const order = { critical: 0, warning: 1, healthy: 2 } as const;
    return order[a.status] - order[b.status];
  });
  return (
    <AppShell title="Program Monitoring" subtitle="Which program has operational issues?" breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Programs" }]}>
      <div className="mb-3 flex gap-2">
        {(["critical", "warning", "healthy"] as const).map(s => (
          <div key={s} className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs">
            <span className={`h-2 w-2 rounded-full ${s === "critical" ? "bg-critical pulse-dot" : s === "warning" ? "bg-warning" : "bg-healthy"}`} />
            <span className="capitalize text-muted-foreground">{s}</span>
            <span className="tabular font-semibold">{programs.filter(p => p.status === s).length}</span>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Volume</th>
              <th className="px-4 py-3 text-right">Success</th>
              <th className="px-4 py-3 text-right">Failure</th>
              <th className="px-4 py-3">Current Stage</th>
              <th className="px-4 py-3 text-right">Avg Time</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => {
              const client = clients.find(c => c.id === p.clientId)!;
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                  <td className="px-4 py-3"><Link to="/programs/$programId" params={{ programId: p.id }} className="font-medium hover:text-info">{p.name}</Link></td>
                  <td className="px-4 py-3 text-muted-foreground">{client.name}</td>
                  <td className="px-4 py-3"><HealthPill health={p.status} /></td>
                  <td className="px-4 py-3 text-right tabular">{p.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular text-healthy">{p.successRate}%</td>
                  <td className={`px-4 py-3 text-right tabular ${p.failureRate > 5 ? "text-critical" : ""}`}>{p.failureRate}%</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.currentStage}</td>
                  <td className="px-4 py-3 text-right tabular text-muted-foreground">{(p.processingMs / 1000).toFixed(1)}s</td>
                  <td className="px-4 py-3"><HealthPill health={p.slaStatus} /></td>
                  <td className="px-4 py-3"><Link to="/programs/$programId" params={{ programId: p.id }}><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}