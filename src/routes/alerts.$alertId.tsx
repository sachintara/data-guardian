import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getAlert, getProgram, getClient } from "@/lib/mock-data";
import { LifecycleFlow } from "@/components/lifecycle-flow";
import { SeverityBadge, HealthPill } from "@/components/status-pill";
import { Sparkles, Clock, ArrowRight, FileText, UserPlus, CheckCircle2, MessageSquarePlus, Flag } from "lucide-react";

export const Route = createFileRoute("/alerts/$alertId")({
  head: ({ params }) => ({ meta: [{ title: `${params.alertId} · Investigation · Pulse OPS` }] }),
  loader: ({ params }) => {
    const alert = getAlert(params.alertId);
    if (!alert) throw notFound();
    return { alert };
  },
  component: AlertDetail,
  notFoundComponent: () => <div className="p-10 text-muted-foreground">Alert not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-critical">{error.message}</div>,
});

function AlertDetail() {
  const { alert } = Route.useLoaderData();
  const program = getProgram(alert.programId)!;
  const client = getClient(alert.clientId)!;

  const timeline = [
    { t: alert.openedAt, label: "Alert raised", desc: alert.title, kind: "critical" as const },
    { t: "2m later", label: "Auto-triage", desc: `Classified as ${alert.type}`, kind: "info" as const },
    { t: "5m later", label: "Notification", desc: `On-call (${alert.owner ?? "unassigned"}) paged`, kind: "info" as const },
    { t: "now", label: "Awaiting action", desc: "No mitigation applied yet", kind: "warning" as const },
  ];

  return (
    <AppShell
      title={alert.title}
      subtitle={`Investigation · ${alert.id}`}
      breadcrumbs={[{ label: "Portfolio", to: "/" }, { label: "Alerts", to: "/alerts" }, { label: alert.id }]}
      actions={
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary"><MessageSquarePlus className="h-3.5 w-3.5" /> Note</button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary"><UserPlus className="h-3.5 w-3.5" /> Assign</button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs hover:bg-secondary"><FileText className="h-3.5 w-3.5" /> Export</button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-critical px-3 py-1.5 text-xs font-medium text-critical-foreground hover:opacity-90"><Flag className="h-3.5 w-3.5" /> Escalate</button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-healthy px-3 py-1.5 text-xs font-medium text-healthy-foreground hover:opacity-90"><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</button>
        </div>
      }
    >
      <div className="rounded-xl border border-critical/30 bg-gradient-to-br from-critical-soft/60 to-card p-5">
        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge severity={alert.severity} />
          <HealthPill health={program.status} />
          <span className="text-xs font-mono text-muted-foreground">{alert.id} · opened {alert.openedAt}</span>
          <span className="text-xs text-muted-foreground">Stage: <span className="capitalize text-foreground">{alert.stage}</span></span>
          <span className="text-xs text-muted-foreground">Owner: <span className="text-foreground">{alert.owner ?? "Unassigned"}</span></span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Issue Summary</div>
            <div className="mt-1 text-sm leading-snug">{alert.description}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Impact</div>
            <div className="mt-1 text-sm leading-snug">{alert.impact}</div>
          </div>
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Recommended Action</div>
            <div className="mt-1 text-sm leading-snug text-info">{alert.recommended}</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          Affected:
          <Link to="/clients/$clientId" params={{ clientId: client.id }} className="text-foreground hover:text-info">{client.name}</Link>
          <ArrowRight className="h-3 w-3" />
          <Link to="/programs/$programId" params={{ programId: program.id }} className="text-foreground hover:text-info">{program.name}</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Lifecycle stage view</div>
          <div className="text-xs text-muted-foreground">Failing stage is highlighted below</div>
          <div className="mt-4"><LifecycleFlow stages={program.stages} /></div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-info" /> AI root-cause indicators</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-lg border border-info/20 bg-info-soft/30 p-3">Schema for field <span className="font-mono">member_dob</span> changed at the source 47 minutes ago — coincides with the failure spike. <div className="mt-1 text-[11px] text-muted-foreground">confidence 84%</div></li>
            <li className="rounded-lg border border-info/20 bg-info-soft/30 p-3">Two prior incidents in the last 30 days correlated with the same upstream connector. <div className="mt-1 text-[11px] text-muted-foreground">confidence 71%</div></li>
            <li className="rounded-lg border border-warning/20 bg-warning-soft/30 p-3">Volume is 1.4× normal — increase the worker pool if this is expected. <div className="mt-1 text-[11px] text-muted-foreground">confidence 62%</div></li>
          </ul>
          <div className="mt-3 text-[11px] text-muted-foreground">AI suggests — humans decide. No automatic actions taken.</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Timeline</div>
          <ol className="mt-4 space-y-3">
            {timeline.map((e, i) => (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${e.kind === "critical" ? "bg-critical" : e.kind === "warning" ? "bg-warning" : "bg-info"}`} />
                  {i < timeline.length - 1 && <span className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {e.t}</div>
                  <div className="text-sm font-medium">{e.label}</div>
                  <div className="text-xs text-muted-foreground">{e.desc}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Sample failed records (12 of 1,284)</div>
          <table className="mt-3 w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="py-2">Record</th><th className="py-2">Reason</th><th className="py-2 text-right">Received</th>
            </tr></thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 font-mono text-xs">REC-{10001 + i}</td>
                  <td className="py-2 text-muted-foreground">{["Schema mismatch dob", "Null member_id", "QC-117 range", "QC-204 ref", "Date invalid", "QC-117 range"][i]}</td>
                  <td className="py-2 text-right tabular text-muted-foreground">{i * 3 + 4}m ago</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-3 w-full rounded-md border border-border bg-background/40 py-2 text-xs hover:bg-secondary">View all failed records →</button>
        </div>
      </div>
    </AppShell>
  );
}