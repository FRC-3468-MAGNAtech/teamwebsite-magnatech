import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, GraduationCap, ImageIcon, ListChecks } from "lucide-react";
import { seasons } from "../data";

export function generateStaticParams() {
  return seasons.map((season) => ({ year: season.slug }));
}

export default async function SeasonArchivePage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const season = seasons.find((item) => item.slug === year);

  if (!season) {
    notFound();
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/column-gold.png" alt="" aria-hidden="true" width={570} height={807} className="pointer-events-none absolute -right-10 -bottom-32 hidden w-48 opacity-10 md:block" />
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-3 hidden w-40 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#archive" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to archive
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">{season.year}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="display-font text-4xl font-black sm:text-5xl">{season.game}</h1>
            {season.robotName && <span className="technical-label rounded border border-[#c59a3d]/50 bg-[#fff8e7] px-3 py-2 text-sm font-bold text-[#8a641d]">{season.robotName}</span>}
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{season.summary}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative overflow-hidden rounded border border-gray-200 bg-white p-5 shadow-sm">
          <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute right-4 top-4 w-16 opacity-10" />
          <ImageIcon className="text-red-700" size={28} />
          <h2 className="mt-4 text-2xl font-black">Robot Pic</h2>
          <div className="mt-4 flex aspect-video items-end rounded bg-[linear-gradient(135deg,rgba(196,34,33,0.16),rgba(17,24,39,0.10)),repeating-linear-gradient(45deg,rgba(196,34,33,0.18)_0_1px,transparent_1px_18px)] p-4">
            <p className="text-sm font-bold text-gray-600">Robot photo placeholder</p>
          </div>
        </div>

        <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
          <ListChecks className="text-red-700" size={28} />
          <h2 className="mt-4 text-2xl font-black">Season Recap</h2>
          <p className="mt-4 text-sm leading-6 text-gray-600">{season.summary}</p>
        </div>

        <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
          <CalendarDays className="text-red-700" size={28} />
          <h2 className="mt-4 text-2xl font-black">Important Team Events</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-gray-700">
            {season.events.map((event) => (
              <li key={event} className="rounded bg-gray-50 p-3">{event}</li>
            ))}
          </ul>
        </div>

        <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
          <GraduationCap className="text-red-700" size={28} />
          <h2 className="mt-4 text-2xl font-black">Senior Spotlight</h2>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-gray-700">
            {season.seniors.map((senior) => (
              <li key={senior} className="rounded bg-gray-50 p-3">{senior}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
