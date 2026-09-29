"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const dayOptions = [
  { value: "oct-13", label: "Oct 13" },
  { value: "oct-15", label: "Oct 15" },
];

export default function StemDaysSignupForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.getAll("days").length === 0) {
      setSubmitState("error");
      setErrorMessage("Please select at least one day.");
      return;
    }

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/outreach/stem-days", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to submit your STEM Days signup.");
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit your STEM Days signup.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Child&apos;s Name *</span>
          <input required name="childName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Grade *</span>
          <input required name="grade" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Parent/Guardian Name *</span>
          <input required name="parentName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Parent/Guardian Email *</span>
          <input required name="parentEmail" type="email" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Phone Number</span>
          <input name="phone" type="tel" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
      </div>

      <div>
        <span className="text-sm font-bold text-gray-800">Day(s) *</span>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {dayOptions.map((day) => (
            <label key={day.value} className="flex items-center gap-3 rounded border border-gray-200 bg-gray-50 p-4 text-sm font-bold text-gray-800">
              <input type="checkbox" name="days" value={day.value} className="h-5 w-5 accent-red-700" />
              {day.label}
            </label>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-gray-800">Notes / Allergies</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Let us know about any allergies or other notes we should be aware of."
          className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300"
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-700 px-6 py-4 font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitState === "submitting" ? "Submitting..." : "Submit STEM Days Signup"}
        <Send size={18} />
      </button>

      {submitState === "success" && (
        <div className="rounded border border-green-200 bg-green-50 p-5 text-green-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0" size={22} />
            <div>
              <h3 className="font-black">Signup received.</h3>
              <p className="mt-1 text-sm leading-6">A confirmation email is on its way with your signup summary and payment details.</p>
            </div>
          </div>
        </div>
      )}

      {submitState === "error" && (
        <div className="rounded border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-900">{errorMessage}</div>
      )}
    </form>
  );
}
