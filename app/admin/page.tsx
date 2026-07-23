"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, FileText, LockKeyhole, LogOut } from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/session")
      .then(async (response) => {
        const payload = (await response.json()) as { authenticated: boolean; configured: boolean };
        setAuthenticated(payload.authenticated);
        setConfigured(payload.configured);
      })
      .catch(() => setMessage("Unable to check the admin session."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(payload.error || "Unable to sign in.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
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
          {!configured ? <p className="mt-4 text-sm leading-6 text-gray-600">Set an `ADMIN_PASSWORD` in the host environment before this panel can be used.</p> : (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block text-sm font-bold text-gray-800">Password<input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" className="mt-2 w-full rounded border border-gray-300 px-3 py-3 outline-red-300" /></label>
              {message && <p className="text-sm font-semibold text-red-700">{message}</p>}
              <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-700 px-5 py-3 font-black text-white hover:bg-red-800">Sign in <LockKeyhole size={17} /></button>
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
          <div><p className="text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p><h1 className="display-font mt-1 text-3xl font-black">Control Room</h1></div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50"><LogOut size={16} /> Sign out</button>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-base leading-7 text-gray-600">Choose an area to manage public events and private sponsor information.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/admin/calendar" className="group rounded border border-gray-200 bg-white p-7 shadow-sm transition hover:border-red-300 hover:shadow-md"><CalendarDays className="text-red-700" size={32} /><h2 className="mt-5 text-2xl font-black">Calendar</h2><p className="mt-2 text-sm leading-6 text-gray-600">Add, edit, and remove the events shown on the public calendar.</p><span className="mt-6 inline-flex text-sm font-black text-red-700">Manage calendar →</span></Link>
          <Link href="/sponsor-responses" className="group rounded border border-[#c59a3d]/40 bg-[#fff8e7] p-7 shadow-sm transition hover:border-[#c59a3d] hover:shadow-md"><FileText className="text-[#8a641d]" size={32} /><h2 className="mt-5 text-2xl font-black">Form Responses</h2><p className="mt-2 text-sm leading-6 text-gray-600">Review sponsorship intake submissions from local businesses.</p><span className="mt-6 inline-flex text-sm font-black text-[#8a641d]">View responses →</span></Link>
        </div>
      </section>
    </main>
  );
}
