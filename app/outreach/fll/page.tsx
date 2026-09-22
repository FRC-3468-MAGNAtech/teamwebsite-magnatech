import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function FllOutreachPage() {
  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#outreach" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to Outreach
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Outreach</p>
          <h1 className="display-font mt-2 text-4xl font-black sm:text-5xl">FLL Teams</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            MAGNAtech supports FIRST LEGO League teams in our community as they compete in the current season.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-red-700">Team Numbers</p>
            <p className="mt-2 text-2xl font-black">72405 &amp; 75340</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-red-700">Current Game</p>
            <p className="mt-2 text-2xl font-black">BIOGLOW</p>
          </div>
        </div>

        <a
          href="#"
          className="mt-5 inline-flex items-center gap-2 rounded bg-red-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-800"
        >
          FLL Team Documentation <ExternalLink size={16} />
        </a>
      </section>
    </main>
  );
}
