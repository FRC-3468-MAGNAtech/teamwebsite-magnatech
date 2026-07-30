import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getSubgroupChildren, getSubgroupParent, subgroups } from "../data";

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
  const parent = getSubgroupParent(subgroup);
  const children = getSubgroupChildren(subgroup.slug);

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
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">
                {parent ? (
                  <>
                    Part of{" "}
                    <Link href={`/subgroups/${parent.slug}`} className="underline hover:text-red-800">
                      {parent.name}
                    </Link>
                  </>
                ) : (
                  "MAGNAtech Subgroup"
                )}
              </p>
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
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {subgroup.focusAreas.map((area) => (
              <li key={area.name} className="flex gap-3 rounded bg-gray-50 p-4">
                <ChevronRight className="mt-0.5 shrink-0 text-red-700" size={16} />
                <div>
                  <p className="text-sm font-black text-gray-900">{area.name}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{area.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {children.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-black">Sub-teams</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {children.map((child) => {
                const ChildIcon = child.icon;
                return (
                  <Link
                    key={child.slug}
                    href={`/subgroups/${child.slug}`}
                    className="rounded border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#c59a3d] hover:shadow-md"
                  >
                    <ChildIcon className="text-red-700" size={24} />
                    <h3 className="mt-3 text-lg font-black text-gray-950">{child.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{child.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-red-700">
                      View subgroup <ArrowRight size={16} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
