import "server-only";
import { del, put } from "@vercel/blob";

export function isSponsorLogoStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadSponsorLogo(file: File): Promise<string> {
  if (!isSponsorLogoStorageConfigured()) {
    throw new Error("Logo storage is not configured. Set BLOB_READ_WRITE_TOKEN in the environment.");
  }

  const blob = await put(`sponsor-logos/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return blob.url;
}

export async function deleteSponsorLogo(url: string) {
  if (!isSponsorLogoStorageConfigured()) {
    return;
  }

  await del(url);
}
