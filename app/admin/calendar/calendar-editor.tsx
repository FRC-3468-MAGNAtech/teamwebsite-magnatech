"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Pencil, Save, Trash2 } from "lucide-react";

type CalendarEvent = { id: string; title: string; date: string; calendarDate?: string; location: string; type: string };
type DraftEvent = Omit<CalendarEvent, "id">;
const emptyDraft: DraftEvent = { title: "", date: "", calendarDate: "", location: "", type: "Team" };

export default function CalendarEditor({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [draft, setDraft] = useState<DraftEvent>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadEvents() {
    const response = await fetch("/api/calendar");
    const payload = (await response.json()) as { events: CalendarEvent[] };
    setEvents(payload.events);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/calendar", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { id: editingId, ...draft } : draft) });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) { setMessage(payload.error || "Unable to save the event."); return; }
    setDraft(emptyDraft); setEditingId(null); setMessage("Calendar saved."); await loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Delete this calendar event?")) return;
    const response = await fetch("/api/calendar", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) { setMessage("Unable to delete the event."); return; }
    if (editingId === id) { setEditingId(null); setDraft(emptyDraft); }
    setMessage("Event deleted."); await loadEvents();
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800"><ArrowLeft size={16} /> Back to admin dashboard</Link><p className="mt-6 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p><h1 className="display-font mt-1 text-3xl font-black">Calendar</h1></div></section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <form onSubmit={handleSave} className="h-fit rounded border border-gray-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><CalendarDays className="text-red-700" size={26} /><h2 className="text-2xl font-black">{editingId ? "Edit event" : "Add event"}</h2></div><div className="mt-6 space-y-4"><label className="block text-sm font-bold">Event title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Calendar date<input value={draft.calendarDate || ""} onChange={(event) => setDraft({ ...draft, calendarDate: event.target.value })} type="date" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Display date or range<input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required placeholder="September 10, 2026" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Location<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Event type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 font-normal outline-red-300"><option>Team</option><option>Outreach</option><option>Competition</option><option>Camp</option><option>Fundraiser</option></select></label></div>{message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}<div className="mt-6 flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"><Save size={16} /> Save event</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); }} className="rounded border border-gray-300 px-4 py-3 text-sm font-bold hover:bg-gray-50">Cancel</button>}</div></form>
        <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">Published events</h2><span className="text-sm font-semibold text-gray-500">{events.length} total</span></div>{events.map((event) => <article key={event.id} className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-red-700">{event.type}</p><h3 className="mt-1 text-lg font-black">{event.title}</h3><p className="mt-1 text-sm text-gray-600">{event.date} · {event.location}</p></div><div className="flex gap-2"><button onClick={() => { setEditingId(event.id); setDraft({ title: event.title, date: event.date, calendarDate: event.calendarDate || "", location: event.location, type: event.type }); setMessage(""); }} className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"><Pencil size={15} /> Edit</button><button onClick={() => deleteEvent(event.id)} className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"><Trash2 size={15} /> Delete</button></div></article>)}{events.length === 0 && <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">No calendar events yet. Add the first one from the form.</div>}</div>
      </section>
    </main>
  );
}
