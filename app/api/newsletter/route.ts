import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const newsletterFilePath = path.join(process.cwd(), "data", "newsletter-signups.json");

async function readSignups() {
  try {
    return JSON.parse(await readFile(newsletterFilePath, "utf8")) as unknown[];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const signups = await readSignups();
  signups.unshift({ name, email, submittedAt: new Date().toISOString() });
  await mkdir(path.dirname(newsletterFilePath), { recursive: true });
  await writeFile(newsletterFilePath, JSON.stringify(signups, null, 2));

  return NextResponse.redirect(new URL("/?newsletter=success#newsletter", request.url), 303);
}
