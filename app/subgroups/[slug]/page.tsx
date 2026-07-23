import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { subgroups } from "../data";

export function generateStaticParams() {
  return subgroups.map((subgroup) => ({ slug: subgroup.slug }));
}

export default async function SubgroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subgroup = subgroups.find((item) => item.slug === slug);

  if (!subgroup) {
    notFound();
  }

  const Icon = subgroup.icon;

  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/column-gold.png" alt="" aria-hidden="true" width={570} height={807} className="pointer-events-none absolute -right-12 -bottom-36 hidden w-44 opacity-10 lg:block" />
        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#subgroups" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to subgroups
          </Link>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded border border-red-200 bg-red-50 text-red-700">
              <Icon size={32} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Subgroup</p>
              <h1 className="display-font mt-2 text-4xl font-black">{subgroup.name}</h1>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-base leading-7 text-gray-600">{subgroup.summary}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded border border-gray-200 bg-white p-6 shadow-sm">
          <Image src="/greek-assets/cropped/laurel-vine.png" alt="" aria-hidden="true" width={164} height={864} className="pointer-events-none absolute right-5 top-5 w-8 rotate-45 opacity-15" />
          <h2 className="text-2xl font-black">What this subgroup does</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {subgroup.responsibilities.map((responsibility) => (
              <li key={responsibility} className="flex gap-2 rounded bg-gray-50 p-4 text-sm font-bold text-gray-700">
                <ChevronRight className="mt-0.5 shrink-0 text-red-700" size={16} />
                {responsibility}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
