"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { RichEditor } from "@/components/admin/rich-editor";
import { AdminCard } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { PostRow } from "@/components/admin/posts-manager";

const inputClass =
  "w-full border border-ivory/15 bg-royal-deep/60 px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none";

const labelClass =
  "mb-1.5 block text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/70";

const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);

export function PostEditor({ post }: { post: PostRow | null }) {
  const router = useRouter();
  const editing = post !== null;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [category, setCategory] = useState(post?.category ?? "Journal");
  const [author, setAuthor] = useState(post?.author ?? "Karen Adventures");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [image, setImage] = useState(post?.image ?? "");
  const [imageAlt, setImageAlt] = useState(post?.imageAlt ?? "");
  const [published, setPublished] = useState(post?.published ?? true);
  const [publishedAt, setPublishedAt] = useState(
    post?.publishedAt.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  );

  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSlug = useMemo(
    () => slugify(title || "untitled-post"),
    [title],
  );

  const onTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        slug: slugTouched ? slug.trim() : autoSlug,
        category: category.trim() || "Journal",
        author: author.trim() || "Karen Adventures",
        excerpt: excerpt.trim(),
        content,
        image: image.trim(),
        imageAlt: imageAlt.trim(),
        published,
        publishedAt,
      };
      const url = editing ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const categories = ["Journal", "Safari Guide", "Travel Guide", "Wildlife", "Adventure", "Coast", "Culture", "Food", "Conservation", "Itinerary", "City Guide"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-champagne"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </button>
        <span className="text-[0.625rem] uppercase tracking-[0.3em] text-gold/80">
          {editing ? "Editing post" : "New post"}
        </span>
      </div>

      {error && (
        <p className="border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main column — rich text body */}
        <AdminCard className="p-6">
          <div className="mb-5">
            <label className={labelClass}>Title</label>
            <input
              type="text"
              className={cn(inputClass, "font-serif text-lg")}
              value={title}
              onChange={(e) => onTitle(e.target.value)}
              placeholder="e.g. The Best Time to Visit the Maasai Mara"
            />
          </div>

          <div className="mb-5">
            <label className={labelClass}>Slug</label>
            <input
              type="text"
              className={inputClass}
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder={autoSlug}
            />
            <p className="mt-1.5 text-[0.6875rem] text-ivory/40">
              /blog/{slug || autoSlug}
            </p>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Excerpt — shown on the journal grid</label>
            <textarea
              className={cn(inputClass, "resize-y")}
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary of the story…"
            />
          </div>

          <div>
            <label className={labelClass}>Body — rich text</label>
            <RichEditor value={content} onChange={setContent} placeholder="Begin writing your story…" />
          </div>
        </AdminCard>

        {/* Side column — settings */}
        <div className="space-y-6">
          <AdminCard className="p-6">
            <p className={labelClass}>Category</p>
            <input
              type="text"
              className={inputClass}
              list="post-categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="post-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <p className={cn(labelClass, "mt-5")}>Author</p>
            <input
              type="text"
              className={inputClass}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <p className={cn(labelClass, "mt-5")}>Publish date</p>
            <input
              type="date"
              className={inputClass}
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-ivory/70">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              Published (visible on the site)
            </label>
          </AdminCard>

          <AdminCard className="p-6">
            <p className={labelClass}>Hero image (Unsplash photo ID)</p>
            <input
              type="text"
              className={inputClass}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="e.g. 1547471080-7cc2caa01a7e"
            />
            <p className="mt-1.5 text-[0.6875rem] text-ivory/40">
              Unsplash photo ID, e.g. from images.unsplash.com/photo-…
            </p>

            <p className={cn(labelClass, "mt-5")}>Image alt text</p>
            <input
              type="text"
              className={inputClass}
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
            />
          </AdminCard>

          <button
            type="button"
            onClick={save}
            disabled={saving || !title.trim()}
            className="flex w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> {editing ? "Save changes" : "Publish post"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}