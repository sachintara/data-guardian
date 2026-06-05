import { cn } from "@/lib/utils";
import type { StageMetrics, Health } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";

const stageTone: Record<Health, { ring: string; bar: string; text: string; icon: typeof CheckCircle2 }> = {
  healthy: { ring: "border-healthy/40 bg-healthy-soft/40", bar: "bg-healthy", text: "text-healthy", icon: CheckCircle2 },
  warning: { ring: "border-warning/40 bg-warning-soft/40", bar: "bg-warning", text: "text-warning", icon: AlertTriangle },
  critical: { ring: "border-critical/50 bg-critical-soft/40", bar: "bg-critical", text: "text-critical", icon: XCircle },
};

export function LifecycleFlow({ stages, onStageClick }: { stages: StageMetrics[]; onStageClick?: (k: StageMetrics) => void }) {
  const maxTotal = Math.max(...stages.map(s => s.total));
  return (
    <div className="relative">
      <div className="grid gap-3 md:grid-cols-4">
        {stages.map((s, i) => {
          const tone = stageTone[s.status];
          const Icon = tone.icon;
          const width = (s.total / maxTotal) * 100;
          const successPct = (s.success / s.total) * 100;
          const failPct = (s.failed / s.total) * 100;
          const pendPct = (s.pending / s.total) * 100;
          return (
            <button
              key={s.key}
              onClick={() => onStageClick?.(s)}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]",
                tone.ring,
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", tone.text)} />
                  <div className="text-sm font-semibold text-foreground">{s.label}</div>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">stage {i + 1}</div>
              </div>

              <div className="tabular text-2xl font-semibold text-foreground">{s.total.toLocaleString()}</div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full", tone.bar)} style={{ width: `${width}%` }} />
              </div>

              <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-healthy" style={{ width: `${successPct}%` }} />
                <div className="h-full bg-warning" style={{ width: `${pendPct}%` }} />
                <div className="h-full bg-critical" style={{ width: `${failPct}%` }} />
              </div>

              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <div><div className="text-healthy tabular font-semibold">{s.success.toLocaleString()}</div><div className="text-muted-foreground">success</div></div>
                <div><div className="text-warning tabular font-semibold">{s.pending.toLocaleString()}</div><div className="text-muted-foreground">pending</div></div>
                <div><div className="text-critical tabular font-semibold">{s.failed.toLocaleString()}</div><div className="text-muted-foreground">failed</div></div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="tabular">{(s.avgMs / 1000).toFixed(2)}s avg</span>
              </div>

              {i < stages.length - 1 && (
                <div className="absolute right-[-12px] top-1/2 z-10 hidden -translate-y-1/2 md:block">
                  <svg width="20" height="14" viewBox="0 0 20 14" className={cn(tone.text)}>
                    <path d="M0 7 H16 M11 2 L16 7 L11 12" className="flow-dash" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Funnel summary */}
      <div className="mt-4 rounded-lg border border-border bg-card/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Funnel — record progression</div>
          <div className="text-xs text-muted-foreground tabular">
            {stages[0].total.toLocaleString()} in → <span className="text-healthy font-semibold">{stages[stages.length - 1].success.toLocaleString()} delivered</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-16">
          {stages.map(s => {
            const h = (s.total / maxTotal) * 100;
            return (
              <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-gradient-to-t from-info/60 to-info" style={{ height: `${h}%` }} />
                <div className="text-[10px] text-muted-foreground">{s.label.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}