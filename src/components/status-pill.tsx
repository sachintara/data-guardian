import { cn } from "@/lib/utils";
import type { Health, Severity } from "@/lib/mock-data";

const healthClass: Record<Health, string> = {
  healthy: "bg-healthy-soft text-healthy border-healthy/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  critical: "bg-critical-soft text-critical border-critical/40",
};

export function HealthPill({ health, label, className }: { health: Health; label?: string; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide",
      healthClass[health], className,
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", health === "healthy" ? "bg-healthy" : health === "warning" ? "bg-warning" : "bg-critical pulse-dot")} />
      {label ?? health}
    </span>
  );
}

const sevClass: Record<Severity, string> = {
  critical: "bg-critical text-critical-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-info-soft text-info border border-info/30",
  low: "bg-muted text-muted-foreground",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
      sevClass[severity],
    )}>
      {severity}
    </span>
  );
}

export function LiveDot() {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-healthy opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-healthy" />
      </span>
      <span className="font-mono">LIVE</span>
    </span>
  );
}