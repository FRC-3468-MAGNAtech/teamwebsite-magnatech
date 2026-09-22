import { NextResponse } from "next/server";
import { sendStemDaysSignupEmails } from "@/lib/email";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const parentName = getText(formData, "parentName");
  const parentEmail = getText(formData, "parentEmail");
  const childName = getText(formData, "childName");
  const days = formData.getAll("days").filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  if (!parentName || !parentEmail || !childName || days.length === 0) {
    return NextResponse.json({ error: "Please complete your name, email, child's name, and select at least one day." }, { status: 400 });
  }

  if (!parentEmail.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await sendStemDaysSignupEmails({ parentName, parentEmail, childName, days });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to send your signup right now." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks! Your STEM Days signup was received. Check your email for a confirmation.",
  });
}
