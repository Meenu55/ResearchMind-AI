import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home, MessageSquare, FileSearch, BookOpen, Network, Lightbulb,
  Sparkles, FileText, BarChart3, Settings as SettingsIcon,
  Search, Sun, Moon, PanelLeftClose, PanelLeftOpen, Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assistant", label: "Research Assistant", icon: MessageSquare },
  { to: "/papers", label: "Paper Search", icon: FileSearch },
  { to: "/semantic-search", label: "Semantic Search", icon: FileSearch },
  { to: "/reviews", label: "Literature Reviews", icon: BookOpen },
  { to: "/graph", label: "Knowledge Graph", icon: Network },
  { to: "/gaps", label: "Research Gaps", icon: Lightbulb },
  { to: "/ideas", label: "Idea Generator", icon: Sparkles },
  { to: "/proposals", label: "Proposal Generator", icon: FileText },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 248 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="hidden md:flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
      >
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border gap-2">
          <div className="size-8 rounded-lg bg-foreground text-background grid place-items-center shrink-0">
            <Brain className="size-4" />
          </div>
          {!collapsed && (
            <span className="font-semibold tracking-tight truncate">ResearchMind</span>
          )}
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background/70 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-4 md:px-6 flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2 mr-1">
              <div className="size-7 rounded-md bg-foreground text-background grid place-items-center">
                <Brain className="size-3.5" />
              </div>
              <span className="font-semibold text-sm">ResearchMind</span>
            </div>
            <div className="flex-1 max-w-xl mx-auto relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search papers, reviews, ideas…"
                className="w-full h-9 pl-9 pr-3 rounded-md bg-muted/60 border border-transparent focus:bg-background focus:border-border outline-none text-sm transition-colors"
              />
            </div>
            <button
              onClick={toggle}
              className="size-9 grid place-items-center rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <div className="size-9 rounded-full bg-gradient-to-br from-muted to-secondary border border-border grid place-items-center text-xs font-medium">
              RM
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 min-w-0"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
