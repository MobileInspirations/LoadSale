"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  conditionGrade: string;
  saleType: string;
  price: string;
  status: string;
  photos: { id: string; url: string; isHero: boolean; position: number }[];
  seller: { id: string; name: string | null; email: string };
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query Listing($id: ID!) {
            listing(id: $id) {
              id title description category subcategory conditionGrade saleType price status
              photos { id url isHero position }
              seller { id name email }
            }
          }
        `,
        variables: { id },
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.listing) setListing(json.data.listing);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <main className="min-h-screen px-4 py-8 md:px-8">
          <Skeleton className="mx-auto max-w-4xl h-96 rounded-2xl" />
          <Skeleton className="mx-auto mt-6 max-w-4xl h-32 rounded-2xl" />
        </main>
      </AppShell>
    );
  }

  if (!listing) {
    return (
      <AppShell>
        <main className="min-h-screen px-4 py-8 md:px-8">
          <div className="text-center text-white/80">Listing not found.</div>
          <Link href="/listings" className="mt-4 block text-center text-cyan-400 hover:underline">
            Back to listings
          </Link>
        </main>
      </AppShell>
    );
  }

  const heroPhoto = listing.photos?.find((p) => p.isHero) ?? listing.photos?.[0];

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/listings" className="text-sm text-white/60 hover:text-cyan-400">
            ← Back to listings
          </Link>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {heroPhoto ? (
                <img
                  src={heroPhoto.url}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="aspect-square w-full bg-white/10 flex items-center justify-center text-white/40">
                  No photo
                </div>
              )}
            </div>
            <div>
              <h1 className="font-mono text-2xl font-bold tracking-wider text-white">
                {listing.title}
              </h1>
              <p className="mt-2 text-2xl font-semibold text-cyan-400">${listing.price}</p>
              <p className="mt-2 text-sm text-white/60">
                {listing.category}
                {listing.subcategory && ` · ${listing.subcategory}`} · Grade {listing.conditionGrade} · {listing.saleType}
              </p>
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-medium text-white/80">Seller</h2>
                <p className="mt-1 text-white">{listing.seller?.name ?? listing.seller?.email ?? "—"}</p>
              </div>
              <Link href={`/checkout/${listing.id}`}>
                <Button className="mt-6 w-full">Buy now</Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="font-semibold text-white">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-white/80">{listing.description}</p>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
