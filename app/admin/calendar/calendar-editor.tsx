"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Pencil, Save, Trash2 } from "lucide-react";

type CalendarEvent = { id: string; title: string; date: string; calendarDate?: string; location: string; type: string };
type DraftEvent = Omit<CalendarEvent, "id">;
const emptyDraft: DraftEvent = { title: "", date: "", calendarDate: "", location: "", type: "Team" };
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const displayDateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

function dateToInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function inputValueToDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDisplayDate(value: string) {
  const date = inputValueToDate(value);
  return date ? displayDateFormatter.format(date) : "";
}

function CalendarDatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedDate = inputValueToDate(value);
  const todayValue = dateToInputValue(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate || new Date());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: firstDay.getDay() }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1)),
    ];
  }, [visibleMonth]);

  function moveMonth(offset: number) {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1));
  }

  function selectDate(date: Date) {
    onChange(dateToInputValue(date));
  }

  return (
    <div className="mt-2 rounded border border-gray-300 bg-white p-3">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="rounded border border-gray-200 p-2 text-gray-700 hover:bg-gray-50">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-black text-gray-950">{monthFormatter.format(visibleMonth)}</p>
        <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="rounded border border-gray-200 p-2 text-gray-700 hover:bg-gray-50">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase tracking-wide text-gray-500">
        {dayLabels.map((day) => <span key={day}>{day}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const inputValue = date ? dateToInputValue(date) : "";
          const isSelected = inputValue === value;
          const isToday = inputValue === todayValue;
          return date ? (
            <button
              key={inputValue}
              type="button"
              onClick={() => selectDate(date)}
              className={`aspect-square rounded text-sm font-bold transition ${isSelected ? "bg-red-700 text-white" : isToday ? "border border-red-200 bg-red-50 text-red-800 hover:bg-red-100" : "text-gray-800 hover:bg-gray-100"}`}
            >
              {date.getDate()}
            </button>
          ) : (
            <span key={`blank-${index}`} className="aspect-square" aria-hidden="true" />
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <button type="button" onClick={() => { const today = new Date(); setVisibleMonth(today); selectDate(today); }} className="text-sm font-black text-red-700 hover:text-red-800">
          Today
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-sm font-bold text-gray-600 hover:text-gray-950">
            Clear date
          </button>
        )}
      </div>
    </div>
  );
}

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

  function updateCalendarDate(calendarDate: string) {
    setDraft({ ...draft, calendarDate, date: draft.date || formatDisplayDate(calendarDate) });
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800"><ArrowLeft size={16} /> Back to admin dashboard</Link><p className="mt-6 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p><h1 className="display-font mt-1 text-3xl font-black">Calendar</h1></div></section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <form onSubmit={handleSave} className="h-fit rounded border border-gray-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><CalendarDays className="text-red-700" size={26} /><h2 className="text-2xl font-black">{editingId ? "Edit event" : "Add event"}</h2></div><div className="mt-6 space-y-4"><label className="block text-sm font-bold">Event title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><div className="block text-sm font-bold">Calendar date<CalendarDatePicker value={draft.calendarDate || ""} onChange={updateCalendarDate} />{draft.calendarDate && <p className="mt-2 text-xs font-semibold text-gray-500">Selected: {formatDisplayDate(draft.calendarDate)}</p>}</div><label className="block text-sm font-bold">Display date or range<input value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required placeholder="September 10, 2026" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Location<input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300" /></label><label className="block text-sm font-bold">Event type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 font-normal outline-red-300"><option>Team</option><option>Outreach</option><option>Competition</option><option>Camp</option><option>Fundraiser</option></select></label></div>{message && <p className="mt-4 text-sm font-semibold text-red-700">{message}</p>}<div className="mt-6 flex gap-3"><button type="submit" className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800"><Save size={16} /> Save event</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setDraft(emptyDraft); }} className="rounded border border-gray-300 px-4 py-3 text-sm font-bold hover:bg-gray-50">Cancel</button>}</div></form>
        <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-2xl font-black">Published events</h2><span className="text-sm font-semibold text-gray-500">{events.length} total</span></div>{events.map((event) => <article key={event.id} className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-red-700">{event.type}</p><h3 className="mt-1 text-lg font-black">{event.title}</h3><p className="mt-1 text-sm text-gray-600">{event.date} · {event.location}</p></div><div className="flex gap-2"><button onClick={() => { setEditingId(event.id); setDraft({ title: event.title, date: event.date, calendarDate: event.calendarDate || "", location: event.location, type: event.type }); setMessage(""); }} className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"><Pencil size={15} /> Edit</button><button onClick={() => deleteEvent(event.id)} className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"><Trash2 size={15} /> Delete</button></div></article>)}{events.length === 0 && <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">No calendar events yet. Add the first one from the form.</div>}</div>
      </section>
    </main>
  );
}
