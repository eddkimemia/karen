import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ensureCatalogSeeded } from "@/lib/self-seed";
import { img } from "@/lib/utils";
import { CtaSection } from "@/components/cta-section";
import { BlogSidebar } from "@/components/blog-sidebar";
import { ShareButtons } from "@/components/share-buttons";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

const fmt = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true, image: true, published: true },
  });
  if (!post || !post.published) return { title: "Story not found" };
  return {
    title: `${post.title} — The Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: img(post.image, 1200) }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  // Self-heal an empty catalog (fresh production DB) on first visit.
  await ensureCatalogSeeded();

  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { id: true, slug: true, title: true, category: true, image: true, publishedAt: true },
  });

  return (
    <>
      {/* Article header */}
      <section className="bg-midnight pt-36 pb-16 sm:pt-44 sm:pb-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:text-champagne"
            >
              <ArrowLeft className="h-4 w-4" /> The Journal
            </Link>
            <p className="mt-8 flex flex-wrap items-center gap-3 text-[0.625rem] font-medium uppercase tracking-[0.3em] text-ivory/50">
              <span className="bg-gold px-2.5 py-1 text-midnight">{post.category}</span>
              <span>{fmt(post.publishedAt)}</span>
              <span>· {post.author}</span>
            </p>
            <h1 className="mt-6 font-serif text-4xl font-medium leading-[1.08] text-ivory text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 font-serif text-lg italic leading-relaxed text-champagne/80">
              {post.excerpt}
            </p>
            <div className="mt-8">
              <ShareButtons title={post.title} slug={post.slug} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className="bg-ivory">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="relative aspect-[16/8] overflow-hidden">
            <Image
              src={img(post.image, 2000)}
              alt={post.imageAlt}
              fill
              priority
              sizes="(min-width: 1152px) 1104px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article body + destinations sidebar */}
      <section className="bg-ivory py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article
              className="blog-article mx-auto w-full max-w-3xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="lg:sticky lg:top-24 lg:self-start">
              <BlogSidebar />
            </div>
          </div>

          <div className="mx-auto mt-16 w-full max-w-3xl border-t border-midnight/10 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-midnight/50">
                <BookOpenText className="h-4 w-4" /> Written by {post.author} · Karen Adventures
              </p>
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-midnight/10 bg-sand py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl font-medium text-midnight sm:text-4xl">
                Keep Reading
              </h2>
              <Link
                href="/blog"
                className="hidden text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors hover:text-midnight sm:inline-flex"
              >
                All stories →
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-midnight/10 bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={img(r.image, 700)}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-midnight">
                      {r.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-medium leading-snug text-midnight transition-colors group-hover:text-gold">
                      {r.title}
                    </h3>
                    <span className="mt-4 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}