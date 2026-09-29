"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function BusinessRequestForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/outreach/request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Unable to submit your outreach request.");
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit your outreach request.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Business Name *</span>
          <input required name="businessName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Contact Name *</span>
          <input required name="contactName" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Email Address *</span>
          <input required name="email" type="email" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Phone Number</span>
          <input name="phone" type="tel" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Preferred Dates</span>
          <input name="preferredDates" type="text" placeholder="e.g. Any weekday in October" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-gray-800">Request Type</span>
          <select name="requestType" defaultValue="robot-demo" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300">
            <option value="robot-demo">Robot demo</option>
            <option value="stem-activity">STEM activity</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-bold text-gray-800">Details</span>
        <textarea
          name="details"
          rows={4}
          placeholder="Tell us about your event, audience, and anything else that would help us prepare."
          className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300"
        />
      </label>

      <button
        type="submit"
        disabled={submitState === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-700 px-6 py-4 font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {submitState === "submitting" ? "Submitting..." : "Submit Outreach Request"}
        <Send size={18} />
      </button>

      {submitState === "success" && (
        <div className="rounded border border-green-200 bg-green-50 p-5 text-green-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0" size={22} />
            <div>
              <h3 className="font-black">Request received.</h3>
              <p className="mt-1 text-sm leading-6">A confirmation email is on its way. MAGNAtech will follow up soon.</p>
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
