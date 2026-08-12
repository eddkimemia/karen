"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck2,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col bg-royal-deep lg:flex-row">
      {/* Sidebar */}
      <aside className="flex flex-col border-b border-gold/15 bg-midnight lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-6 py-6">
          <span className="flex h-10 w-10 items-center justify-center border border-gold/60 font-serif text-xl font-medium text-gold">
            K
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-medium text-ivory">
              Karen Adventures<span className="text-gold">.</span>
            </span>
            <span className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.35em] text-gold/80">
              Admin Console
            </span>
          </span>
        </div>

        <nav
          className="flex gap-1 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4 lg:py-2"
          aria-label="Admin"
        >
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 border px-4 py-3 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-all duration-300 lg:border-0",
                isActive(href)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-ivory/10 text-ivory/60 hover:text-champagne",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden border-t border-ivory/10 px-6 py-5 lg:block">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-champagne"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 pb-28 sm:px-8 lg:py-12 lg:pb-12">
          {children}
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-gold/15 bg-midnight/95 px-4 py-3 backdrop-blur-md lg:hidden">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            aria-label={label}
            className={cn(
              "flex flex-col items-center gap-1 text-[0.5625rem] font-medium uppercase tracking-[0.15em]",
              isActive(href) ? "text-gold" : "text-ivory/50",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {label}
          </Link>
        ))}
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="flex flex-col items-center gap-1 text-[0.5625rem] font-medium uppercase tracking-[0.15em] text-ivory/50"
        >
          <LogOut className="h-5 w-5" strokeWidth={1.75} />
          Exit
        </button>
      </div>
    </div>
  );
}
