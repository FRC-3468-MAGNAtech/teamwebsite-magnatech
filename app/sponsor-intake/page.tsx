"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  Amphora,
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  Crown,
  FileUp,
  Flame,
  HeartHandshake,
  Landmark,
  Mail,
  ScrollText,
  Send,
  Shield,
  Swords,
  Users,
} from "lucide-react";

const sponsorshipTiers = [
  { icon: Crown, name: "Olympian Partner", amount: "$15,000+" },
  { icon: Landmark, name: "Titan Partner", amount: "$10,000+" },
  { icon: Swords, name: "Spartan Partner", amount: "$5,000+" },
  { icon: Shield, name: "Athenian Partner", amount: "$2,500+" },
  { icon: Amphora, name: "Corinthian Partner", amount: "$1,000+" },
  { icon: ScrollText, name: "Delphi Partner", amount: "$500+" },
  { icon: Flame, name: "Torch Supporter", amount: "Up to $250" },
];

const contributionTypes = [
  "Monetary Donation",
  "In-Kind Donation",
  "Food/Meal Sponsorship",
  "Mentorship",
];

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function SponsorIntakePage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [selectedTier, setSelectedTier] = useState("Spartan Partner");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTierLabel = useMemo(() => {
    const tier = sponsorshipTiers.find((item) => item.name === selectedTier);
    return tier ? `${tier.name} - ${tier.amount}` : "";
  }, [selectedTier]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("sponsorshipTier", selectedTierLabel);

    try {
      const response = await fetch("/api/sponsor-intake", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to submit sponsorship form.");
      }

      form.reset();
      setSelectedTier("Spartan Partner");
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit sponsorship form.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#sponsors" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Sponsor tiers
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-red-700">Sponsorship Intake</p>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl">Sponsor MAGNAtech</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                This form helps WM Rebel Robotics, FRC Team 3468, collect sponsor details, contribution preferences, and logo files for shirts, banners, robot placement, and recognition.
              </p>
            </div>
            <div className="rounded border border-red-200 bg-red-50 p-5">
              <HeartHandshake className="text-red-700" size={30} />
              <h2 className="mt-3 text-xl font-black">Thank you for supporting local STEM.</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                After submission, our business team will follow up with payment details, tax-exempt information, and any logo or recognition questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.72fr_0.28fr] lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6 rounded border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Building2 className="text-red-700" size={24} />
              <h2 className="text-2xl font-black">Company and contact information</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Company Name *</span>
                <input required name="companyName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Primary Contact Name *</span>
                <input required name="contactName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Email Address *</span>
                <input required name="email" type="email" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Phone Number *</span>
                <input required name="phone" type="tel" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-gray-800">Business Mailing Address</span>
                <textarea name="mailingAddress" rows={3} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Instagram</span>
                <input name="instagram" type="text" placeholder="@business" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Facebook</span>
                <input name="facebook" type="text" placeholder="Page name or URL" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-gray-800">LinkedIn</span>
                <input name="linkedin" type="text" placeholder="Company page URL" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <BadgeDollarSign className="text-red-700" size={24} />
              <h2 className="text-2xl font-black">Sponsorship level</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {sponsorshipTiers.map((tier) => (
                <label
                  key={tier.name}
                  className={`cursor-pointer rounded border p-4 transition ${selectedTier === tier.name ? "border-red-600 bg-red-50 shadow-sm" : "border-gray-200 bg-white hover:border-red-300"}`}
                >
                  <input
                    required
                    type="radio"
                    name="sponsorshipTierChoice"
                    value={tier.name}
                    checked={selectedTier === tier.name}
                    onChange={() => setSelectedTier(tier.name)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-2 text-lg font-black">
                    <tier.icon className="text-red-700" size={20} />
                    {tier.name}
                  </span>
                  <span className="mt-1 block text-sm font-bold text-red-700">{tier.amount}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <Users className="text-red-700" size={24} />
              <h2 className="text-2xl font-black">Contribution type</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {contributionTypes.map((type) => (
                <label key={type} className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-gray-800">
                  <input type="checkbox" name="contributionTypes" value={type} className="h-5 w-5 accent-red-700" />
                  {type}
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-bold text-gray-800">Contribution Notes</span>
              <textarea
                name="contributionNotes"
                rows={3}
                placeholder="Tell us about in-kind items, meal dates, mentorship availability, or donation notes."
                className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300"
              />
            </label>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-3">
              <FileUp className="text-red-700" size={24} />
              <h2 className="text-2xl font-black">Logo upload</h2>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-red-300 bg-red-50 px-4 py-8 text-center transition hover:bg-red-100">
              <FileUp className="text-red-700" size={32} />
              <span className="mt-3 text-sm font-black text-gray-950">Upload a high-resolution logo</span>
              <span className="mt-1 text-xs font-semibold text-gray-600">SVG, PNG, or PDF preferred for robot, shirts, and banners</span>
              <input name="logoFile" type="file" accept=".svg,.png,.pdf,image/svg+xml,image/png,application/pdf" className="mt-4 max-w-full text-sm" />
            </label>
          </div>

          <label className="flex items-start gap-3 rounded border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
            <input required type="checkbox" name="permissionToContact" value="yes" className="mt-1 h-5 w-5 accent-red-700" />
            I confirm this information is accurate and give MAGNAtech permission to contact this business about sponsorship next steps.
          </label>

          <button
            type="submit"
            disabled={submitState === "submitting"}
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-700 px-6 py-4 font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {submitState === "submitting" ? "Submitting..." : "Submit Sponsorship Form"}
            <Send size={18} />
          </button>

          {submitState === "success" && (
            <div className="rounded border border-green-200 bg-green-50 p-5 text-green-900">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0" size={22} />
                <div>
                  <h3 className="font-black">Thank you for supporting MAGNAtech.</h3>
                  <p className="mt-1 text-sm leading-6">
                    Your sponsorship intake form has been received. Our business team will follow up soon with next steps, tax-exempt information, and contact details.
                  </p>
                </div>
              </div>
            </div>
          )}

          {submitState === "error" && (
            <div className="rounded border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-900">{errorMessage}</div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <Mail className="text-red-700" size={26} />
            <h2 className="mt-3 text-xl font-black">What happens next?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Submissions are prepared for spreadsheet or database storage, confirmation email automation, and business team follow-up.
            </p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">Secure handling</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Logo files are accepted only as SVG, PNG, or PDF and limited to 10 MB. Private integration keys belong on the server as environment variables.
            </p>
          </div>
          <a
            href="/sponsorship-letter-2027.pdf"
            className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-5 font-black text-red-800 hover:bg-red-100"
          >
            Download sponsor packet
            <ArrowLeft className="rotate-180" size={18} />
          </a>
        </aside>
      </section>
    </main>
  );
}
