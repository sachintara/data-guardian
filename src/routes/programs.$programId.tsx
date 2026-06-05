import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { getProgram, getClient, getProgramAlerts } from "@/lib/mock-data";
import { KpiCard } from "@/components/kpi-card";
import { HealthPill } from "@/components/status-pill";
import { LifecycleFlow } from "@/components/lifecycle-flow";
import { Activity, Clock, TrendingUp, XCircle, AlertTriangle, ArrowRight, FileText, UserPlus, Flag } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/programs/$programId")({
  head: ({ params }) => ({ meta: [{ title: `${params.programId} · Program · Pulse OPS` }] }),
  loader: ({ params }) => {
    const program = getProgram(params.programId);
    if (!program) throw notFound();
    return { program };
  },
  component: ProgramPage,
  notFoundComponent: () => <div className="p-10 text-muted-foreground">Program not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-critical">{error.message}</div>,
});

function ProgramPage() {
  const { program } = Route.useLoaderData();
  const client = getClient(program.clientId)!;
  const alerts = getProgramAlerts(program.id);

  return (
    <AppShell
      title={program.name}
      subtitle={`Client: ${client.name}`}
      breadcrumbs={[
        { label: "Portfolio", to: "/" },
        { label: "Clients", to: "/clients" },
        { label: client.name, to: "/clients/$clientId".replace("$clientId", client.id) },
        { label: "Program" },
      ]}
      actions={
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"><FileText className="h-3.5 w-3.5" /> Export</button>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"><UserPlus className="h-3.5 w-3.5" /> Assign</button>
          <button className="inline-flex items-center gap-1.5 rounded-md bg-critical px-3 py-1.5 text-xs font-medium text-critical-foreground hover:opacity-90"><Flag className="h-3.5 w-3.5" /> Escalate</button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        <KpiCard label="Status" value={<HealthPill health={program.status} />} tone={program.status} />
        <KpiCard label="Volume / 24h" value={program.volume.toLocaleString()} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Success Rate" value={`${program.successRate}%`} tone="healthy" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Failure Rate" value={`${program.failureRate}%`} tone={program.failureRate > 5 ? "critical" : "warning"} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Avg Processing" value={`${(program.processingMs / 1000).toFixed(1)}s`} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="SLA" value={<HealthPill health={program.slaStatus} />} tone={program.slaStatus} />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold">Lifecycle Flow</div>
            <div className="text-xs text-muted-foreground">Where are records being lost? Click a stage to investigate.</div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Dependencies:</span>
            {program.stages.map((s, i) => (
              <span key={s.key} className="flex items-center gap-1">
                <span className={`capitalize ${s.status === "critical" ? "text-critical" : s.status === "warning" ? "text-warning" : "text-healthy"}`}>{s.label}</span>
                {i < program.stages.length - 1 && <ArrowRight className="h-3 w-3" />}
              </span>
            ))}
          </div>
        </div>
        <LifecycleFlow stages={program.stages} />

        {program.stages.some(s => s.status === "critical") && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-critical/30 bg-critical-soft/40 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-critical" />
            <div className="text-sm">
              <div className="font-semibold text-critical">Downstream blockage detected</div>
              <div className="text-muted-foreground">
                {program.stages.find(s => s.status === "critical")?.label} is failing — Final Output is blocked for the affected records.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="text-sm font-semibold">Throughput · last 24 hours</div>
          <div className="text-xs text-muted-foreground">Hourly volume, success vs failure</div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={program.trend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
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
          <div className="text-sm font-semibold">Active alerts ({alerts.length})</div>
          <div className="mt-3 space-y-2">
            {alerts.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No active alerts</div>
            ) : alerts.map(a => (
              <Link key={a.id} to="/alerts/$alertId" params={{ alertId: a.id }} className="block rounded-lg border border-border bg-background/40 p-3 hover:border-info/40">
                <div className="text-xs font-mono text-muted-foreground">{a.id} · {a.openedAt}</div>
                <div className="text-sm font-medium">{a.type}</div>
                <div className="mt-1 text-xs text-muted-foreground">{a.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Failed records (sample)</div>
            <div className="text-xs text-muted-foreground">Drill into records to see raw payload & failure trace</div>
          </div>
          <button className="text-xs text-info hover:underline">View all failed records</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2">Record ID</th>
              <th className="py-2">Stage</th>
              <th className="py-2">Failure reason</th>
              <th className="py-2">Received</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, i) => ({
              id: `REC-${program.id.slice(-3).toUpperCase()}-${10043 + i}`,
              stage: ["Validation", "Validation", "Quality Check", "Quality Check", "Validation", "Quality Check"][i],
              reason: ["Schema mismatch on field 'dob'", "Null value in required field 'member_id'", "Failed rule QC-117 (range)", "Failed rule QC-204 (referential)", "Date format invalid", "Failed rule QC-117 (range)"][i],
              received: `${10 + i * 2}m ago`,
            })).map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="py-2 font-mono text-xs">{r.id}</td>
                <td className="py-2">{r.stage}</td>
                <td className="py-2 text-muted-foreground">{r.reason}</td>
                <td className="py-2 text-muted-foreground tabular">{r.received}</td>
                <td className="py-2 text-right"><button className="text-xs text-info hover:underline">Inspect</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}