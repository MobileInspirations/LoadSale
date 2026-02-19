"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-[hsl(var(--surface-elevated))] p-2 shadow-2xl"
          >
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <Search className="h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search loads, go to..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                autoFocus
              />
              <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white/60">
                ESC
              </kbd>
            </div>
            <div className="mt-2 max-h-64 overflow-auto">
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => {
                  router.push("/");
                  setOpen(false);
                }}
              >
                Go to Explore
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => {
                  router.push("/dashboard");
                  setOpen(false);
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
