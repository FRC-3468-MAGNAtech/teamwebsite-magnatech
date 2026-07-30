import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getNewsletterSubscribers } from "@/lib/newsletter";
import { sendNewsletterToSubscribers } from "@/lib/email";

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(adminSessionCookie)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subject, message } = (await request.json()) as { subject?: string; message?: string };
  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "A subject and message are required." }, { status: 400 });
  }

  const subscribers = (await getNewsletterSubscribers()).filter((subscriber) => subscriber.status === "subscribed");
  if (subscribers.length === 0) {
    return NextResponse.json({ error: "There are no subscribed contacts to send to." }, { status: 400 });
  }

  try {
    const result = await sendNewsletterToSubscribers(subscribers, {
      subject: subject.trim(),
      message: message.trim(),
      siteUrl: request.nextUrl.origin,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to send the newsletter." }, { status: 500 });
  }
}
