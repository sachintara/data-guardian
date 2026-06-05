import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, Users, Workflow, Bell, Activity, Sparkles, Search, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveDot } from "./status-pill";
import { alerts } from "@/lib/mock-data";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Portfolio" },
  { to: "/clients", icon: Users, label: "Clients" },
  { to: "/programs", icon: Workflow, label: "Programs" },
  { to: "/alerts", icon: Bell, label: "Alert Center" },
  { to: "/insights", icon: Sparkles, label: "AI Insights" },
] as const;

export function AppShell({ children, title, subtitle, actions, breadcrumbs }: {
  children: ReactNode; title: string; subtitle?: string; actions?: ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}) {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const openCount = alerts.filter(a => a.status !== "resolved").length;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-sidebar-foreground">Pulse OPS</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Data Lifecycle</div>
          </div>
        </div>
        <nav className="flex-1 px-2">
          {nav.map(n => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={cn(
                "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}>
                <span className="flex items-center gap-2.5">
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </span>
                {n.to === "/alerts" && openCount > 0 && (
                  <span className="rounded-full bg-critical px-1.5 py-0.5 text-[10px] font-bold text-critical-foreground tabular">{openCount}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
            <div className="flex items-center justify-between">
              <LiveDot />
              <span className="text-[10px] font-mono text-muted-foreground">5s</span>
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground">Last refresh 4s ago</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              {breadcrumbs && (
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {breadcrumbs.map((b, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {b.to ? <Link to={b.to} className="hover:text-foreground">{b.label}</Link> : <span>{b.label}</span>}
                      {i < breadcrumbs.length - 1 && <span>/</span>}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3">
                <h1 className="truncate text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground w-64">
                <Search className="h-3.5 w-3.5" />
                <input className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search clients, programs, records..." />
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
              </div>
              <button className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-4 w-4" />
              </button>
              <button className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </button>
              {actions}
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}