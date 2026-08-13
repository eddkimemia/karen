"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacebookIcon, XIcon } from "@/components/social-icons";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

/** Social share buttons for journal articles. */
export function ShareButtons({
  title,
  slug,
  tone = "light",
}: {
  title: string;
  slug: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);
  const url = `https://karenadventures.com/blog/${slug}`;
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — fall back to nothing.
    }
  };

  const links = [
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      Icon: FacebookIcon,
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      Icon: XIcon,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      Icon: WhatsAppIcon,
    },
  ];

  const dark = tone === "dark";

  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          "text-[0.625rem] font-medium uppercase tracking-[0.3em]",
          dark ? "text-ivory/50" : "text-midnight/45",
        )}
      >
        Share
      </span>
      {links.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            "flex h-9 w-9 items-center justify-center border transition-all hover:border-gold hover:text-gold",
            dark
              ? "border-ivory/20 text-ivory/60"
              : "border-midnight/15 text-midnight/60",
          )}
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className={cn(
          "flex h-9 w-9 items-center justify-center border transition-all hover:border-gold hover:text-gold",
          dark
            ? "border-ivory/20 text-ivory/60"
            : "border-midnight/15 text-midnight/60",
        )}
      >
        {copied ? (
          <Check className={cn("h-4 w-4", dark ? "text-emerald-400" : "text-emerald-600")} />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}