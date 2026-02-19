"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, TrendingUp, ShoppingCart, Bell } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<{ listings: number; transactions: number }>({ listings: 0, transactions: 0 });

  useEffect(() => {
    const token = (session as { accessToken?: string })?.accessToken;
    if (!token) return;
    Promise.all([
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: `query { listings(limit: 1) { id } }` }),
      }).then((r) => r.json()),
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query: `query { myTransactions { id } }` }),
      }).then((r) => r.json()),
    ]).then(([listingsRes, txRes]) => {
      setStats({
        listings: listingsRes.data?.listings?.length ?? 0,
        transactions: txRes.data?.myTransactions?.length ?? 0,
      });
    });
  }, [session]);

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <h1 className="mb-6 font-mono text-2xl font-bold tracking-wider text-white">Dashboard</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <Package className="h-8 w-8 text-cyan-400" />
            <p className="mt-2 font-mono text-2xl font-bold text-white">{stats.listings}</p>
            <p className="text-sm text-white/60">Listings</p>
            <Link href="/listings/new" className="mt-2 block text-sm text-cyan-400 hover:underline">
              New listing
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <TrendingUp className="h-8 w-8 text-emerald-400" />
            <p className="mt-2 font-mono text-2xl font-bold text-white">—</p>
            <p className="text-sm text-white/60">Revenue</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <ShoppingCart className="h-8 w-8 text-purple-400" />
            <p className="mt-2 font-mono text-2xl font-bold text-white">{stats.transactions}</p>
            <p className="text-sm text-white/60">Orders</p>
            <Link href="/dashboard/transactions" className="mt-2 block text-sm text-cyan-400 hover:underline">
              View all
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <Bell className="h-8 w-8 text-amber-400" />
            <p className="mt-2 text-sm text-white/60">Notifications</p>
            <p className="text-white/40">No new alerts</p>
          </motion.div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-semibold text-white">Quick actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/listings/new">
                <Button>New listing</Button>
              </Link>
              <Link href="/listings">
                <Button variant="secondary">Browse loads</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost">Profile</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-semibold text-white">Pro</h2>
            <p className="mt-2 text-sm text-white/60">Upgrade for 1% fees, syndication, and analytics.</p>
            <Link href="/pro">
              <Button variant="glow" className="mt-4">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
