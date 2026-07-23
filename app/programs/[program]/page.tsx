import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import { programs } from "../../archive/data";

export function generateStaticParams() {
  return programs.map((program) => ({ program: program.slug }));
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ program: string }>;
}) {
  const { program: programSlug } = await params;
  const program = programs.find((item) => item.slug === programSlug);

  if (!program) {
    notFound();
  }

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#archive" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to archive
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">{program.name}</p>
          <h1 className="display-font mt-2 text-4xl font-black sm:text-5xl">{program.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">{program.summary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {program.teams.map((team) => (
            <a key={team} href={`#${team.toLowerCase().replaceAll(" ", "-")}`} className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-800 hover:bg-red-100">
              {team}
            </a>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {program.teams.map((team) => (
            <article key={team} id={team.toLowerCase().replaceAll(" ", "-")} className="relative overflow-hidden rounded border border-gray-200 bg-white p-5 shadow-sm">
              <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute right-4 top-4 w-14 opacity-10" />
              <Users className="text-red-700" size={28} />
              <h2 className="mt-4 text-2xl font-black">{team}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Outreach documentation space for mentoring notes, event attendance, team milestones, photos, and seasonal updates.
              </p>
              <div className="mt-5 rounded bg-gray-50 p-4">
                <ClipboardList className="text-red-700" size={22} />
                <h3 className="mt-3 font-black">Documentation</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">Add outreach logs, event summaries, and supporting evidence here.</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
