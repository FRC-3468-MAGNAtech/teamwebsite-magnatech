import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BadgeDollarSign, CalendarDays, Clock, Mail, MapPin } from "lucide-react";
import StemDaysSignupForm from "./stem-days-signup-form";

export default function StemDaysPage() {
  return (
    <main className="site-grid min-h-screen bg-gray-50 text-gray-950">
      <section className="relative overflow-hidden border-b border-gray-200 bg-white">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-12 top-2 hidden w-44 opacity-20 lg:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/#outreach" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-800">
            <ArrowLeft size={16} /> Back to Outreach
          </Link>
          <p className="mt-8 text-sm font-bold uppercase tracking-wide text-red-700">MAGNAtech Outreach</p>
          <h1 className="display-font mt-2 text-4xl font-black sm:text-5xl">STEM Days Signup</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Sign your child up for a MAGNAtech STEM Day. Space is limited, so reserve a spot below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <BadgeDollarSign className="text-red-700" size={26} />
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-red-700">Price</p>
            <p className="mt-1 text-lg font-black">$25 per day</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <CalendarDays className="text-red-700" size={26} />
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-red-700">Dates</p>
            <p className="mt-1 text-lg font-black">October 13 &amp; October 15</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <Clock className="text-red-700" size={26} />
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-red-700">Time</p>
            <p className="mt-1 text-lg font-black">1:00 PM &ndash; 5:00 PM</p>
          </div>
          <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <MapPin className="text-red-700" size={26} />
            <p className="mt-3 text-sm font-bold uppercase tracking-wide text-red-700">Location</p>
            <p className="mt-1 text-lg font-black">West Monroe High School, Wing 7</p>
          </div>
        </div>

        <div className="mt-5 rounded border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 shrink-0 text-red-700" size={22} />
            <div>
              <p className="font-black text-gray-950">Payment is due by 10/9.</p>
              <p className="mt-1 text-sm leading-6 text-gray-700">
                Payment is completed through Online School Payment, not on this site. Questions? Contact{" "}
                <a href="mailto:alisonlovelady@opsb.net" className="font-bold text-red-700 underline hover:text-red-800">
                  alisonlovelady@opsb.net
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StemDaysSignupForm />
        </div>
      </section>
    </main>
  );
}
