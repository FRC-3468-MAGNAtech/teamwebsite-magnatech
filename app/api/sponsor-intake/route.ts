import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getSponsorSubmissions, saveSponsorSubmission } from "@/lib/sponsor-submissions";

const allowedLogoTypes = new Set(["image/svg+xml", "image/png", "application/pdf"]);
const maxLogoSizeBytes = 10 * 1024 * 1024;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(adminSessionCookie)?.value)) {
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
