import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { HomeListings } from "@/components/home-listings";

export default function HomePage() {
  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
            <h1 className="font-mono text-3xl font-bold tracking-wider text-white md:text-4xl">
              LoadDrop
            </h1>
            <p className="mt-2 text-lg text-white/80">
              AI-powered marketplace for bulk inventory. One listing, every channel.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/listings">
                <Button>Browse loads</Button>
              </Link>
              <Link href="/listings/new">
                <Button variant="secondary">Sell a load</Button>
              </Link>
            </div>
          </section>
          <section className="mt-12">
            <h2 className="mb-6 font-mono text-xl font-semibold tracking-wider text-white">
              Recent listings
            </h2>
            <HomeListings />
          </section>
        </div>
      </main>
    </AppShell>
  );
}
