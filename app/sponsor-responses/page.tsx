import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getSponsorSubmissions } from "@/lib/sponsor-submissions";
import SponsorResponsesEditor from "./sponsor-responses-editor";

export default async function SponsorResponsesPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <SponsorResponsesEditor initialSubmissions={await getSponsorSubmissions()} />;
}
