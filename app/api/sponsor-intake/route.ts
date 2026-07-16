import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const allowedLogoTypes = new Set(["image/svg+xml", "image/png", "application/pdf"]);
const maxLogoSizeBytes = 10 * 1024 * 1024;
const submissionsFilePath = path.join(process.cwd(), "data", "sponsor-intake-submissions.json");

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function readSubmissions() {
  try {
    const file = await readFile(submissionsFilePath, "utf8");
    return JSON.parse(file) as unknown[];
  } catch {
    return [];
  }
}

async function saveSubmission(submission: unknown) {
  const submissions = await readSubmissions();
  submissions.unshift(submission);
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));
}

export async function GET() {
  const submissions = await readSubmissions();
  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const requiredFields = ["companyName", "contactName", "email", "phone", "sponsorshipTier", "permissionToContact"];
  for (const field of requiredFields) {
    if (!getText(formData, field)) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
  }

  const logoFile = formData.get("logoFile");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (!allowedLogoTypes.has(logoFile.type)) {
      return NextResponse.json({ error: "Logo must be an SVG, PNG, or PDF file." }, { status: 400 });
    }

    if (logoFile.size > maxLogoSizeBytes) {
      return NextResponse.json({ error: "Logo file must be 10 MB or smaller." }, { status: 400 });
    }
  }

  const submission = {
    submittedAt: new Date().toISOString(),
    companyName: getText(formData, "companyName"),
    contactName: getText(formData, "contactName"),
    email: getText(formData, "email"),
    phone: getText(formData, "phone"),
    mailingAddress: getText(formData, "mailingAddress"),
    socialMedia: {
      instagram: getText(formData, "instagram"),
      facebook: getText(formData, "facebook"),
      linkedin: getText(formData, "linkedin"),
    },
    sponsorshipTier: getText(formData, "sponsorshipTier"),
    contributionTypes: formData.getAll("contributionTypes").filter((value): value is string => typeof value === "string"),
    contributionNotes: getText(formData, "contributionNotes"),
    logoFile:
      logoFile instanceof File && logoFile.size > 0
        ? {
            name: logoFile.name,
            type: logoFile.type,
            size: logoFile.size,
          }
        : null,
  };

  console.info("Sponsor intake submission received", submission);
  await saveSubmission(submission);

  // Production integrations can be added here:
  // - Send a confirmation email with tax-exempt/non-profit ID and team contact info.
  // - Append submission details to Google Sheets, Airtable, Firebase, or another database.
  // Keep API keys and service credentials in server-only environment variables.

  return NextResponse.json({
    ok: true,
    message: "Thank you for supporting STEM education in West Monroe. MAGNAtech will follow up soon.",
  });
}
