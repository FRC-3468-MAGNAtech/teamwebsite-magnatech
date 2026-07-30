import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getNewsletterSubscribers } from "@/lib/newsletter";
import NewsletterEditor from "./newsletter-editor";

export default async function NewsletterAdminPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <NewsletterEditor initialSubscribers={await getNewsletterSubscribers()} />;
}
