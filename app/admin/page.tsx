"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, FileText, LockKeyhole, LogOut, Pencil, Save, Trash2 } from "lucide-react";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
};

type DraftEvent = Omit<CalendarEvent, "id">;

const emptyDraft: DraftEvent = { title: "", date: "", location: "", type: "Team" };

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [draft, setDraft] = useState<DraftEvent>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadEvents() {
    const response = await fetch("/api/calendar");
    const payload = (await response.json()) as { events: CalendarEvent[] };
    setEvents(payload.events);
  }

  useEffect(() => {
    fetch("/api/admin/session")
      .then(async (response) => {
        const payload = (await response.json()) as { authenticated: boolean; configured: boolean };
        setAuthenticated(payload.authenticated);
        setConfigured(payload.configured);
        if (payload.authenticated) {
          await loadEvents();
        }
      })
      .catch(() => setMessage("Unable to check the admin session."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Unable to sign in.");
      return;
    }

    setPassword("");
    setAuthenticated(true);
    await loadEvents();
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/calendar", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { id: editingId, ...draft } : draft),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Unable to save the event.");
      return;
    }

    setDraft(emptyDraft);
    setEditingId(null);
    setMessage("Calendar saved.");
    await loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Delete this calendar event?")) {
      return;
    }

    const response = await fetch("/api/calendar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      setMessage("Unable to delete the event.");
      return;
    }

    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyDraft);
    }
    setMessage("Event deleted.");
    await loadEvents();
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setEvents([]);
    setMessage("");
  }

  if (loading) {
    return <main className="site-grid flex min-h-screen items-center justify-center text-sm font-bold text-gray-600">Loading admin panel...</main>;
  }

  if (!authenticated) {
    return (
      <main className="site-grid min-h-screen bg-gray-50 px-4 py-16 text-gray-950">
        <section className="mx-auto w-full max-w-md rounded border border-gray-200 bg-white p-7 shadow-sm">
          <LockKeyhole className="text-red-700" size={30} />
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p>
          <h1 className="display-font mt-2 text-3xl font-black">Control Room</h1>
          {!configured ? (
            <p className="mt-4 text-sm leading-6 text-gray-600">Set an `ADMIN_PASSWORD` in the host environment before this panel can be used.</p>
          ) : (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-gray-800">
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 outline-red-300" />
              </label>
              {message && <p className="text-sm font-semibold text-red-700">{message}</p>}
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-700 px-5 py-3 font-black text-white hover:bg-red-800">
                Sign in <LockKeyhole size={17} />
              </button>
            </form>
          )}
          <Link href="/" className="mt-6 inline-flex text-sm font-bold text-red-700 hover:text-red-800">Back to website</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-7 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p>
            <h1 className="display-font mt-1 text-3xl font-black">Calendar Control</h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50"><LogOut size={16} /> Sign out</button>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <form onSubmit={handleSave} className="h-fit rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><CalendarDays className="text-red-700" size={26} /><h2 className="text-2xl font-black">{editingId ? "Edit event" : "Add event"}</h2></div>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-bold">Event title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label>
            <label className="block text-sm font-bold">Date or date range<input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required placeholder="September 10, 2026" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label>
            <label className="block text-sm font-bold">Location<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label>
            <label className="block text-sm font-bold">Event type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 font-normal outline-red-300"><option>Team</option><option>Outreach</option><option>Competition</option><option>Camp</option><option>Fundraiser</option></select></label>
          </div>
          {message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}
          <div className="mt-6 flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"><Save size={16} /> Save event</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); }} className="rounded border border-gray-300 px-4 py-3 text-sm font-bold hover:bg-gray-50">Cancel</button>}</div>
        </form>

        <div className="space-y-3">
          <Link href="/sponsor-responses" className="flex items-center justify-between rounded border border-[#c59a3d]/40 bg-[#fff8e7] px-5 py-4 font-bold text-[#7c591b] hover:bg-[#fff2d4]">
            View sponsor responses <FileText size={18} />
          </Link>
          <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Published events</h2><span className="text-sm font-semibold text-gray-500">{events.length} total</span></div>
          {events.map((event) => (
            <article key={event.id} className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-bold uppercase tracking-wide text-red-700">{event.type}</p><h3 className="mt-1 text-lg font-black">{event.title}</h3><p className="mt-1 text-sm text-gray-600">{event.date} · {event.location}</p></div>
              <div className="flex gap-2"><button onClick={() => { setEditingId(event.id); setDraft({ title: event.title, date: event.date, location: event.location, type: event.type }); setMessage(""); }} className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"><Pencil size={15} /> Edit</button><button onClick={() => deleteEvent(event.id)} className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"><Trash2 size={15} /> Delete</button></div>
            </article>
          ))}
          {events.length === 0 && <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">No calendar events yet. Add the first one from the form.</div>}
        </div>
      </section>
    </main>
  );
}
