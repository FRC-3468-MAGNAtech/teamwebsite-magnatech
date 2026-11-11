"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Pencil, Save, Trash2 } from "lucide-react";

const sponsorTierNames = [
  "Torch Supporter",
  "Delphi Partner",
  "Corinthian Partner",
  "Athenian Partner",
  "Spartan Partner",
  "Titan Partner",
  "Olympian Partner",
] as const;

type SponsorTier = (typeof sponsorTierNames)[number];

type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl: string;
  createdAt: string;
};

type Draft = {
  name: string;
  tier: SponsorTier;
};

const emptyDraft: Draft = { name: "", tier: sponsorTierNames[0] };

export default function SponsorsEditor({ initialSponsors }: { initialSponsors: Sponsor[] }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const logoPreviewUrl = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  async function loadSponsors() {
    const response = await fetch("/api/sponsors");
    const payload = (await response.json()) as { sponsors: Sponsor[] };
    setSponsors(payload.sponsors);
  }

  function resetForm() {
    setDraft(emptyDraft);
    setLogoFile(null);
    setEditingId(null);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    const formData = new FormData();
    formData.set("name", draft.name);
    formData.set("tier", draft.tier);
    if (logoFile) {
      formData.set("logo", logoFile);
    }
    if (editingId) {
      formData.set("id", editingId);
    }

    try {
      const response = await fetch("/api/sponsors", { method: editingId ? "PATCH" : "POST", body: formData });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setMessage(payload?.error || "Unable to save the sponsor.");
        return;
      }

      resetForm();
      setMessage("Sponsor saved.");
      await loadSponsors();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteSponsor(id: string, name: string) {
    if (!window.confirm(`Delete sponsor "${name}"? This also removes its logo file.`)) return;
    setMessage("");
    const response = await fetch("/api/sponsors", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      setMessage("Unable to delete the sponsor.");
      return;
    }
    if (editingId === id) {
      resetForm();
    }
    setMessage("Sponsor deleted.");
    await loadSponsors();
  }

  function startEdit(sponsor: Sponsor) {
    setEditingId(sponsor.id);
    setDraft({ name: sponsor.name, tier: sponsor.tier });
    setLogoFile(null);
    setMessage("");
  }

  const sponsorsByTier = useMemo(
    () =>
      sponsorTierNames.map((tier) => ({
        tier,
        sponsors: sponsors.filter((sponsor) => sponsor.tier === tier),
      })),
    [sponsors],
  );

  const editingSponsor = editingId ? sponsors.find((sponsor) => sponsor.id === editingId) : null;
  const activePreviewUrl = logoPreviewUrl || editingSponsor?.logoUrl || null;

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to admin dashboard
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p>
          <h1 className="display-font mt-1 text-3xl font-black">Sponsors</h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <form onSubmit={handleSave} className="h-fit rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 className="text-red-700" size={26} />
            <h2 className="text-2xl font-black">{editingId ? "Edit sponsor" : "Add sponsor"}</h2>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              Sponsor name
              <input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                required
                className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300"
              />
            </label>
            <label className="block text-sm font-bold">
              Tier
              <select
                value={draft.tier}
                onChange={(event) => setDraft({ ...draft, tier: event.target.value as SponsorTier })}
                className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 font-normal outline-red-300"
              >
                {sponsorTierNames.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold">
              Logo {editingId ? "(leave blank to keep the current logo)" : ""}
              <input
                required={!editingId}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
                className="mt-2 w-full text-sm font-normal"
              />
            </label>
            {activePreviewUrl && (
              <div className="rounded border border-gray-200 bg-gray-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Preview</p>
                <Image src={activePreviewUrl} alt="Logo preview" width={240} height={120} unoptimized className="h-20 w-auto object-contain" />
              </div>
            )}
          </div>
          {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Save size={16} /> {submitting ? "Saving..." : "Save sponsor"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded border border-gray-300 px-4 py-3 text-sm font-bold hover:bg-gray-50">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-6">
          {sponsorsByTier.map(({ tier, sponsors: tierSponsors }) => (
            <div key={tier}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">{tier}</h2>
                <span className="text-sm font-semibold text-gray-500">{tierSponsors.length}</span>
              </div>
              {tierSponsors.length === 0 ? (
                <p className="mt-2 rounded border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">No sponsors in this tier yet.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {tierSponsors.map((sponsor) => (
                    <div key={sponsor.id} className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4 shadow-sm">
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-12 w-12 shrink-0 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-gray-950">{sponsor.name}</p>
                        <p className="text-sm text-gray-600">{sponsor.tier}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => startEdit(sponsor)}
                          className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"
                        >
                          <Pencil size={15} /> Edit
                        </button>
                        <button
                          onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                          className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
