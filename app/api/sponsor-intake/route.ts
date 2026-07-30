import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import {
  SponsorStatus,
  deleteSponsorSubmission,
  getSponsorSubmissions,
  saveSponsorSubmission,
  updateSponsorSubmissionStatus,
} from "@/lib/sponsor-submissions";

const allowedLogoTypes = new Set(["image/svg+xml", "image/png", "application/pdf"]);
const maxLogoSizeBytes = 10 * 1024 * 1024;
const sponsorStatuses = new Set<SponsorStatus>(["Completed", "Discussing", "Rejected"]);

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isAuthorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminSessionCookie)?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await getSponsorSubmissions();
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
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "Discussing" as SponsorStatus,
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

  await saveSponsorSubmission(submission);

  return NextResponse.json({
    ok: true,
    message: "Thank you for supporting STEM education in West Monroe. MAGNAtech will follow up soon.",
  });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = (await request.json()) as { id?: string; status?: SponsorStatus };
  if (!id || !status || !sponsorStatuses.has(status)) {
    return NextResponse.json({ error: "A submission ID and valid status are required." }, { status: 400 });
  }

  await updateSponsorSubmissionStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Submission ID is required." }, { status: 400 });
  }

  await deleteSponsorSubmission(id);
  return NextResponse.json({ ok: true });
}
