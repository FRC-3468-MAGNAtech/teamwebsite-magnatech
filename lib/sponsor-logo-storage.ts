import "server-only";
import { del, put } from "@vercel/blob";

const storageNotConfiguredMessage = "Sponsor logo storage is not configured";

// Sponsor logos live in the PUBLIC Vercel Blob store. The token is always passed
// explicitly so the SDK never falls back to BLOB_READ_WRITE_TOKEN (old private store).
function getSponsorLogoToken() {
  const token = process.env.BLOB_PUBLIC_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(storageNotConfiguredMessage);
  }

  return token;
}

export async function uploadSponsorLogo(file: File): Promise<string> {
  const token = getSponsorLogoToken();

  const blob = await put(`sponsor-logos/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
    token,
  });

  return blob.url;
}

export async function deleteSponsorLogo(url: string) {
  const token = getSponsorLogoToken();

  await del(url, { token });
}
