"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { CATEGORY_TAXONOMY } from "@loaddrop/shared";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  "Photos",
  "Title & description",
  "Category & condition",
  "Sale type & price",
  "Review",
];
const CONDITION_GRADES = ["A", "B", "C", "D", "F"] as const;
const SALE_TYPES = ["BIN", "auction", "both"] as const;

export default function NewListingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [conditionGrade, setConditionGrade] = useState<string>("B");
  const [saleType, setSaleType] = useState<string>("BIN");
  const [price, setPrice] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [partOutEnabled, setPartOutEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const urls: string[] = [];
    for (let i = 0; i < Math.min(files.length, 20 - photoUrls.length); i++) {
      const file = files[i];
      if (file) urls.push(URL.createObjectURL(file));
    }
    setPhotoUrls((prev) => [...prev, ...urls].slice(0, 20));
  }

  const subcategories = CATEGORY_TAXONOMY.find((c) => c.primary === category)?.subcategories ?? [];

  async function handlePublish() {
    setError("");
    setLoading(true);
    const token = (session as { accessToken?: string })?.accessToken;
    if (!token) {
      setError("Please sign in to create a listing.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, ""),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation CreateListing($input: CreateListingInput!) {
                createListing(input: $input) { id }
              }
            `,
            variables: {
              input: {
                title,
                description,
                category,
                subcategory: subcategory || null,
                conditionGrade,
                saleType,
                price: parseFloat(price) || 0,
                reservePrice: reservePrice ? parseFloat(reservePrice) : null,
                partOutEnabled,
                photoUrls: photoUrls.length ? photoUrls : ["/placeholder-load.jpg"],
              },
            },
          }),
        }
      );
      const json = await res.json();
      if (json.errors?.length) {
        setError(json.errors[0]?.message ?? "Failed to create listing.");
        setLoading(false);
        return;
      }
      router.push("/listings");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  return (
    <AppShell>
      <main className="min-h-screen px-4 py-8 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 font-mono text-2xl font-bold tracking-wider text-white">
            New listing
          </h1>
          <div className="mb-8 flex gap-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= step ? "bg-cyan-500" : "bg-white/10"
                )}
              />
            ))}
          </div>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-hover rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-white">Photos</h2>
                <p className="mt-1 text-sm text-white/60">Upload up to 20 photos. First is the hero.</p>
                <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 py-12 transition-colors hover:border-cyan-500/50">
                  <Upload className="h-10 w-10 text-white/50" />
                  <span className="mt-2 text-sm text-white/60">Click or drag to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
                {photoUrls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {photoUrls.map((url, i) => (
                      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                        {i === 0 && (
                          <span className="absolute left-1 top-1 rounded bg-cyan-500 px-1.5 text-xs text-white">
                            Hero
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-hover rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-white">Title & description</h2>
                <p className="mt-1 text-sm text-white/60">AI can suggest a title and description from category and condition.</p>
                <Button
                  type="button"
                  variant="glow"
                  className="mt-3"
                  onClick={async () => {
                    if (!category || !conditionGrade) return;
                    const res = await fetch((process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/graphql$/, ""), {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        query: `mutation Generate($category: String!, $conditionGrade: String!) { generateListingDescription(category: $category, conditionGrade: $conditionGrade) { title description } }`,
                        variables: { category, conditionGrade },
                      }),
                    });
                    const json = await res.json();
                    if (json.data?.generateListingDescription) {
                      setTitle(json.data.generateListingDescription.title);
                      setDescription(json.data.generateListingDescription.description);
                    }
                  }}
                >
                  Generate with AI
                </Button>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mixed pallet - electronics & home"
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the load, condition, brands, etc."
                  rows={5}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40"
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-hover rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-white">Category & condition</h2>
                <label className="mt-4 block text-sm text-white/80">Primary category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
                >
                  <option value="">Select...</option>
                  {CATEGORY_TAXONOMY.map((c) => (
                    <option key={c.primary} value={c.primary}>
                      {c.primary}
                    </option>
                  ))}
                </select>
                {subcategories.length > 0 && (
                  <>
                    <label className="mt-4 block text-sm text-white/80">Subcategory</label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
                    >
                      <option value="">Any</option>
                      {subcategories.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <label className="mt-4 block text-sm text-white/80">Condition grade</label>
                <div className="mt-2 flex gap-2">
                  {CONDITION_GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setConditionGrade(g)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                        conditionGrade === g
                          ? "bg-cyan-500 text-white"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-hover rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-white">Sale type & price</h2>
                <div className="mt-4 flex gap-2">
                  {SALE_TYPES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSaleType(s)}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium",
                        saleType === s ? "bg-cyan-500 text-white" : "bg-white/10 text-white/80"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-sm text-white/80">Price (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
                />
                {(saleType === "auction" || saleType === "both") && (
                  <>
                    <label className="mt-4 block text-sm text-white/80">Reserve price (optional)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white"
                    />
                  </>
                )}
                <label className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={partOutEnabled}
                    onChange={(e) => setPartOutEnabled(e.target.checked)}
                    className="rounded border-white/20 text-cyan-500"
                  />
                  <span className="text-sm text-white/80">Allow part-out (sub-lots)</span>
                </label>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card-hover rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-lg font-semibold text-white">Review</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div>
                    <dt className="text-white/60">Title</dt>
                    <dd className="text-white">{title || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Category</dt>
                    <dd className="text-white">{category} {subcategory && ` / ${subcategory}`}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Condition</dt>
                    <dd className="text-white">{conditionGrade}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Sale type</dt>
                    <dd className="text-white">{saleType}</dd>
                  </div>
                  <div>
                    <dt className="text-white/60">Price</dt>
                    <dd className="text-white">${price || "0"}</dd>
                  </div>
                </dl>
                {error && <p className="mt-4 text-sm text-amber-400">{error}</p>}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-6 flex justify-between">
            <Button
              variant="secondary"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                disabled={
                  (step === 0 && photoUrls.length === 0) ||
                  (step === 1 && (!title || !description)) ||
                  (step === 2 && !category)
                }
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={loading}>
                {loading ? "Publishing..." : "Publish"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
