import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { deleteSponsorLogo, uploadSponsorLogo } from "@/lib/sponsor-logo-storage";
import {
  Sponsor,
  SponsorTier,
  deleteSponsor,
  getSponsorById,
  getSponsors,
  saveSponsor,
  sponsorTierNames,
  updateSponsor,
} from "@/lib/sponsors";

const allowedLogoTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const maxLogoSizeBytes = 2 * 1024 * 1024;
const sponsorTierSet = new Set<string>(sponsorTierNames);

function isAuthorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminSessionCookie)?.value);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function validateLogoFile(logo: File) {
  if (!allowedLogoTypes.has(logo.type)) {
    return "Logo must be a PNG, JPG, WebP, or SVG file.";
  }

  if (logo.size > maxLogoSizeBytes) {
    return "Logo file must be 2 MB or smaller.";
  }

  return null;
}

export async function GET() {
  const sponsors = await getSponsors();
  return NextResponse.json({ sponsors });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = getText(formData, "name");
  const tier = getText(formData, "tier");
  const logo = formData.get("logo");

  if (!name || !tier || !sponsorTierSet.has(tier)) {
    return NextResponse.json({ error: "Please provide a sponsor name and a valid tier." }, { status: 400 });
  }

  if (!(logo instanceof File) || logo.size === 0) {
    return NextResponse.json({ error: "A logo file is required." }, { status: 400 });
  }

  const logoError = validateLogoFile(logo);
  if (logoError) {
    return NextResponse.json({ error: logoError }, { status: 400 });
  }

  let logoUrl: string;
  try {
    logoUrl = await uploadSponsorLogo(logo);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload the logo." }, { status: 500 });
  }

  const sponsor: Sponsor = {
    id: randomUUID(),
    name,
    tier: tier as SponsorTier,
    logoUrl,
    createdAt: new Date().toISOString(),
  };

  await saveSponsor(sponsor);
  return NextResponse.json({ sponsor }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const id = getText(formData, "id");
  const name = getText(formData, "name");
  const tier = getText(formData, "tier");
  const logo = formData.get("logo");

  if (!id || !name || !tier || !sponsorTierSet.has(tier)) {
    return NextResponse.json({ error: "Please provide a sponsor name and a valid tier." }, { status: 400 });
  }

  const existing = await getSponsorById(id);
  if (!existing) {
    return NextResponse.json({ error: "Sponsor not found." }, { status: 404 });
  }

  const updates: Partial<Pick<Sponsor, "name" | "tier" | "logoUrl">> = { name, tier: tier as SponsorTier };

  if (logo instanceof File && logo.size > 0) {
    const logoError = validateLogoFile(logo);
    if (logoError) {
      return NextResponse.json({ error: logoError }, { status: 400 });
    }

    try {
      updates.logoUrl = await uploadSponsorLogo(logo);
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload the logo." }, { status: 500 });
    }
  }

  await updateSponsor(id, updates);

  if (updates.logoUrl) {
    await deleteSponsorLogo(existing.logoUrl).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Sponsor ID is required." }, { status: 400 });
  }

  const existing = await getSponsorById(id);
  await deleteSponsor(id);

  if (existing) {
    await deleteSponsorLogo(existing.logoUrl).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
