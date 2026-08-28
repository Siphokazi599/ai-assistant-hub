import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  ListTodo,
  Settings,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/tasks", label: "Task Planner", icon: ListTodo },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              active &&
                "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft ring-1 ring-sidebar-border",
            )}
          >
            <Icon
              className={cn("size-4.5 shrink-0", active && "text-sidebar-primary")}
              aria-hidden="true"
            />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-xl gradient-primary shadow-lift">
        <Sparkles className="size-5 text-primary-foreground" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold text-sidebar-foreground">
          AI Workplace
        </span>
        <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 flex-col justify-between bg-sidebar px-4 py-6 lg:flex">
        <div className="flex flex-col gap-8">
          <Brand />
          <NavLinks />
        </div>
        <p className="rounded-xl bg-sidebar-accent/60 p-3 text-[11px] leading-relaxed text-sidebar-foreground/70">
          Demo prototype — all AI responses are simulated in your browser. No account or API key
          needed.
        </p>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          className="grid size-10 place-items-center rounded-xl text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-8 bg-sidebar px-4 py-6 shadow-lift animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-9 place-items-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-68">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
