import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, Building2, Workflow, Bell } from "lucide-react";
import { searchAll } from "@/lib/mock-data";

const ICONS = {
  client: <Building2 className="h-3.5 w-3.5 text-info" />,
  program: <Workflow className="h-3.5 w-3.5 text-healthy" />,
  alert: <Bell className="h-3.5 w-3.5 text-critical" />,
} as const;

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const hits = searchAll(q);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => setActive(0), [q]);

  function go(i: number) {
    const h = hits[i];
    if (!h) return;
    setOpen(false);
    setQ("");
    navigate({ to: h.to, params: h.params as never });
  }

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-muted-foreground w-72 focus-within:border-info/60">
        <Search className="h-3.5 w-3.5" />
        <input
          ref={inputRef}
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); go(active); }
          }}
          className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          placeholder="Search clients, programs, alerts..."
        />
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </div>

      {open && (q || hits.length > 0) && (
        <div className="absolute right-0 z-40 mt-1.5 w-[28rem] overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
          {hits.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matches for <span className="font-mono text-foreground">"{q}"</span>
              <div className="mt-1">Try a client name, program, or alert ID.</div>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto py-1">
              {hits.map((h, i) => (
                <li key={`${h.kind}-${h.id}`}>
                  <Link
                    to={h.to}
                    params={h.params as never}
                    onClick={() => { setOpen(false); setQ(""); }}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm ${i === active ? "bg-secondary/60" : "hover:bg-secondary/30"}`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/60">
                      {ICONS[h.kind]}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">{h.label}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{h.sub}</span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{h.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border bg-background/40 px-3 py-1.5 text-[10px] font-mono text-muted-foreground">
            ↑↓ navigate · ↵ open · esc close
          </div>
        </div>
      )}
    </div>
  );
}