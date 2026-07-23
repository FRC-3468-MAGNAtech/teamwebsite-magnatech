import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download } from "lucide-react";
import { resourceDocuments } from "./data";

export default function ResourcesPage() {
  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#resources" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to resources
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Library</p>
          <h1 className="display-font mt-2 text-4xl font-black sm:text-5xl">Resource Directory</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Public examples, robot documentation, and outreach materials from MAGNAtech.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        {resourceDocuments.map((resource) => {
          const ResourceIcon = resource.icon;
          const cardContent = (
            <>
              <div className="flex items-start justify-between gap-4">
                <ResourceIcon className="text-red-700" size={30} />
                <span className="rounded bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-red-700">
                  {resource.category}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-black">{resource.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{resource.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-red-700">
                {resource.href ? "Open PDF" : "Coming soon"}
                {resource.href && <Download size={16} />}
              </span>
            </>
          );

          if (!resource.href) {
            return (
              <article key={resource.title} className="rounded border border-gray-200 bg-white p-6 shadow-sm">
                {cardContent}
              </article>
            );
          }

          return (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="relative overflow-hidden rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"
            >
              <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute right-4 top-4 w-14 opacity-10" />
              {cardContent}
            </a>
          );
        })}
      </section>
    </main>
  );
}
