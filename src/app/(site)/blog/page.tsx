import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { img } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Journal",
  description:
    "Field notes, guides and stories from East Africa — safari advice, gorilla treks, Kilimanjaro and Mount Kenya, Zanzibar, Lamu and the highlands of Ethiopia. Written by the people who guide them.",
};

const fmt = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Field Notes from East Africa"
        description="Stories, guides and honest advice from the people who live on these roads — how to read the migration, what a gorilla trek really takes, and where to eat in Nairobi."
        image="1534177616072-ef7dc120449d"
        imageAlt="Golden savannah light over East Africa"
      />

      <section className="bg-ivory py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          {lead && (
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="group mb-16 grid overflow-hidden border border-midnight/10 bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl lg:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
                  <Image
                    src={img(lead.image, 1200)}
                    alt={lead.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/50 to-transparent" />
                  <span className="absolute left-5 top-5 bg-gold px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.25em] text-midnight">
                    {lead.category}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <p className="flex items-center gap-2 text-[0.625rem] font-medium uppercase tracking-[0.3em] text-midnight/50">
                    <BookOpenText className="h-3.5 w-3.5" /> Latest story ·{" "}
                    {fmt(lead.publishedAt)}
                  </p>
                  <h2 className="mt-4 font-serif text-3xl font-medium text-midnight sm:text-4xl">
                    {lead.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-midnight/65">{lead.excerpt}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold transition-colors group-hover:text-midnight">
                    Read the story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-midnight/10 bg-white shadow-sm transition-shadow duration-500 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={img(p.image, 900)}
                      alt={p.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
                    <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-midnight">
                      {p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.625rem] font-medium uppercase tracking-[0.3em] text-midnight/50">
                      {fmt(p.publishedAt)}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-midnight transition-colors group-hover:text-gold">
                      {p.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-midnight/60">
                      {p.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-gold">
                      Read more <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="py-16 text-center text-midnight/50">
              New stories are on the way. Check back soon.
            </p>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}