import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import {
  NewsletterStatus,
  deleteNewsletterSubscriber,
  getNewsletterSubscribers,
  subscribeToNewsletter,
  updateNewsletterSubscriberStatus,
} from "@/lib/newsletter";

const newsletterStatuses = new Set<NewsletterStatus>(["subscribed", "unsubscribed"]);

function isAuthorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminSessionCookie)?.value);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await getNewsletterSubscribers();
  return NextResponse.json({ subscribers });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const name = String(formData.get("name") || "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  await subscribeToNewsletter(name, email);

  return NextResponse.json({
    ok: true,
    message: "You're subscribed! Watch your inbox for MAGNAtech updates.",
  });
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = (await request.json()) as { id?: string; status?: NewsletterStatus };
  if (!id || !status || !newsletterStatuses.has(status)) {
    return NextResponse.json({ error: "A subscriber ID and valid status are required." }, { status: 400 });
  }

  await updateNewsletterSubscriberStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Subscriber ID is required." }, { status: 400 });
  }

  await deleteNewsletterSubscriber(id);
  return NextResponse.json({ ok: true });
}
