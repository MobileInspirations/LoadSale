"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ListingCardSkeleton } from "@/components/loading-skeleton";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, "");

interface Listing {
  id: string;
  title: string;
  category: string;
  conditionGrade: string;
  saleType: string;
  price: string;
  photos: { url: string; isHero: boolean }[];
}

export function HomeListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query Listings {
            listings(limit: 6) {
              id title category conditionGrade saleType price
              photos { url isHero }
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

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 py-12 text-center text-white/60">
        No listings yet. Be the first to list.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Link href={`/listings/${listing.id}`}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-cyan-500/30 hover:bg-white/10">
              <div className="aspect-[4/3] bg-white/10">
                {listing.photos?.[0] ? (
                  <img
                    src={listing.photos.find((p) => p.isHero)?.url ?? listing.photos[0].url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/40">No photo</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white line-clamp-1">{listing.title}</h3>
                <p className="mt-1 text-sm text-white/60">
                  {listing.category} · {listing.conditionGrade}
                </p>
                <p className="mt-2 font-mono text-cyan-400">${listing.price}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
