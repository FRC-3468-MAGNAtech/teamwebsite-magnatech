import { NextResponse } from "next/server";
import { sendOutreachRequestEmails } from "@/lib/email";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const businessName = getText(formData, "businessName");
  const contactName = getText(formData, "contactName");
  const email = getText(formData, "email");
  const phone = getText(formData, "phone");
  const details = getText(formData, "details");

  if (!businessName || !contactName || !email) {
    return NextResponse.json({ error: "Please complete the business name, contact name, and email." }, { status: 400 });
  }

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await sendOutreachRequestEmails({ businessName, contactName, email, phone, details });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to send your request right now." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks! Your outreach request was received. MAGNAtech will follow up soon.",
  });
}
