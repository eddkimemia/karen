"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpenText,
  Calendar,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AdminCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border border-ivory/15 bg-royal-deep/60 px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none";

const textareaClass =
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

type FormState = {
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  imageAlt: string;
  published: boolean;
  publishedAt: string;
};

const emptyForm = (): FormState => ({
  title: "",
  slug: "",
  category: "Journal",
  author: "Karen Adventures",
  excerpt: "",
  content: "",
  image: "",
  imageAlt: "",
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
});

const toForm = (p: PostRow): FormState => ({
  title: p.title,
  slug: p.slug,
  category: p.category,
  author: p.author,
  excerpt: p.excerpt,
  content: p.content,
  image: p.image,
  imageAlt: p.imageAlt,
  published: p.published,
  publishedAt: p.publishedAt.slice(0, 10),
});

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function PostsManager({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PostRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm());
    setTab("write");
    setError(null);
  };

  const openEdit = (p: PostRow) => {
    setCreating(false);
    setEditing(p);
    setForm(toForm(p));
    setTab("write");
    setError(null);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
    setError(null);
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/admin/posts/${editing.id}` : "/api/admin/posts";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      close();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: PostRow) {
    if (!confirm(`Delete "${p.title}" permanently?`)) return;
    const res = await fetch(`/api/admin/posts/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    if (editing?.id === p.id) close();
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

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category))).sort(),
    [posts],
  );

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
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
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
              <h3 className="font-serif text-xl font-medium text-ivory">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ivory/55">
                {p.excerpt}
              </p>
              <p className="mt-4 flex items-center gap-2 text-xs text-ivory/40">
                <Calendar className="h-3.5 w-3.5" /> {fmt(p.publishedAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 border-t border-ivory/10 px-5 py-3">
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="flex flex-1 items-center justify-center gap-2 border border-ivory/15 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
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

      {(editing || creating) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-midnight/90 p-4 backdrop-blur-sm sm:p-8">
          <AdminCard className="w-full max-w-4xl">
            <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-4">
              <h2 className="font-serif text-xl font-medium text-ivory">
                {editing ? "Edit post" : "New post"}
              </h2>
              <button
                type="button"
                onClick={close}
                className="text-ivory/50 transition-colors hover:text-ivory"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 p-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. The Best Time to Visit the Maasai Mara"
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder="auto-generated from title if left blank"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      list="post-categories"
                      placeholder="Journal"
                    />
                    <datalist id="post-categories">
                      {categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className={labelClass}>Publish date</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={form.publishedAt}
                      onChange={(e) => set("publishedAt", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Author</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.author}
                    onChange={(e) => set("author", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Excerpt</label>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => set("excerpt", e.target.value)}
                    placeholder="A short summary shown on the journal grid"
                  />
                </div>
                <div>
                  <label className={labelClass}>Image (Unsplash ID)</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.image}
                    onChange={(e) => set("image", e.target.value)}
                    placeholder="e.g. 1547471080-7cc2caa01a7e"
                  />
                </div>
                <div>
                  <label className={labelClass}>Image alt text</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={form.imageAlt}
                    onChange={(e) => set("imageAlt", e.target.value)}
                  />
                </div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-ivory/70">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => set("published", e.target.checked)}
                    className="h-4 w-4 accent-gold"
                  />
                  Published (visible on the site)
                </label>
              </div>

              <div className="flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <span className={labelClass}>Content — Markdown</span>
                  <div className="flex border border-ivory/15">
                    {(["write", "preview"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={cn(
                          "px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.2em] transition-colors",
                          tab === t
                            ? "bg-gold text-midnight"
                            : "text-ivory/60 hover:text-ivory",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {tab === "write" ? (
                  <textarea
                    className={cn(textareaClass, "flex-1 font-mono text-[0.8125rem] leading-relaxed")}
                    rows={20}
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder={"## Heading\n\nWrite your post in Markdown. **Bold**, _italics_, lists and > quotes all work."}
                  />
                ) : (
                  <div className="prose-dark flex-1 overflow-y-auto border border-ivory/10 bg-royal-deep p-5">
                    <ReactMarkdown
                      components={{
                        h1: (p) => (
                          <h1 className="mb-3 font-serif text-2xl font-medium text-ivory" {...p} />
                        ),
                        h2: (p) => (
                          <h2 className="mb-2 mt-6 font-serif text-xl font-medium text-champagne" {...p} />
                        ),
                        h3: (p) => (
                          <h3 className="mb-2 mt-5 font-serif text-lg font-medium text-champagne" {...p} />
                        ),
                        p: (p) => <p className="mb-4 leading-relaxed text-ivory/70" {...p} />,
                        strong: (p) => <strong className="font-semibold text-champagne" {...p} />,
                        ul: (p) => <ul className="mb-4 list-disc space-y-1.5 pl-5 text-ivory/70" {...p} />,
                        ol: (p) => <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-ivory/70" {...p} />,
                        li: (p) => <li className="leading-relaxed" {...p} />,
                        blockquote: (p) => (
                          <blockquote
                            className="mb-4 border-l-2 border-gold pl-4 italic text-champagne/80"
                            {...p}
                          />
                        ),
                      }}
                    >
                      {form.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-ivory/10 px-6 py-4">
              <p className="text-xs text-ivory/40">
                <BookOpenText className="mr-1 inline h-3.5 w-3.5" />
                Markdown is rendered as rich text on the live post.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="border border-ivory/15 px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ivory/70 transition-colors hover:text-ivory"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 bg-gold px-6 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
                >
                  {saving ? "Saving…" : editing ? "Save changes" : "Create post"}
                </button>
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}

const labelClass =
  "mb-1.5 block text-[0.625rem] font-medium uppercase tracking-[0.25em] text-gold/80";