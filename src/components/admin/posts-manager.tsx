"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border border-ivory/15 bg-royal-deep/60 px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none";

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  imageAlt: string;
  published: boolean;
  publishedAt: string;
  content: string;
  author: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function PostsManager({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  async function remove(p: PostRow) {
    if (!confirm(`Delete "${p.title}" permanently?`)) return;
    const res = await fetch(`/api/admin/posts/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q),
    );
  }, [posts, search]);

  return (
    <div className="space-y-8">
      {error && (
        <p className="border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/40" />
            <input
              type="text"
              className={cn(inputClass, "pl-9")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts…"
            />
          </div>
          <span className="shrink-0 text-xs text-ivory/45">
            {filtered.length} of {posts.length}
          </span>
        </div>
        <a
          href="/admin/blog/edit"
          className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <AdminCard key={p.id} className="group overflow-hidden">
            <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-3">
              <span className="text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/80">
                {p.category}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1.5 text-[0.625rem] font-medium uppercase tracking-[0.2em]",
                  p.published ? "text-emerald-400" : "text-ivory/40",
                )}
              >
                {p.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {p.published ? "Live" : "Draft"}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-serif text-xl font-medium text-ivory">{p.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/55">
                {p.excerpt}
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs text-ivory/40">
                <Calendar className="h-3.5 w-3.5" /> {fmt(p.publishedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-ivory/10 px-5 py-3">
              <a
                href={`/admin/blog/edit?id=${p.id}`}
                className="flex flex-1 items-center justify-center gap-2 border border-ivory/15 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </a>
              <button
                type="button"
                onClick={() => remove(p)}
                className="flex items-center justify-center border border-red-500/30 px-3 py-2 text-red-400/80 transition-colors hover:border-red-500 hover:text-red-400"
                aria-label={`Delete ${p.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </AdminCard>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-ivory/50">No posts match your search.</p>
        )}
      </div>
    </div>
  );
}