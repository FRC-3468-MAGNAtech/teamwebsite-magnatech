import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { sendStemDaysSignupEmails } from "@/lib/email";
import {
  StemDaysStatus,
  getStemDaysSignups,
  saveStemDaysSignup,
  updateStemDaysSignup,
} from "@/lib/stem-days-signups";

const stemDaysStatuses = new Set<StemDaysStatus>(["new", "contacted", "closed"]);

function isAuthorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminSessionCookie)?.value);
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await getStemDaysSignups();
  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const parentName = getText(formData, "parentName");
  const parentEmail = getText(formData, "parentEmail");
  const phone = getText(formData, "phone");
  const childName = getText(formData, "childName");
  const grade = getText(formData, "grade");
  const notes = getText(formData, "notes");
  const days = formData.getAll("days").filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  if (!parentName || !parentEmail || !childName || days.length === 0) {
    return NextResponse.json({ error: "Please complete your name, email, child's name, and select at least one day." }, { status: 400 });
  }

  if (!parentEmail.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const submission = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "new" as StemDaysStatus,
    paid: false,
    parentName,
    parentEmail,
    phone,
    childName,
    grade,
    days,
    notes,
  };

  let savedToFirestore = true;
  try {
    await saveStemDaysSignup(submission);
  } catch (error) {
    savedToFirestore = false;
    console.error("Failed to save STEM Days signup submission", error);
  }

  let emailSent = true;
  try {
    await sendStemDaysSignupEmails(submission);
  } catch (error) {
    emailSent = false;
    console.error("Failed to send STEM Days signup emails", error);
  }

  if (!savedToFirestore && !emailSent) {
    return NextResponse.json({ error: "Unable to process your signup right now. Please try again or email us directly." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks! Your STEM Days signup was received. Check your email for a confirmation.",
  });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, paid } = (await request.json()) as { id?: string; status?: StemDaysStatus; paid?: boolean };
  if (!id || (status === undefined && paid === undefined)) {
    return NextResponse.json({ error: "A submission ID and status or paid value are required." }, { status: 400 });
  }

  if (status !== undefined && !stemDaysStatuses.has(status)) {
    return NextResponse.json({ error: "A valid status is required." }, { status: 400 });
  }

  const updates: { status?: StemDaysStatus; paid?: boolean } = {};
  if (status !== undefined) updates.status = status;
  if (paid !== undefined) updates.paid = Boolean(paid);

  await updateStemDaysSignup(id, updates);
  return NextResponse.json({ ok: true });
}
