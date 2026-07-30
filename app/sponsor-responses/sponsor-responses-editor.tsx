"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, ExternalLink, Trash2 } from "lucide-react";

type SponsorStatus = "New" | "Completed" | "Discussing" | "Rejected";

type SponsorSubmission = {
  id: string;
  submittedAt: string;
  status: SponsorStatus;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  mailingAddress: string;
  socialMedia: { instagram: string; facebook: string; linkedin: string };
  sponsorshipTier: string;
  contributionTypes: string[];
  contributionNotes: string;
  logoFile: { name: string; type: string; size: number } | null;
};

const statusFilters: Array<SponsorStatus | "All"> = ["All", "New", "Discussing", "Completed", "Rejected"];

const statusStyles: Record<SponsorStatus, string> = {
  New: "border-blue-200 bg-blue-50 text-blue-900",
  Discussing: "border-[#c59a3d]/40 bg-[#fff8e7] text-[#8a641d]",
  Completed: "border-green-200 bg-green-50 text-green-900",
  Rejected: "border-red-200 bg-red-50 text-red-900",
};

function withDefaultStatus(submissions: SponsorSubmission[]) {
  return submissions.map((submission) => ({ ...submission, status: submission.status || "New" }));
}

export default function SponsorResponsesEditor({ initialSubmissions }: { initialSubmissions: SponsorSubmission[] }) {
  const [submissions, setSubmissions] = useState<SponsorSubmission[]>(withDefaultStatus(initialSubmissions));
  const [filter, setFilter] = useState<SponsorStatus | "All">("All");
  const [message, setMessage] = useState("");

  async function loadSubmissions() {
    const response = await fetch("/api/sponsor-intake");
    const payload = (await response.json()) as { submissions: SponsorSubmission[] };
    setSubmissions(withDefaultStatus(payload.submissions));
  }

  async function updateStatus(id: string, status: SponsorStatus) {
    setMessage("");
    const response = await fetch("/api/sponsor-intake", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) {
      setMessage("Unable to update the submission status.");
      return;
    }
    await loadSubmissions();
  }

  async function deleteSubmission(id: string, companyName: string) {
    if (!window.confirm(`Delete the submission from ${companyName}?`)) return;
    setMessage("");
    const response = await fetch("/api/sponsor-intake", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      setMessage("Unable to delete the submission.");
      return;
    }
    setMessage("Submission deleted.");
    await loadSubmissions();
  }

  const visibleSubmissions = filter === "All" ? submissions : submissions.filter((submission) => submission.status === filter);

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to admin dashboard
          </Link>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-red-700">Sponsor Responses</p>
              <h1 className="display-font text-4xl font-black">Sponsorship form submissions</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                Review sponsorship intake submissions collected through the website.
              </p>
            </div>
            <a
              href="/api/sponsor-intake"
              className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-50"
            >
              View JSON <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((status) => {
            const count = status === "All" ? submissions.length : submissions.filter((submission) => submission.status === status).length;
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
                {status} <span className={active ? "text-red-100" : "text-gray-500"}>{count}</span>
              </button>
            );
          })}
        </div>

        {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}

        {visibleSubmissions.length === 0 ? (
          <div className="mt-6 rounded border border-gray-200 bg-white p-8 text-center shadow-sm">
            <ClipboardList className="mx-auto text-red-700" size={36} />
            <h2 className="mt-4 text-2xl font-black">No submissions{filter !== "All" ? ` marked ${filter}` : ""}</h2>
            <p className="mt-2 text-sm text-gray-600">Submitted sponsor forms will appear here as businesses complete the intake form.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleSubmissions.map((submission) => (
              <article key={submission.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{submission.companyName}</h2>
                      <span className={`rounded border px-2 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[submission.status]}`}>
                        {submission.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-red-700">{submission.sponsorshipTier}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <p className="text-sm font-semibold text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</p>
                    <div className="flex gap-2">
                      <select
                        value={submission.status}
                        onChange={(event) => updateStatus(submission.id, event.target.value as SponsorStatus)}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-bold outline-red-300"
                      >
                        <option value="New">New</option>
                        <option value="Discussing">Discussing</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => deleteSubmission(submission.id, submission.companyName)}
                        className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="font-black text-gray-900">Contact</p>
                    <p className="mt-1 text-gray-600">{submission.contactName}</p>
                    <p className="text-gray-600">{submission.email}</p>
                    <p className="text-gray-600">{submission.phone}</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Contribution</p>
                    <p className="mt-1 text-gray-600">{submission.contributionTypes.join(", ") || "Not specified"}</p>
                    <p className="text-gray-600">{submission.contributionNotes || "No notes provided"}</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Socials</p>
                    <p className="mt-1 text-gray-600">Instagram: {submission.socialMedia.instagram || "Not provided"}</p>
                    <p className="text-gray-600">Facebook: {submission.socialMedia.facebook || "Not provided"}</p>
                    <p className="text-gray-600">LinkedIn: {submission.socialMedia.linkedin || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Logo</p>
                    <p className="mt-1 text-gray-600">{submission.logoFile ? `${submission.logoFile.name} (${Math.round(submission.logoFile.size / 1024)} KB)` : "No file uploaded"}</p>
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
