import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminSessionCookie, isValidAdminSession } from "@/lib/admin-auth";
import { CalendarEvent, getCalendarEvents, saveCalendarEvents } from "@/lib/calendar";

function isAuthorized(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(adminSessionCookie)?.value);
}

function isCalendarEvent(value: unknown): value is Omit<CalendarEvent, "id"> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as Record<string, unknown>;
  return ["title", "date", "location", "type"].every((field) => typeof event[field] === "string" && event[field].trim());
}

export async function GET() {
  return NextResponse.json({ events: await getCalendarEvents() });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await request.json();
  if (!isCalendarEvent(event)) {
    return NextResponse.json({ error: "Enter a title, date, location, and event type." }, { status: 400 });
  }

  const events = await getCalendarEvents();
  const createdEvent = { id: randomUUID(), ...event };
  events.push(createdEvent);
  await saveCalendarEvents(events);
  return NextResponse.json({ event: createdEvent }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = (await request.json()) as CalendarEvent;
  if (!event.id || !isCalendarEvent(event)) {
    return NextResponse.json({ error: "Enter a title, date, location, and event type." }, { status: 400 });
  }

  const events = await getCalendarEvents();
  const eventIndex = events.findIndex((item) => item.id === event.id);
  if (eventIndex === -1) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  events[eventIndex] = event;
  await saveCalendarEvents(events);
  return NextResponse.json({ event });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
  }

  const events = await getCalendarEvents();
  await saveCalendarEvents(events.filter((event) => event.id !== id));
  return NextResponse.json({ ok: true });
}
