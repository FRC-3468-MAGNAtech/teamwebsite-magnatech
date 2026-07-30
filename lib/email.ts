import "server-only";
import { Resend } from "resend";
import { NewsletterSubscriber } from "@/lib/newsletter";

const batchSize = 100;

function getResendClient() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

function getFromAddress() {
  return process.env.NEWSLETTER_FROM_EMAIL || "MAGNAtech Robotics <onboarding@resend.dev>";
}

function buildNewsletterHtml(name: string, message: string, unsubscribeUrl: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;">${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <div style="border-bottom: 3px solid #b91c1c; padding-bottom: 16px; margin-bottom: 24px;">
        <p style="margin:0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #b91c1c;">MAGNAtech</p>
        <p style="margin:4px 0 0; font-size: 14px; color: #6b7280;">WM Rebel Robotics - FRC 3468</p>
      </div>
      <p style="margin:0 0 16px;">${greeting}</p>
      ${paragraphs}
      <p style="margin-top:32px; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb; padding-top:16px;">
        You're receiving this because you signed up for MAGNAtech updates.
        <a href="${unsubscribeUrl}" style="color:#b91c1c;">Unsubscribe</a>
      </p>
    </div>
  `;
}

export type NewsletterSendResult = {
  sent: number;
  failed: number;
};

export async function sendNewsletterToSubscribers(
  subscribers: NewsletterSubscriber[],
  { subject, message, siteUrl }: { subject: string; message: string; siteUrl: string }
): Promise<NewsletterSendResult> {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("Email sending is not configured. Set RESEND_API_KEY in the environment.");
  }

  const from = getFromAddress();
  let sent = 0;
  let failed = 0;

  for (let index = 0; index < subscribers.length; index += batchSize) {
    const chunk = subscribers.slice(index, index + batchSize);
    const payload = chunk.map((subscriber) => ({
      from,
      to: subscriber.email,
      subject,
      html: buildNewsletterHtml(subscriber.name, message, `${siteUrl}/unsubscribe?token=${subscriber.unsubscribeToken}`),
    }));

    const { data, error } = await resend.batch.send(payload);
    if (error) {
      failed += chunk.length;
      continue;
    }

    sent += data?.data?.length ?? chunk.length;
    failed += chunk.length - (data?.data?.length ?? chunk.length);
  }

  return { sent, failed };
}
