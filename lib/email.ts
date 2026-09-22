import "server-only";
import { Resend } from "resend";
import { NewsletterSubscriber } from "@/lib/newsletter";

const batchSize = 100;
const outreachNotificationEmail = "frc3468.magnatech@gmail.com";

function getResendClient() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

function getFromAddress() {
  return process.env.NEWSLETTER_FROM_EMAIL || "MAGNAtech Robotics <onboarding@resend.dev>";
}

function emailShell(bodyHtml: string, footerHtml?: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <div style="border-bottom: 3px solid #b91c1c; padding-bottom: 16px; margin-bottom: 24px;">
        <p style="margin:0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #b91c1c;">MAGNAtech</p>
        <p style="margin:4px 0 0; font-size: 14px; color: #6b7280;">WM Rebel Robotics - FRC 3468</p>
      </div>
      ${bodyHtml}
      ${footerHtml ? `<p style="margin-top:32px; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb; padding-top:16px;">${footerHtml}</p>` : ""}
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendSingleEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const resend = getResendClient();
  if (!resend) {
    throw new Error("Email sending is not configured. Set RESEND_API_KEY in the environment.");
  }

  const { error } = await resend.emails.send({ from: getFromAddress(), to, subject, html });
  if (error) {
    throw new Error(error.message || "Unable to send email.");
  }
}

function buildNewsletterHtml(name: string, message: string, unsubscribeUrl: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const paragraphs = message
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;">${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");

  return emailShell(
    `<p style="margin:0 0 16px;">${greeting}</p>${paragraphs}`,
    `You're receiving this because you signed up for MAGNAtech updates. <a href="${unsubscribeUrl}" style="color:#b91c1c;">Unsubscribe</a>`,
  );
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

export type OutreachRequestDetails = {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  details: string;
};

export async function sendOutreachRequestEmails(request: OutreachRequestDetails) {
  const businessName = escapeHtml(request.businessName);
  const contactName = escapeHtml(request.contactName);
  const phone = escapeHtml(request.phone) || "Not provided";
  const details = escapeHtml(request.details) || "Not provided";

  const confirmationHtml = emailShell(`
    <p style="margin:0 0 16px;">Hi ${contactName || "there"},</p>
    <p style="margin:0 0 16px;">Thanks for requesting a MAGNAtech outreach visit for ${businessName || "your business"}. We received your request and will follow up soon to coordinate details.</p>
    <p style="margin:0 0 4px;"><strong>Business:</strong> ${businessName}</p>
    <p style="margin:0 0 4px;"><strong>Contact:</strong> ${contactName}</p>
    <p style="margin:0 0 4px;"><strong>Phone:</strong> ${phone}</p>
    <p style="margin:0 0 16px;"><strong>Details:</strong> ${details}</p>
  `);

  const notificationHtml = emailShell(`
    <p style="margin:0 0 16px;">New outreach request submitted:</p>
    <p style="margin:0 0 4px;"><strong>Business:</strong> ${businessName}</p>
    <p style="margin:0 0 4px;"><strong>Contact:</strong> ${contactName}</p>
    <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(request.email)}</p>
    <p style="margin:0 0 4px;"><strong>Phone:</strong> ${phone}</p>
    <p style="margin:0 0 16px;"><strong>Details:</strong> ${details}</p>
  `);

  await Promise.all([
    sendSingleEmail({ to: request.email, subject: "MAGNAtech Outreach Request Received", html: confirmationHtml }),
    sendSingleEmail({ to: outreachNotificationEmail, subject: `New Outreach Request: ${request.businessName}`, html: notificationHtml }),
  ]);
}

export type StemDaysSignupDetails = {
  parentName: string;
  parentEmail: string;
  childName: string;
  days: string[];
};

const stemDaysPaymentDeadline = "10/9";
const stemDaysContactEmail = "alisonlovelady@opsb.net";

export async function sendStemDaysSignupEmails(signup: StemDaysSignupDetails) {
  const parentName = escapeHtml(signup.parentName);
  const childName = escapeHtml(signup.childName);
  const daysList = signup.days.map((day) => escapeHtml(day)).join(", ") || "Not specified";

  const confirmationHtml = emailShell(`
    <p style="margin:0 0 16px;">Hi ${parentName || "there"},</p>
    <p style="margin:0 0 16px;">Thanks for signing up for MAGNAtech STEM Days! Here's a summary of your signup:</p>
    <p style="margin:0 0 4px;"><strong>Child's name:</strong> ${childName}</p>
    <p style="margin:0 0 16px;"><strong>Day(s) selected:</strong> ${daysList}</p>
    <p style="margin:0 0 16px;">Payment is due by <strong>${stemDaysPaymentDeadline}</strong>. Questions? Contact <a href="mailto:${stemDaysContactEmail}" style="color:#b91c1c;">${stemDaysContactEmail}</a>.</p>
  `);

  const notificationHtml = emailShell(`
    <p style="margin:0 0 16px;">New STEM Days signup:</p>
    <p style="margin:0 0 4px;"><strong>Parent/Guardian:</strong> ${parentName}</p>
    <p style="margin:0 0 4px;"><strong>Parent email:</strong> ${escapeHtml(signup.parentEmail)}</p>
    <p style="margin:0 0 4px;"><strong>Child's name:</strong> ${childName}</p>
    <p style="margin:0 0 16px;"><strong>Day(s) selected:</strong> ${daysList}</p>
  `);

  await Promise.all([
    sendSingleEmail({ to: signup.parentEmail, subject: "MAGNAtech STEM Days Signup Confirmation", html: confirmationHtml }),
    sendSingleEmail({ to: outreachNotificationEmail, subject: `New STEM Days Signup: ${signup.childName}`, html: notificationHtml }),
  ]);
}
