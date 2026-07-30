"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send, Trash2, UserCheck, UserX } from "lucide-react";

type NewsletterStatus = "subscribed" | "unsubscribed";

type NewsletterSubscriber = {
  id: string;
  name: string;
  email: string;
  subscribedAt: string;
  status: NewsletterStatus;
  unsubscribeToken: string;
};

const statusFilters: Array<NewsletterStatus | "All"> = ["All", "subscribed", "unsubscribed"];

const statusStyles: Record<NewsletterStatus, string> = {
  subscribed: "border-green-200 bg-green-50 text-green-900",
  unsubscribed: "border-gray-300 bg-gray-100 text-gray-700",
};

export default function NewsletterEditor({ initialSubscribers }: { initialSubscribers: NewsletterSubscriber[] }) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(initialSubscribers);
  const [filter, setFilter] = useState<NewsletterStatus | "All">("All");
  const [listMessage, setListMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState("");

  async function loadSubscribers() {
    const response = await fetch("/api/newsletter");
    const payload = (await response.json()) as { subscribers: NewsletterSubscriber[] };
    setSubscribers(payload.subscribers);
  }

  async function updateStatus(id: string, status: NewsletterStatus) {
    setListMessage("");
    const response = await fetch("/api/newsletter", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) {
      setListMessage("Unable to update the subscriber.");
      return;
    }
    await loadSubscribers();
  }

  async function deleteSubscriber(id: string, email: string) {
    if (!window.confirm(`Remove ${email} from the newsletter list?`)) return;
    setListMessage("");
    const response = await fetch("/api/newsletter", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (!response.ok) {
      setListMessage("Unable to remove the subscriber.");
      return;
    }
    setListMessage("Subscriber removed.");
    await loadSubscribers();
  }

  const subscribedCount = subscribers.filter((subscriber) => subscriber.status === "subscribed").length;
  const visibleSubscribers = filter === "All" ? subscribers : subscribers.filter((subscriber) => subscriber.status === filter);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm(`Send this newsletter to ${subscribedCount} subscribed contact${subscribedCount === 1 ? "" : "s"}?`)) return;

    setSending(true);
    setSendMessage("");
    try {
      const response = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const payload = (await response.json()) as { error?: string; sent?: number; failed?: number };
      if (!response.ok) {
        throw new Error(payload.error || "Unable to send the newsletter.");
      }

      setSendMessage(`Sent to ${payload.sent} contact${payload.sent === 1 ? "" : "s"}${payload.failed ? ` (${payload.failed} failed)` : ""}.`);
      setSubject("");
      setMessage("");
    } catch (error) {
      setSendMessage(error instanceof Error ? error.message : "Unable to send the newsletter.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to admin dashboard
          </Link>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Admin</p>
          <h1 className="display-font mt-1 text-3xl font-black">Newsletter</h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.42fr_0.58fr] lg:px-8">
        <form onSubmit={handleSend} className="h-fit rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Mail className="text-red-700" size={26} />
            <h2 className="text-2xl font-black">Compose &amp; send</h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Sends to all <strong>{subscribedCount}</strong> subscribed contact{subscribedCount === 1 ? "" : "s"}.
          </p>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              Subject
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300"
              />
            </label>
            <label className="block text-sm font-bold">
              Message
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                rows={10}
                placeholder="Write your update here. Separate paragraphs with a blank line."
                className="mt-2 w-full rounded border border-gray-300 px-3 py-3 font-normal outline-red-300"
              />
            </label>
          </div>
          {sendMessage && <p className="mt-4 text-sm font-semibold text-red-700">{sendMessage}</p>}
          <button
            type="submit"
            disabled={sending || subscribedCount === 0}
            className="mt-6 inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Send size={16} /> {sending ? "Sending..." : "Send newsletter"}
          </button>
        </form>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl font-black">Subscribers</h2>
            <span className="text-sm font-semibold text-gray-500">{subscribers.length} total</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const count = status === "All" ? subscribers.length : subscribers.filter((subscriber) => subscriber.status === status).length;
              const active = filter === status;
              const label = status === "All" ? "All" : status === "subscribed" ? "Subscribed" : "Unsubscribed";
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={
                    active
                      ? "inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-black text-white"
                      : "inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-50"
                  }
                >
                  {label} <span className={active ? "text-red-100" : "text-gray-500"}>{count}</span>
                </button>
              );
            })}
          </div>

          {listMessage && <p className="text-sm font-semibold text-red-700">{listMessage}</p>}

          {visibleSubscribers.map((subscriber) => (
            <article key={subscriber.id} className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black">{subscriber.name || "(no name)"}</h3>
                  <span className={`rounded border px-2 py-1 text-xs font-black uppercase tracking-wide ${statusStyles[subscriber.status]}`}>
                    {subscriber.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{subscriber.email}</p>
                <p className="text-xs text-gray-500">Signed up {new Date(subscriber.subscribedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {subscriber.status === "subscribed" ? (
                  <button
                    onClick={() => updateStatus(subscriber.id, "unsubscribed")}
                    className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"
                  >
                    <UserX size={15} /> Unsubscribe
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(subscriber.id, "subscribed")}
                    className="inline-flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-bold hover:bg-gray-50"
                  >
                    <UserCheck size={15} /> Resubscribe
                  </button>
                )}
                <button
                  onClick={() => deleteSubscriber(subscriber.id, subscriber.email)}
                  className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </article>
          ))}
          {visibleSubscribers.length === 0 && (
            <div className="rounded border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
              No subscribers{filter !== "All" ? ` marked ${filter}` : " yet"}.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
