import "server-only";
import { put } from "@vercel/blob";

export type UploadedLogo = {
  name: string;
  type: string;
  size: number;
  url: string;
};

export function isBlobStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function uploadSponsorLogo(file: File): Promise<UploadedLogo | null> {
  if (!isBlobStorageConfigured()) {
    return null;
  }

  const blob = await put(`sponsor-logos/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return { name: file.name, type: file.type, size: file.size, url: blob.url };
}
