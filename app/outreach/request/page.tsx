import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import BusinessRequestForm from "./business-request-form";

export default function OutreachRequestPage() {
  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#outreach" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to Outreach
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Outreach</p>
          <h1 className="display-font mt-2 text-4xl font-black sm:text-5xl">Request Outreach</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Invite MAGNAtech to bring a robot demo or STEM activity to your business or event. Tell us a bit about what you have in mind and we&apos;ll follow up to coordinate details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <BusinessRequestForm />
      </section>
    </main>
  );
}
