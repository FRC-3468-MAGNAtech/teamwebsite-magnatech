"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";

type OutreachRequestStatus = "new" | "contacted" | "closed";

type OutreachRequestSubmission = {
  id: string;
  submittedAt: string;
  status: OutreachRequestStatus;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  preferredDates: string;
  requestType: string;
  details: string;
};

const statusFilters: Array<OutreachRequestStatus | "all"> = ["all", "new", "contacted", "closed"];

const statusLabels: Record<OutreachRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const statusStyles: Record<OutreachRequestStatus, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-900",
  contacted: "border-[#c59a3d]/40 bg-[#fff8e7] text-[#8a641d]",
  closed: "border-green-200 bg-green-50 text-green-900",
};

export default function OutreachRequestsEditor({ initialSubmissions }: { initialSubmissions: OutreachRequestSubmission[] }) {
  const [submissions, setSubmissions] = useState<OutreachRequestSubmission[]>(initialSubmissions);
  const [filter, setFilter] = useState<OutreachRequestStatus | "all">("all");
  const [message, setMessage] = useState("");

  async function loadSubmissions() {
    const response = await fetch("/api/outreach/request");
    const payload = (await response.json()) as { submissions: OutreachRequestSubmission[] };
    setSubmissions(payload.submissions);
  }

  async function updateStatus(id: string, status: OutreachRequestStatus) {
    setMessage("");
    const response = await fetch("/api/outreach/request", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) {
      setMessage("Unable to update the submission status.");
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
          <p className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-red-700">Outreach Requests</p>
          <h1 className="display-font text-4xl font-black">Business outreach requests</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Review outreach requests submitted by local businesses through the public site.
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
            <h2 className="mt-4 text-2xl font-black">No requests{filter !== "all" ? ` marked ${statusLabels[filter]}` : ""}</h2>
            <p className="mt-2 text-sm text-gray-600">Outreach requests submitted by businesses will appear here.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleSubmissions.map((submission) => (
              <article key={submission.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{submission.businessName}</h2>
                      <span className={`rounded border px-2 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[submission.status]}`}>
                        {statusLabels[submission.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-red-700">{submission.requestType || "Request type not specified"}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-sm font-semibold text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</p>
                    <select
                      value={submission.status}
                      onChange={(event) => updateStatus(submission.id, event.target.value as OutreachRequestStatus)}
                      className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold outline-red-300"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="font-black text-gray-900">Contact</p>
                    <p className="mt-1 text-gray-600">{submission.contactName}</p>
                    <p className="text-gray-600">{submission.email}</p>
                    <p className="text-gray-600">{submission.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Preferred dates</p>
                    <p className="mt-1 text-gray-600">{submission.preferredDates || "Not specified"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-black text-gray-900">Details</p>
                    <p className="mt-1 text-gray-600">{submission.details || "No details provided"}</p>
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
