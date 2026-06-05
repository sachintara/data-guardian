import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function KpiCard({
  label, value, sub, delta, tone = "default", icon, children,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  delta?: { value: string; positive?: boolean };
  tone?: "default" | "healthy" | "warning" | "critical";
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const toneRing = {
    default: "",
    healthy: "before:bg-healthy",
    warning: "before:bg-warning",
    critical: "before:bg-critical",
  }[tone];

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border bg-card p-4",
      "before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]",
      toneRing,
    )}>
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="tabular text-2xl font-semibold text-foreground">{value}</div>
        {delta && (
          <span className={cn("inline-flex items-center text-xs font-medium", delta.positive ? "text-healthy" : "text-critical")}>
            {delta.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {delta.value}
          </span>
        )}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}