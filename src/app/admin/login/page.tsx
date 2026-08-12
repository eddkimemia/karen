import Link from "next/link";
import { isAdminAuthed } from "@/lib/admin";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminAuthed()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal-deep px-5">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(201,162,39,0.12),transparent)]" />
        <div className="border border-gold/25 bg-midnight p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center border border-gold/60 font-serif text-2xl font-medium text-gold">
              K
            </span>
            <div className="leading-none">
              <p className="font-serif text-xl font-medium text-ivory">
                Karen Adventures<span className="text-gold">.</span>
              </p>
              <p className="mt-1 text-[0.5625rem] font-medium uppercase tracking-[0.35em] text-gold/80">
                Admin Console
              </p>
            </div>
          </div>

          <h1 className="mt-8 font-serif text-3xl font-medium text-ivory">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-ivory/55">
            Enter the admin password to manage inquiries, bookings and
            subscribers.
          </p>

          <AdminLoginForm />

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ivory/40 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
