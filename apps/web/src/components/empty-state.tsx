"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = <Package className="h-12 w-12 text-white/30" />,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 py-16 px-8 text-center"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-white/60">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
