import { AppShell } from "@/components/layout/app-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/sign-in");

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-mono text-2xl font-bold tracking-wider text-white">Profile</h1>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-white/60">Email</dt>
                <dd className="text-white">{session.user.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/60">Name</dt>
                <dd className="text-white">{session.user.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-white/60">Role</dt>
                <dd className="text-white">{(session.user as { role?: string }).role ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
