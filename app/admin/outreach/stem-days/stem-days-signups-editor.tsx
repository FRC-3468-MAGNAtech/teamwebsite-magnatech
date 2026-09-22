"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

type StemDaysStatus = "new" | "contacted" | "closed";

type StemDaysSignupSubmission = {
  id: string;
  submittedAt: string;
  status: StemDaysStatus;
  paid: boolean;
  parentName: string;
  parentEmail: string;
  phone: string;
  childName: string;
  grade: string;
  days: string[];
  notes: string;
};

const statusFilters: Array<StemDaysStatus | "all"> = ["all", "new", "contacted", "closed"];

const statusLabels: Record<StemDaysStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const statusStyles: Record<StemDaysStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-900",
  contacted: "border-[#c59a3d]/40 bg-[#fff8e7] text-[#8a641d]",
  closed: "border-green-200 bg-green-50 text-green-900",
};

export default function StemDaysSignupsEditor({ initialSubmissions }: { initialSubmissions: StemDaysSignupSubmission[] }) {
  const [submissions, setSubmissions] = useState<StemDaysSignupSubmission[]>(initialSubmissions);
  const [filter, setFilter] = useState<StemDaysStatus | "all">("all");
  const [message, setMessage] = useState("");

  async function loadSubmissions() {
    const response = await fetch("/api/outreach/stem-days");
    const payload = (await response.json()) as { submissions: StemDaysSignupSubmission[] };
    setSubmissions(payload.submissions);
  }

  async function updateSubmission(id: string, updates: Partial<Pick<StemDaysSignupSubmission, "status" | "paid">>) {
    setMessage("");
    const response = await fetch("/api/outreach/stem-days", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...updates }) });
    if (!response.ok) {
      setMessage("Unable to update the submission.");
      return;
    }
    await loadSubmissions();
  }

  const visibleSubmissions = filter === "all" ? submissions : submissions.filter((submission) => submission.status === filter);

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to admin dashboard
          </Link>
          <p className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-red-700">STEM Days Signups</p>
          <h1 className="display-font text-4xl font-black">STEM Days signups</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Review STEM Days signups submitted by parents and guardians. Payment happens through Online School Payment — mark a signup Paid manually once confirmed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((status) => {
            const count = status === "all" ? submissions.length : submissions.filter((submission) => submission.status === status).length;
            const active = filter === status;
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={
                  active
                    ? "inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-black text-white"
                    : "inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50"
                }
              >
                {status === "all" ? "All" : statusLabels[status]} <span className={active ? "text-red-100" : "text-gray-500"}>{count}</span>
              </button>
            );
          })}
        </div>

        {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}

        {visibleSubmissions.length === 0 ? (
          <div className="mt-6 rounded border border-gray-200 bg-white p-8 text-center shadow-sm">
            <ClipboardList className="mx-auto text-red-700" size={36} />
            <h2 className="mt-4 text-2xl font-black">No signups{filter !== "all" ? ` marked ${statusLabels[filter]}` : ""}</h2>
            <p className="mt-2 text-sm text-gray-600">STEM Days signups submitted by parents will appear here.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleSubmissions.map((submission) => (
              <article key={submission.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{submission.childName}</h2>
                      <span className={`rounded border px-2 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[submission.status]}`}>
                        {statusLabels[submission.status]}
                      </span>
                      <span
                        className={`rounded border px-2 py-1 text-xs font-black uppercase tracking-wide ${
                          submission.paid ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900"
                        }`}
                      >
                        {submission.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-red-700">{submission.grade ? `Grade ${submission.grade}` : "Grade not specified"}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-sm font-semibold text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <select
                        value={submission.status}
                        onChange={(event) => updateSubmission(submission.id, { status: event.target.value as StemDaysStatus })}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold outline-red-300"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => updateSubmission(submission.id, { paid: !submission.paid })}
                        className={
                          submission.paid
                            ? "inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold hover:bg-gray-50"
                            : "inline-flex items-center gap-2 rounded bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"
                        }
                      >
                        Mark {submission.paid ? "unpaid" : "paid"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="font-black text-gray-900">Parent/Guardian</p>
                    <p className="mt-1 text-gray-600">{submission.parentName}</p>
                    <p className="text-gray-600">{submission.parentEmail}</p>
                    <p className="text-gray-600">{submission.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Day(s) selected</p>
                    <p className="mt-1 text-gray-600">{submission.days.join(", ") || "Not specified"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-black text-gray-900">Notes / allergies</p>
                    <p className="mt-1 text-gray-600">{submission.notes || "None provided"}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
