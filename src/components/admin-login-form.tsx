"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't sign in right now — please try again.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-7" noValidate>
      <label
        htmlFor="admin-password"
        className="mb-2 block text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-ivory/55"
      >
        Password
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-ivory/20 bg-royal-deep/60 py-3 pl-11 pr-4 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2.5 bg-gold px-8 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.2em] text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
