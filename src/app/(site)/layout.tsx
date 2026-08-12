import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsAppFloat } from "@/components/whatsapp-float";

/** Public marketing shell — nav, footer and floating CTAs. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyCta />
      <WhatsAppFloat />
    </>
  );
}
