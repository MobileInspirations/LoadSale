"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

export default function SyndicatePage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  const [listing, setListing] = useState<{ title: string; price: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query { listing(id: "${listingId}") { title price } }`,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.listing) setListing(json.data.listing);
      });
  }, [listingId]);

  const postText = listing
    ? `🛒 ${listing.title}\n💰 $${listing.price}\n\n👉 View on LoadDrop: ${typeof window !== "undefined" ? window.location.origin : ""}/listings/${listingId}`
    : "";

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="font-mono text-xl font-bold text-white">Share to Facebook groups</h1>
          <p className="mt-2 text-sm text-white/60">Copy the post below and paste into your groups (Tier 1 syndication).</p>
          <textarea
            readOnly
            value={postText}
            rows={6}
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white"
          />
          <Button
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(postText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy to clipboard"}
          </Button>
          <Button variant="secondary" className="ml-3" onClick={() => router.push(`/listings/${listingId}`)}>
            Back to listing
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
