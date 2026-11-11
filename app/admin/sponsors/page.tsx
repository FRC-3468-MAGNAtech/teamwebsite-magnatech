import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getSponsors } from "@/lib/sponsors";
import SponsorsEditor from "./sponsors-editor";

export default async function SponsorsAdminPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <SponsorsEditor initialSponsors={await getSponsors()} />;
}
