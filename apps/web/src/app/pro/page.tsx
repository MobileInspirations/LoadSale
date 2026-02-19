import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProPage() {
  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="font-mono text-2xl font-bold tracking-wider text-white">LoadDrop Pro</h1>
          <p className="mt-2 text-white/80">
            Pro Seller $49/mo · Pro Buyer $29/mo · Dual Pro $69/mo. Lower fees, syndication, early access.
          </p>
          <Button variant="glow" className="mt-6" disabled>
            Stripe subscription coming soon
          </Button>
          <Link href="/dashboard" className="mt-4 block text-sm text-cyan-400 hover:underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
