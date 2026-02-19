"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/empty-state";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

interface Transaction {
  id: string;
  listingId: string;
  amount: string;
  platformFee: string;
  status: string;
  createdAt: string;
  listing?: { id: string; title: string };
}

export default function TransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = (session as { accessToken?: string })?.accessToken;
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `query { myTransactions { id listingId amount platformFee status createdAt listing { id title } } }`,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.myTransactions) setTransactions(json.data.myTransactions);
      })
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <h1 className="mb-6 font-mono text-2xl font-bold tracking-wider text-white">
          Transactions
        </h1>
        {!session ? (
          <p className="text-white/60">Sign in to view your orders.</p>
        ) : loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/60">
            Loading...
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Your purchase and sale history will appear here."
          />
        ) : (
          <div className="space-y-4">
            {transactions.map((t) => (
              <Link
                key={t.id}
                href={`/listings/${t.listingId}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-cyan-500/30"
              >
                <div className="flex justify-between">
                  <span className="text-white">{(t as { listing?: { title: string } }).listing?.title ?? "Order"}</span>
                  <span className="font-mono text-cyan-400">${t.amount}</span>
                </div>
                <p className="mt-1 text-sm text-white/60">
                  {t.status} · {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
