import Link from "next/link";
import { CheckCircle2, MailX } from "lucide-react";
import { unsubscribeByToken } from "@/lib/newsletter";

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const unsubscribed = token ? await unsubscribeByToken(token) : false;

  return (
    <main className="site-grid flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16 text-gray-950">
      <section className="w-full max-w-md rounded border border-gray-200 bg-white p-7 text-center shadow-sm">
        {unsubscribed ? (
          <>
            <CheckCircle2 className="mx-auto text-green-700" size={34} />
            <h1 className="display-font mt-4 text-2xl font-black">You're unsubscribed</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              You won't receive any more MAGNAtech newsletter emails. You can sign up again any time from the homepage.
            </p>
          </>
        ) : (
          <>
            <MailX className="mx-auto text-red-700" size={34} />
            <h1 className="display-font mt-4 text-2xl font-black">Link not found</h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              This unsubscribe link is invalid or has already been used. Contact us if you keep receiving emails you don&apos;t want.
            </p>
          </>
        )}
        <Link href="/" className="mt-6 inline-flex text-sm font-bold text-red-700 hover:text-red-800">
          Back to website
        </Link>
      </section>
    </main>
  );
}
