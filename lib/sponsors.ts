import "server-only";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseFirestore } from "@/lib/firebase-admin";

export const sponsorTierNames = [
  "Torch Supporter",
  "Delphi Partner",
  "Corinthian Partner",
  "Athenian Partner",
  "Spartan Partner",
  "Titan Partner",
  "Olympian Partner",
] as const;

export type SponsorTier = (typeof sponsorTierNames)[number];

export type Sponsor = {
  id: string;
  name: string;
  tier: SponsorTier;
  logoUrl?: string;
  createdAt: string;
};

const sponsorsFilePath = path.join(process.cwd(), "data", "sponsors.json");
const sponsorsCollection = "sponsors";

async function getLocalSponsors() {
  try {
    return JSON.parse(await readFile(sponsorsFilePath, "utf8")) as Sponsor[];
  } catch {
    return [];
  }
}

async function writeLocalSponsors(sponsors: Sponsor[]) {
  await mkdir(path.dirname(sponsorsFilePath), { recursive: true });
  await writeFile(sponsorsFilePath, JSON.stringify(sponsors, null, 2));
}

export async function getSponsors() {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const snapshot = await firestore.collection(sponsorsCollection).get();
    return snapshot.docs
      .map((document) => document.data() as Sponsor)
      .sort((first, second) => first.createdAt.localeCompare(second.createdAt));
  }

  const sponsors = await getLocalSponsors();
  return [...sponsors].sort((first, second) => first.createdAt.localeCompare(second.createdAt));
}

export async function getSponsorById(id: string) {
  const sponsors = await getSponsors();
  return sponsors.find((sponsor) => sponsor.id === id) || null;
}

export async function saveSponsor(sponsor: Sponsor) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(sponsorsCollection).doc(sponsor.id).set(sponsor);
    return;
  }

  const sponsors = await getLocalSponsors();
  sponsors.push(sponsor);
  await writeLocalSponsors(sponsors);
}

// `logoUrl: null` removes the logo; omitting `logoUrl` leaves it unchanged.
export type SponsorUpdates = Partial<Pick<Sponsor, "name" | "tier">> & { logoUrl?: string | null };

export async function updateSponsor(id: string, updates: SponsorUpdates) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    const { logoUrl, ...rest } = updates;
    await firestore
      .collection(sponsorsCollection)
      .doc(id)
      .update({ ...rest, ...(logoUrl === null ? { logoUrl: FieldValue.delete() } : logoUrl !== undefined ? { logoUrl } : {}) });
    return;
  }

  const sponsors = await getLocalSponsors();
  const index = sponsors.findIndex((sponsor) => sponsor.id === id);
  if (index === -1) {
    return;
  }

  const { logoUrl, ...rest } = updates;
  const updated: Sponsor = { ...sponsors[index], ...rest };
  if (logoUrl === null) {
    delete updated.logoUrl;
  } else if (logoUrl !== undefined) {
    updated.logoUrl = logoUrl;
  }
  sponsors[index] = updated;
  await writeLocalSponsors(sponsors);
}

export async function deleteSponsor(id: string) {
  const firestore = getFirebaseFirestore();
  if (firestore) {
    await firestore.collection(sponsorsCollection).doc(id).delete();
    return;
  }

  const sponsors = await getLocalSponsors();
  await writeLocalSponsors(sponsors.filter((sponsor) => sponsor.id !== id));
}
