"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, UploadCloud, X } from "lucide-react";
import { img } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Image field for the admin console: upload a file (stored via the upload
 * API — Vercel Blob in production, public/uploads locally) or paste an
 * Unsplash photo ID / image URL, with a live preview.
 */
export function ImagePicker({
  label,
  value,
  onChange,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  id?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed.");
      }
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label className={label} htmlFor={id}>
        {label}
      </label>

      <div className="mt-2 flex flex-wrap items-start gap-4">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) upload(file);
          }}
          className={cn(
            "flex h-28 w-44 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed text-center transition-colors",
            dragging
              ? "border-gold bg-gold/10 text-gold"
              : "border-ivory/25 text-ivory/45 hover:border-gold/60 hover:text-gold",
          )}
          aria-label="Upload an image"
        >
          {busy ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-[0.625rem] uppercase tracking-[0.2em]">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6" />
              <span className="text-[0.625rem] uppercase tracking-[0.2em]">
                Upload image
              </span>
              <span className="px-2 text-[0.625rem] text-ivory/35">
                JPG, PNG, WebP, GIF, AVIF — up to 6 MB
              </span>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />

        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img(value, 400, 60)}
              alt="Preview"
              className="h-28 w-44 border border-ivory/15 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center border border-ivory/20 bg-royal-deep text-ivory/70 transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="min-w-[14rem] flex-1">
            <div className="flex items-center gap-2 text-ivory/40">
              <Link2 className="h-3.5 w-3.5" />
              <span className="text-[0.625rem] uppercase tracking-[0.2em]">
                or paste a link
              </span>
            </div>
            <input
              id={id}
              className="mt-2 w-full border border-ivory/15 bg-ivory/5 px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Unsplash photo ID (e.g. 1547471080-7cc2caa01a7e) or an image URL"
            />
          </div>
        )}
      </div>

      {hint && <p className="mt-2 text-[0.625rem] text-ivory/40">{hint}</p>}
      {error && <p className="mt-2 text-[0.6875rem] text-red-400">{error}</p>}
    </div>
  );
}

/** Small toolbar button that uploads a file and appends it to a list. */
export function UploadAppendButton({
  onUrl,
  children,
}: {
  onUrl: (url: string) => void;
  children?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
      onUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 border border-gold/50 px-3 py-2 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-midnight disabled:opacity-50"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ImagePlus className="h-3.5 w-3.5" />
        )}
        {children ?? "Upload image"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error && <span className="text-[0.625rem] text-red-400">{error}</span>}
    </>
  );
}