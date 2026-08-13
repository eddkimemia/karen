import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { img } from "@/lib/utils";

/** Sidebar for journal pages — the destinations of East Africa. */
export async function BlogSidebar() {
  const destinations = await prisma.destination.findMany({
    orderBy: [{ country: "asc" }, { name: "asc" }],
    take: 9,
    select: { slug: true, name: true, country: true, image: true, imageAlt: true },
  });

  return (
    <aside className="space-y-8">
      <div className="border border-midnight/10 bg-white p-6 shadow-sm">
        <p className="text-[0.625rem] font-medium uppercase tracking-[0.3em] text-gold">
          East Africa
        </p>
        <h2 className="mt-2 font-serif text-2xl font-medium text-midnight">
          Destinations in the Journal
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-midnight/55">
          Every story is rooted in a place — explore the landscapes behind the
          words.
        </p>
        <ul className="mt-6 space-y-4">
          {destinations.map((d) => (
            <li key={d.slug}>
              <Link
                href={`/destinations/${d.slug}`}
                className="group flex items-center gap-3.5"
              >
                <div className="relative h-12 w-16 shrink-0 overflow-hidden">
                  <Image
                    src={img(d.image, 200)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-serif text-base font-medium text-midnight transition-colors group-hover:text-gold">
                    {d.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-midnight/45">
                    <MapPin className="h-3 w-3 text-gold" /> {d.country}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold/60 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/destinations"
          className="mt-7 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.25em] text-midnight transition-colors hover:text-gold"
        >
          All destinations <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}