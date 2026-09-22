import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { sendOutreachRequestEmails } from "@/lib/email";
import {
  OutreachRequestStatus,
  getOutreachRequests,
  saveOutreachRequest,
  updateOutreachRequestStatus,
} from "@/lib/outreach-requests";

const outreachRequestStatuses = new Set<OutreachRequestStatus>(["new", "contacted", "closed"]);

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

  const submissions = await getOutreachRequests();
  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const businessName = getText(formData, "businessName");
  const contactName = getText(formData, "contactName");
  const email = getText(formData, "email");
  const phone = getText(formData, "phone");
  const preferredDates = getText(formData, "preferredDates");
  const requestType = getText(formData, "requestType");
  const details = getText(formData, "details");

  if (!businessName || !contactName || !email) {
    return NextResponse.json({ error: "Please complete the business name, contact name, and email." }, { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const submission = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "new" as OutreachRequestStatus,
    businessName,
    contactName,
    email,
    phone,
    preferredDates,
    requestType,
    details,
  };

  let savedToFirestore = true;
  try {
    await saveOutreachRequest(submission);
  } catch (error) {
    savedToFirestore = false;
    console.error("Failed to save outreach request submission", error);
  }

  let emailSent = true;
  try {
    await sendOutreachRequestEmails(submission);
  } catch (error) {
    emailSent = false;
    console.error("Failed to send outreach request emails", error);
  }

  if (!savedToFirestore && !emailSent) {
    return NextResponse.json({ error: "Unable to process your request right now. Please try again or email us directly." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks! Your outreach request was received. MAGNAtech will follow up soon.",
  });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = (await request.json()) as { id?: string; status?: OutreachRequestStatus };
  if (!id || !status || !outreachRequestStatuses.has(status)) {
    return NextResponse.json({ error: "A submission ID and valid status are required." }, { status: 400 });
  }

  await updateOutreachRequestStatus(id, status);
  return NextResponse.json({ ok: true });
}
