import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/page-header";
import { AdventureFilters } from "@/components/adventure-filters";
import { CtaSection } from "@/components/cta-section";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Adventures",
  description:
    "Signature East African journeys — safaris, mountain expeditions, coastal escapes and expeditions across the Great Rift Valley.",
};

export default async function AdventuresPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const [{ region }, adventures] = await Promise.all([
    searchParams,
    prisma.adventure.findMany({ orderBy: { startingPrice: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="The Journeys"
        title={
          <>
            Adventures,{" "}
            <em className="font-serif italic text-gold">Curated.</em>
          </>
        }
        description="Twenty journeys across East Africa, from one-day Nairobi experiences to a week on the jade waters of Turkana, the Serengeti plains and the roof of Ethiopia. Every one designed, guided and hosted by our team."
        image="1547471080-7cc2caa01a7e"
        imageAlt="A lion resting in the golden grass of the Maasai Mara"
        align="center"
      />

      <section className="bg-midnight py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <AdventureFilters
            adventures={adventures}
            initialRegion={region}
          />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
