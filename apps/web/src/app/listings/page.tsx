"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ListingCardSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  conditionGrade: string;
  saleType: string;
  price: string;
  status: string;
  photos: { id: string; url: string; isHero: boolean }[];
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query Listings {
            listings(limit: 24) {
              id title description category conditionGrade saleType price status
              photos { id url isHero }
            }
          }
        `,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.listings) setListings(json.data.listings);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-mono text-2xl font-bold tracking-wider text-white">Listings</h1>
          <Link href="/listings/new">
            <Button>New listing</Button>
          </Link>
        </div>
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first load listing to get started."
            action={
              <Link href="/listings/new">
                <Button>New listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/listings/${listing.id}`}>
                  <div className="glass-card-hover overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="aspect-[4/3] bg-white/10">
                      {listing.photos?.[0] ? (
                        <img
                          src={listing.photos.find((p) => p.isHero)?.url ?? listing.photos[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/40">
                          No photo
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-medium text-white line-clamp-1">{listing.title}</h2>
                      <p className="mt-1 text-sm text-white/60">
                        {listing.category} · Grade {listing.conditionGrade}
                      </p>
                      <p className="mt-2 font-mono text-lg text-cyan-400">
                        ${listing.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
