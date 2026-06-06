import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { clients, programs } from "@/lib/mock-data";
import { HealthPill } from "@/components/status-pill";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/clients/")({
  head: () => ({ meta: [{ title: "Clients · Pulse OPS" }, { name: "description", content: "Client health dashboard across portfolio." }] }),
  component: ClientsPage,
});

function ClientsPage() {
  const navigate = useNavigate();
  return (
    <AppShell title="Client Health" subtitle="Which clients require intervention?" breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Clients" }]}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3 text-right">Score</th>
              <th className="px-4 py-3">Health</th>
              <th className="px-4 py-3 text-right">Programs</th>
              <th className="px-4 py-3 text-right">At Risk</th>
              <th className="px-4 py-3 text-right">SLA Breaches</th>
              <th className="px-4 py-3 text-right">Rejection Δ</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {clients.map(c => {
              const ps = programs.filter(p => p.clientId === c.id);
              return (
                <tr
                  key={c.id}
                  onClick={() => navigate({ to: "/clients/$clientId", params: { clientId: c.id } })}
                  className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <Link
                      to="/clients/$clientId"
                      params={{ clientId: c.id }}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-foreground hover:text-info"
                    >
                      {c.name}
                    </Link>
                    <div className="mt-1 flex gap-0.5">
                      {ps.map(p => (
                        <span key={p.id} className={`h-1 w-6 rounded-full ${p.status === "critical" ? "bg-critical" : p.status === "warning" ? "bg-warning" : "bg-healthy"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.industry}</td>
                  <td className="px-4 py-3 text-right tabular font-semibold">{c.healthScore}</td>
                  <td className="px-4 py-3"><HealthPill health={c.health} /></td>
                  <td className="px-4 py-3 text-right tabular">{c.programs}</td>
                  <td className={`px-4 py-3 text-right tabular ${c.atRisk > 0 ? "text-warning font-medium" : "text-muted-foreground"}`}>{c.atRisk}</td>
                  <td className={`px-4 py-3 text-right tabular ${c.slaBreaches > 0 ? "text-critical font-medium" : "text-muted-foreground"}`}>{c.slaBreaches}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 tabular ${c.rejectionTrend > 0 ? "text-critical" : "text-healthy"}`}>
                      {c.rejectionTrend > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(c.rejectionTrend)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.owner}</td>
                  <td className="px-4 py-3">
                    <Link
                      to="/clients/$clientId"
                      params={{ clientId: c.id }}
                      aria-label={`Open ${c.name} detail`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-info/10 hover:text-info"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}