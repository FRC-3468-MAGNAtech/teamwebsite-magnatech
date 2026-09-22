import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getOutreachRequests } from "@/lib/outreach-requests";
import OutreachRequestsEditor from "./outreach-requests-editor";

export default async function OutreachRequestsAdminPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <OutreachRequestsEditor initialSubmissions={await getOutreachRequests()} />;
}
