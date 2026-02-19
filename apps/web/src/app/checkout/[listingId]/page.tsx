"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const listingId = params.listingId as string;
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = (session as { accessToken?: string })?.accessToken;
    if (!token) {
      setLoading(false);
      setError("Please sign in to checkout.");
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `mutation CreateCheckout($listingId: ID!) { createCheckout(listingId: $listingId) { clientSecret transactionId } }`,
        variables: { listingId },
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.errors?.length) {
          setError(json.errors[0]?.message ?? "Checkout failed.");
          return;
        }
        setClientSecret(json.data?.createCheckout?.clientSecret ?? null);
      })
      .finally(() => setLoading(false));
  }, [listingId, session]);

  if (loading) {
    return (
      <AppShell>
        <main className="min-h-screen px-4 py-8 md:px-8">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/80">
            Preparing checkout...
          </div>
        </main>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <main className="min-h-screen px-4 py-8 md:px-8">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-amber-400">{error}</p>
            <Button className="mt-4" onClick={() => router.push(`/listings/${listingId}`)}>
              Back to listing
            </Button>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="font-mono text-xl font-bold text-white">Checkout</h1>
          <p className="mt-2 text-sm text-white/60">
            Payment integration (Stripe Connect) will be connected here. Client secret: {clientSecret?.slice(0, 20)}...
          </p>
          <Button className="mt-6 w-full" onClick={() => router.push("/dashboard/transactions")}>
            View orders
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
