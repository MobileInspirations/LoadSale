"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LayoutDashboard, Package } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Listings", icon: Package },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[hsl(var(--surface))]/95 backdrop-blur-xl transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/" className="font-mono text-xl font-bold tracking-wider text-white">
            LoadDrop
          </Link>
          <button
            type="button"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[hsl(var(--surface))]/80 px-4 backdrop-blur-xl md:px-8">
          <button
            type="button"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center gap-4 md:justify-center">
            <div className="hidden w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:flex md:items-center md:gap-2">
              <Search className="h-4 w-4 text-white/50" />
              <span className="text-sm text-white/50">Search loads...</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <span className="text-sm text-white/80">{session.user.email}</span>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
      <CommandPalette />
    </div>
  );
}
