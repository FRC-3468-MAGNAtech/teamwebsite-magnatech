import Link from "next/link";
import Image from "next/image";
import { readFile } from "fs/promises";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, ClipboardList, ExternalLink } from "lucide-react";
import path from "path";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";

type SponsorSubmission = {
  submittedAt: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  mailingAddress: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  sponsorshipTier: string;
  contributionTypes: string[];
  contributionNotes: string;
  logoFile: {
    name: string;
    type: string;
    size: number;
  } | null;
};

async function getSubmissions() {
  try {
    const filePath = path.join(process.cwd(), "data", "sponsor-intake-submissions.json");
    const file = await readFile(filePath, "utf8");
    return JSON.parse(file) as SponsorSubmission[];
  } catch {
    return [];
  }
}

export default async function SponsorResponsesPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  const submissions = await getSubmissions();

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wide text-red-700">Sponsor Responses</p>
              <h1 className="display-font text-4xl font-black">Sponsorship form submissions</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                This local development page reads submissions saved by the intake form. A production version should require login and connect to Google Sheets, Airtable, Firebase, or another secure database.
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
        {submissions.length === 0 ? (
          <div className="rounded border border-gray-200 bg-white p-8 text-center shadow-sm">
            <ClipboardList className="mx-auto text-red-700" size={36} />
            <h2 className="mt-4 text-2xl font-black">No submissions yet</h2>
            <p className="mt-2 text-sm text-gray-600">Submitted sponsor forms will appear here while you are running the site locally.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <article key={`${submission.submittedAt}-${submission.email}`} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black">{submission.companyName}</h2>
                    <p className="mt-1 text-sm font-semibold text-red-700">{submission.sponsorshipTier}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</p>
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
