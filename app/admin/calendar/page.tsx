import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { getCalendarEvents } from "@/lib/calendar";
import CalendarEditor from "./calendar-editor";

export default async function CalendarAdminPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(adminSessionCookie)?.value)) {
    redirect("/admin");
  }

  return <CalendarEditor initialEvents={await getCalendarEvents()} />;
}
