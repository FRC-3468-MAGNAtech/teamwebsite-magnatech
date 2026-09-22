import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getStemDaysSignups } from "@/lib/stem-days-signups";
import StemDaysSignupsEditor from "./stem-days-signups-editor";

export default async function StemDaysSignupsAdminPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <StemDaysSignupsEditor initialSubmissions={await getStemDaysSignups()} />;
}
