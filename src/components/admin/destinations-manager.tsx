"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { AdminCard, EmptyState } from "@/components/admin/ui";
import { img } from "@/lib/utils";

export type DestinationRow = {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  imageAlt: string;
  latitude: number;
  longitude: number;
  bestExperiences: string[];
  trips: string[];
};

type JourneyOption = { slug: string; title: string };

const inputClass =
  "w-full border border-ivory/15 bg-royal-deep/60 px-3.5 py-2.5 text-sm text-ivory placeholder:text-ivory/30 transition-colors focus:border-gold focus:outline-none";

const labelClass =
  "mb-1.5 block text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/70";

type FormState = {
  slug: string;
  name: string;
  region: string;
  description: string;
  image: string;
  imageAlt: string;
  latitude: string;
  longitude: string;
  bestExperiences: string;
  trips: string[];
};

const emptyForm = (): FormState => ({
  slug: "",
  name: "",
  region: "",
  description: "",
  image: "",
  imageAlt: "",
  latitude: "",
  longitude: "",
  bestExperiences: "",
  trips: [],
});

const toForm = (d: DestinationRow): FormState => ({
  slug: d.slug,
  name: d.name,
  region: d.region,
  description: d.description,
  image: d.image,
  imageAlt: d.imageAlt,
  latitude: String(d.latitude),
  longitude: String(d.longitude),
  bestExperiences: d.bestExperiences.join("\n"),
  trips: d.trips,
});

export function DestinationsManager({
  destinations,
  journeys,
}: {
  destinations: DestinationRow[];
  journeys: JourneyOption[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<DestinationRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm(emptyForm());
    setError(null);
  };

  const openEdit = (d: DestinationRow) => {
    setCreating(false);
    setEditing(d);
    setForm(toForm(d));
    setError(null);
  };

  const close = () => {
    setEditing(null);
    setCreating(false);
    setError(null);
  };

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/admin/destinations/${editing.id}` : "/api/admin/destinations";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          bestExperiences: form.bestExperiences,
          trips: form.trips.join("\n"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      close();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(d: DestinationRow) {
    if (!confirm(`Delete "${d.name}" permanently?`)) return;
    const res = await fetch(`/api/admin/destinations/${d.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Delete failed");
      return;
    }
    if (editing?.id === d.id) close();
    router.refresh();
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }, [destinations, search]);

  const toggleTrip = (slug: string) => {
    setForm((f) => ({
      ...f,
      trips: f.trips.includes(slug)
        ? f.trips.filter((t) => t !== slug)
        : [...f.trips, slug],
    }));
  };

  return (
    <div className="space-y-8">
      {error && (
        <p className="border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* List */}
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 sm:max-w-sm">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations…"
                className={inputClass}
              />
            </div>
            <span className="shrink-0 text-xs text-ivory/45">
              {filtered.length} of {destinations.length}
            </span>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 bg-gold px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft"
          >
            <Plus className="h-4 w-4" /> New destination
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No destinations found"
            copy="Create your first destination, or adjust your search."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((d) => (
              <AdminCard key={d.id} className="group overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-royal-deep">
                  {d.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img(d.image, 700, 70)}
                      alt={d.imageAlt || d.name}
                      className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <MapPin className="h-8 w-8 text-gold/40" strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-[0.5625rem] font-medium uppercase tracking-[0.25em] text-gold/80">
                      {d.region}
                    </p>
                    <h3 className="font-serif text-2xl font-medium text-ivory">
                      {d.name}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-2 text-xs leading-relaxed text-ivory/55">
                    {d.description}
                  </p>
                  <p className="mt-2 text-[0.625rem] text-ivory/35">
                    {d.latitude.toFixed(2)}°, {d.longitude.toFixed(2)}° ·{" "}
                    {d.bestExperiences.length} experiences
                    {d.trips.length > 0 ? ` · ${d.trips.length} journeys` : ""}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(d)}
                      className="inline-flex items-center gap-2 border border-gold/50 px-4 py-2 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-midnight"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(d)}
                      aria-label={`Delete ${d.name}`}
                      className="inline-flex items-center border border-red-400/40 px-3 text-red-300 transition-colors hover:bg-red-400/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-midnight/80 p-4 backdrop-blur-sm sm:p-8">
          <AdminCard className="relative w-full max-w-2xl border border-gold/25">
            <div className="flex items-center justify-between border-b border-ivory/10 px-6 py-4">
              <h2 className="font-serif text-2xl font-medium text-ivory">
                {editing ? `Edit — ${editing.name}` : "New destination"}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close editor"
                className="flex h-9 w-9 items-center justify-center border border-ivory/20 text-ivory/60 transition-colors hover:border-gold hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="d-name">
                  Name *
                </label>
                <input
                  id="d-name"
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Lake Nakuru National Park"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="d-region">
                  Region *
                </label>
                <input
                  id="d-region"
                  className={inputClass}
                  value={form.region}
                  onChange={(e) => set("region", e.target.value)}
                  placeholder="e.g. The Rift Valley"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="d-slug">
                  Slug
                </label>
                <input
                  id="d-slug"
                  className={inputClass}
                  value={form.slug}
                  disabled={Boolean(editing)}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto-generated from name"
                />
                {editing && (
                  <p className="mt-1.5 text-[0.625rem] text-ivory/40">
                    Slugs can&rsquo;t be changed after creation.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="d-description">
                  Description *
                </label>
                <textarea
                  id="d-description"
                  className={`${inputClass} resize-y`}
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What makes this place unmissable?"
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="d-image">
                  Image (Unsplash photo ID)
                </label>
                <input
                  id="d-image"
                  className={inputClass}
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="e.g. 1547471080-7cc2caa01a7e"
                />
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img(form.image, 400, 60)}
                    alt=""
                    className="mt-3 aspect-video w-full object-cover"
                  />
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="d-imagealt">
                  Image alt text
                </label>
                <input
                  id="d-imagealt"
                  className={inputClass}
                  value={form.imageAlt}
                  onChange={(e) => set("imageAlt", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="d-lat">
                  Latitude
                </label>
                <input
                  id="d-lat"
                  className={inputClass}
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => set("latitude", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="d-lon">
                  Longitude
                </label>
                <input
                  id="d-lon"
                  className={inputClass}
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => set("longitude", e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="d-exp">
                  Best experiences (one per line)
                </label>
                <textarea
                  id="d-exp"
                  className={`${inputClass} resize-y`}
                  rows={3}
                  value={form.bestExperiences}
                  onChange={(e) => set("bestExperiences", e.target.value)}
                  placeholder={"Elephant herds at dawn\nKilimanjaro viewpoints\n…"}
                />
              </div>

              <div className="sm:col-span-2">
                <p className={labelClass}>Recommended journeys</p>
                {journeys.length === 0 ? (
                  <p className="text-xs text-ivory/40">
                    No journeys exist yet — you can leave this empty.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {journeys.map((j) => {
                      const active = form.trips.includes(j.slug);
                      return (
                        <button
                          key={j.slug}
                          type="button"
                          onClick={() => toggleTrip(j.slug)}
                          className={`border px-3 py-1.5 text-xs transition-colors ${
                            active
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-ivory/15 text-ivory/50 hover:text-champagne"
                          }`}
                        >
                          {j.title}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ivory/10 px-6 py-4">
              <button
                type="button"
                onClick={close}
                className="border border-ivory/20 px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-ivory/60 transition-colors hover:text-champagne"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold px-6 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-midnight transition-colors hover:bg-gold-soft disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {editing ? "Save changes" : "Create destination"}
              </button>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
