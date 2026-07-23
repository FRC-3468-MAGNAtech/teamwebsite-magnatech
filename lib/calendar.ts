import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
};

const calendarFilePath = path.join(process.cwd(), "data", "calendar-events.json");

export const defaultCalendarEvents: CalendarEvent[] = [
  { id: "fall-info-meeting", title: "Fall Info Meeting", date: "September TBD", location: "West Monroe High School", type: "Team" },
  { id: "community-robot-demo", title: "Community Robot Demo", date: "Date TBD", location: "Local library or STEM night", type: "Outreach" },
  { id: "bayou-regional", title: "Bayou Regional", date: "Spring season", location: "Competition and sponsor VIP opportunity", type: "Competition" },
  { id: "summer-stem-camp", title: "Summer STEM Camp", date: "Summer", location: "West Monroe", type: "Camp" },
];

export async function getCalendarEvents() {
  try {
    return JSON.parse(await readFile(calendarFilePath, "utf8")) as CalendarEvent[];
  } catch {
    return defaultCalendarEvents;
  }
}

export async function saveCalendarEvents(events: CalendarEvent[]) {
  await mkdir(path.dirname(calendarFilePath), { recursive: true });
  await writeFile(calendarFilePath, JSON.stringify(events, null, 2));
}
