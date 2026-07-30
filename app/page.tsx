"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Amphora,
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Crown,
  Download,
  Facebook,
  FileText,
  Flame,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Instagram,
  Landmark,
  MapPin,
  Music2,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  type LucideIcon,
  Wrench,
  Youtube,
} from "lucide-react";
import { programs, seasons } from "./archive/data";
import { getSubgroupParent, subgroups } from "./subgroups/data";

const tierIconMap = {
  torch: Flame,
  delphi: ScrollText,
  corinthian: Amphora,
  athenian: Shield,
  spartan: Swords,
  titan: Landmark,
  olympian: Crown,
} satisfies Record<string, LucideIcon>;

const sponsorTiers = [
  {
    icon: tierIconMap.torch,
    name: "Torch Supporter",
    amount: "Up to $250",
    summary: "A meaningful way for families, alumni, and local shops to support student robotics.",
    benefits: ["Thank you letter", "Group social media recognition"],
    previousIcons: [],
  },
  {
    icon: tierIconMap.delphi,
    name: "Delphi Partner",
    amount: "$500+",
    summary: "Community backing with visible support at our summer STEM camp.",
    benefits: ["Business name on Summer STEM Camp shirt", "All previous benefits"],
    previousIcons: [tierIconMap.torch],
  },
  {
    icon: tierIconMap.corinthian,
    name: "Corinthian Partner",
    amount: "$1,000+",
    summary: "A visible partnership for businesses investing in local STEM.",
    benefits: ["Small business logo on Summer STEM Camp T-shirts", "Small business logo on competition shirts and pit banner", "All previous benefits"],
    previousIcons: [tierIconMap.torch, tierIconMap.delphi],
  },
  {
    icon: tierIconMap.athenian,
    name: "Athenian Partner",
    amount: "$2,500+",
    summary: "Built for companies that want sustained community visibility.",
    benefits: ["Medium business logo on competition shirts and pit banner", "Small business logo on the competition robot", "All previous benefits"],
    previousIcons: [tierIconMap.torch, tierIconMap.delphi, tierIconMap.corinthian],
  },
  {
    icon: tierIconMap.spartan,
    name: "Spartan Partner",
    amount: "$5,000+",
    summary: "Presenting-level support with headline local recognition.",
    benefits: ["Large business logo on competition shirts and pit banner", "Medium business logo on a robot", "Individual social media feature", "Business name attached to the team name", "All previous benefits"],
    previousIcons: [tierIconMap.torch, tierIconMap.delphi, tierIconMap.corinthian, tierIconMap.athenian],
  },
  {
    icon: tierIconMap.titan,
    name: "Titan Partner",
    amount: "$10,000+",
    summary: "Premier partners helping shape the future of MAGNAtech.",
    benefits: ["Large business logo on a robot", "Large business logo on Summer Camp T-shirts", "Invitation to team events, including VIP access to Bayou Regional", "All previous benefits"],
    previousIcons: [tierIconMap.torch, tierIconMap.delphi, tierIconMap.corinthian, tierIconMap.athenian, tierIconMap.spartan],
  },
  {
    icon: tierIconMap.olympian,
    name: "Olympian Partner",
    amount: "$15,000+",
    summary: "Our highest-impact partnership for organizations ready to stand at the front of local STEM growth.",
    benefits: ["Largest and most visible logo on robot", "On-site robot demo", "All previous benefits"],
    previousIcons: [tierIconMap.torch, tierIconMap.delphi, tierIconMap.corinthian, tierIconMap.athenian, tierIconMap.spartan, tierIconMap.titan],
  },
];

const communityStats = [
  ["3468", "FRC team number"],
  ["West Monroe, LA", "home community"],
  ["6", "team subgroups"],
  ["Year-round", "demos, outreach, and events"],
];

const eventList = [
  {
    title: "Fall Info Meeting",
    date: "September TBD",
    location: "West Monroe High School",
    type: "Team",
  },
  {
    title: "Community Robot Demo",
    date: "Date TBD",
    location: "Local library or STEM night",
    type: "Outreach",
  },
  {
    title: "Bayou Regional",
    date: "Spring season",
    location: "Competition and sponsor VIP opportunity",
    type: "Competition",
  },
  {
    title: "Summer STEM Camp",
    date: "Summer",
    location: "West Monroe",
    type: "Camp",
  },
];

type PublicCalendarEvent = (typeof eventList)[number] & { id?: string; calendarDate?: string };

const impactStats = [
  ["TBD", "students mentored"],
  ["31", "schools impacted"],
  ["1,769", "team outreach hours"],
  ["4", "first teams created"],
  ["6", "camps hosted"],
  ["45", "community events"],
];

const quickLinks = [
  { label: "Instagram", href: "https://www.instagram.com/magnatech_3468/", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/magnatech3468/", icon: Facebook },
  { label: "TikTok", href: "https://www.tiktok.com/@frcmagnatech3468", icon: Music2 },
  { label: "YouTube", href: "https://www.youtube.com/@frc3468.magnatech", icon: Youtube },
  { label: "Become a Sponsor", href: "/sponsor-intake" },
  { label: "Download Sponsor Packet", href: "/sponsorship-letter-2027.pdf" },
  { label: "Current Season Reveal Video", href: "https://youtu.be/ncbwmR5eJRc?si=IN4z1PlONDUouwYR" },
  { label: "The Blue Alliance Team Page", href: "https://www.thebluealliance.com/team/3468" },
  { label: "Community Event Calendar", href: "#calendar" },
  { label: "Newsletter Sign-Up", href: "#newsletter" },
];

const carouselPlaceholders = [
  "Robot reveal",
  "Summer STEM camp",
  "Competition pit",
  "Community demo",
];

const resources = [
  {
    icon: FileText,
    title: "Sponsor Packet",
    detail: "Download the official PDF.",
    href: "/sponsorship-letter-2027.pdf",
  },
  {
    icon: GraduationCap,
    title: "Resource Directory",
    detail: "Impact, robot, and one-page example PDFs.",
    href: "/resources",
  },
  {
    icon: Wrench,
    title: "CAD and Code",
    detail: "Link GitHub and Onshape resources.",
    href: "#resources",
  },
];

function opensInNewTab(href: string) {
  return href.startsWith("http") || href.endsWith(".pdf");
}

function SectionHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <div className="mb-4 flex items-center justify-center gap-3 text-[#c59a3d]" aria-hidden="true">
        <Image src="/greek-assets/cropped/laurel-branch.png" alt="" width={1102} height={618} className="h-24 w-56 object-contain sm:h-28 sm:w-72" />
      </div>
      <h2 className="display-font angled-rule inline-block pb-4 text-3xl font-bold text-gray-950 sm:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-7 text-gray-600">{children}</p>}
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-red-700 text-sm font-black text-white">
            MT
          </div>
          <div>
            <p className="display-font text-lg font-black leading-none text-red-700">MAGNAtech</p>
            <p className="text-xs font-semibold text-gray-600">WM Rebel Robotics - FRC 3468</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-gray-700 md:flex">
          <a href="#sponsors" className="hover:text-red-700">
            Sponsors
          </a>
          <a href="#subgroups" className="hover:text-red-700">
            Subgroups
          </a>
          <a href="#outreach" className="hover:text-red-700">
            Outreach
          </a>
          <a href="#archive" className="hover:text-red-700">
            Archive
          </a>
          <a href="#resources" className="hover:text-red-700">
            Resources
          </a>
          <a href="#links" className="hover:text-red-700">
            Links
          </a>
        </nav>
        <a
          href="/sponsor-intake"
          className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-800"
        >
          Sponsor <Handshake size={16} />
        </a>
      </div>
    </header>
  );
}

export default function MagnatechPublicSite() {
  const [calendarEvents, setCalendarEvents] = useState<PublicCalendarEvent[]>(eventList);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [newsletterError, setNewsletterError] = useState("");

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNewsletterState("submitting");
    setNewsletterError("");

    const form = event.currentTarget;
    try {
      const response = await fetch("/api/newsletter", { method: "POST", body: new FormData(form) });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to sign up right now.");
      }

      form.reset();
      setNewsletterState("success");
    } catch (error) {
      setNewsletterState("error");
      setNewsletterError(error instanceof Error ? error.message : "Unable to sign up right now.");
    }
  }

  useEffect(() => {
    fetch("/api/calendar")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load calendar events.");
        }
        return response.json() as Promise<{ events: PublicCalendarEvent[] }>;
      })
      .then(({ events }) => setCalendarEvents(events))
      .catch(() => undefined);
  }, []);

  const visibleCalendarEvents = useMemo(
    () => selectedCalendarDate ? calendarEvents.filter((event) => event.calendarDate === selectedCalendarDate) : calendarEvents,
    [calendarEvents, selectedCalendarDate],
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950">
      <Nav />

      <section className="relative overflow-hidden bg-gray-950 text-white">
        <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute -right-5 top-8 z-10 w-24 opacity-80 mix-blend-screen sm:w-36" />
        <div className="absolute inset-0 opacity-35">
          <div className="h-full w-full bg-[linear-gradient(135deg,rgba(196,34,33,0.92),rgba(17,24,39,0.82)_42%,rgba(255,255,255,0.12)),repeating-linear-gradient(90deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_88px),repeating-linear-gradient(0deg,rgba(255,255,255,0.1)_0_1px,transparent_1px_88px)]" />
        </div>
        <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded border border-white/25 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
              <Sparkles size={16} /> West Monroe&apos;s FRC robotics team
            </p>
            <div className="flex items-center gap-4">
              <h1 className="display-font text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">MAGNAtech</h1>
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100 sm:text-xl">
              WM Rebel Robotics builds robots, outreach programs, media, strategy, and local STEM momentum through FIRST Robotics Competition.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#subgroups"
                className="inline-flex items-center justify-center gap-2 rounded bg-white px-6 py-3 font-bold text-red-700 hover:bg-gray-100"
              >
                Team Subgroups <ArrowRight size={18} />
              </a>
              <a
                href="/sponsor-intake"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/35 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                Become a Sponsor <BadgeDollarSign size={18} />
              </a>
            </div>
          </div>
          <div className="relative rounded border border-[#c59a3d]/50 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="pointer-events-none absolute -right-3 -top-3 rounded-full border border-[#d5ad55]/60 bg-gray-950/80 p-2 text-[#d5ad55]" aria-hidden="true">
              <Image src="/greek-assets/cropped/gear-gold.png" alt="" width={586} height={586} className="h-5 w-5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {communityStats.map(([value, label]) => (
                <div key={value} className="rounded bg-white p-5 text-gray-950">
                  <p className="text-2xl font-black text-red-700">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-600">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 overflow-x-auto pb-1">
              <div className="flex snap-x gap-3">
                {carouselPlaceholders.map((label, index) => (
                  <div
                    key={label}
                    className="flex min-w-[78%] snap-center flex-col justify-end rounded border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.24),rgba(196,34,33,0.32)),repeating-linear-gradient(45deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_16px)] p-4 sm:min-w-[58%]"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-red-100">Photo {index + 1}</p>
                    <p className="mt-1 text-lg font-black text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sponsors" className="site-grid bg-white py-20">
        <div className="mx-auto mb-12 max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8" aria-hidden="true">
          <Image src="/greek-assets/cropped/divider-red.png" alt="" width={1504} height={344} className="h-5 w-full object-cover object-center opacity-70" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Sponsor Us">
            MAGNAtech sponsorship supports robot parts, travel, outreach events, training, and programs that bring STEM opportunities to our community.
          </SectionHeader>
          <div className="mb-8 flex justify-center">
            <a
              href="/sponsor-intake"
              className="inline-flex items-center gap-2 rounded bg-red-700 px-6 py-3 font-black text-white shadow-sm transition hover:bg-red-800"
            >
              Start sponsorship form <BadgeDollarSign size={18} />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sponsorTiers.map((tier) => (
              <article
                key={tier.name}
                className={`relative overflow-hidden rounded border border-gray-200 bg-white p-6 shadow-sm ${tier.name === "Olympian Partner" ? "lg:col-start-2" : ""}`}
              >
                <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute right-3 top-3 w-20 opacity-20" />
                <h3 className="flex items-center gap-2 text-xl font-black text-gray-950">
                  <tier.icon className="mt-0.5 shrink-0 text-red-700" size={22} />
                  {tier.name}
                </h3>
                <p className="mt-1 text-2xl font-black text-red-700">{tier.amount}</p>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.summary}</p>
                <ul className="mt-5 space-y-3 text-sm font-semibold text-gray-700">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <ChevronRight className="mt-0.5 shrink-0 text-red-700" size={16} />
                      <span>
                        {benefit}
                        {benefit === "All previous benefits" && tier.previousIcons.length > 0 && (
                          <span className="ml-2 inline-flex align-middle gap-1" aria-label="Previous sponsor tiers">
                            {tier.previousIcons.map((PreviousIcon) => (
                              <PreviousIcon key={PreviousIcon.displayName || PreviousIcon.name} size={15} className="text-red-700" />
                            ))}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded border border-gray-200 bg-gray-50 p-6">
              <HeartHandshake className="text-red-700" size={28} />
              <h3 className="mt-4 text-xl font-black">Mentorship</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Local engineers, machinists, programmers, media pros, and business leaders can mentor the team.
              </p>
            </div>
            <div className="rounded border border-gray-200 bg-gray-50 p-6">
              <Wrench className="text-red-700" size={28} />
              <h3 className="mt-4 text-xl font-black">In-Kind Support</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Gift cards, meals, machining, printing, transportation support, and materials can all move the team forward.
              </p>
            </div>
            <div className="rounded border border-gray-200 bg-gray-50 p-6">
              <Download className="text-red-700" size={28} />
              <h3 className="mt-4 text-xl font-black">Sponsor Packet</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our sponsor packet includes MAGNAtech&apos;s mission, tiers, and community reach.
              </p>
              <a
                href="/sponsorship-letter-2027.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
              >
                Download packet <Download size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="subgroups" className="relative overflow-hidden py-20">
        <Image src="/greek-assets/cropped/column-gold.png" alt="" aria-hidden="true" width={570} height={807} className="pointer-events-none absolute -left-10 bottom-0 hidden w-32 opacity-10 lg:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#c59a3d]/50" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Subgroups">
            MAGNAtech is organized into focused subgroups that support the robot, outreach, media, operations, and competition strategy.
          </SectionHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subgroups.map((subgroup) => {
              const SubgroupIcon = subgroup.icon;
              const parent = getSubgroupParent(subgroup);
              return (
                <a
                  key={subgroup.slug}
                  href={`/subgroups/${subgroup.slug}`}
                  className="relative overflow-hidden rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#c59a3d] hover:shadow-md"
                >
                  <Image src="/greek-assets/cropped/laurel-vine.png" alt="" aria-hidden="true" width={164} height={864} className="pointer-events-none absolute right-5 top-5 w-9 rotate-45 opacity-25" />
                  <SubgroupIcon className="text-red-700" size={28} />
                  <h3 className="mt-4 text-xl font-black text-gray-950">{subgroup.name}</h3>
                  {parent && <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">Part of {parent.name}</p>}
                  <p className="mt-3 text-sm leading-6 text-gray-600">{subgroup.summary}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-red-700">
                    View subgroup <ArrowRight size={16} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="outreach" className="site-grid relative overflow-hidden bg-white py-20">
        <Image src="/greek-assets/cropped/laurel-vine.png" alt="" aria-hidden="true" width={164} height={864} className="pointer-events-none absolute right-0 hidden w-28 opacity-10 lg:block" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Outreach">
            Outreach, camps, and events connect MAGNAtech with schools and STEM programs across the community.
          </SectionHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {impactStats.map(([value, label]) => (
              <div key={label} className="relative overflow-hidden rounded border border-gray-200 bg-gray-50 p-6 text-center">
                <Image src="/greek-assets/cropped/gear-gold.png" alt="" aria-hidden="true" width={586} height={586} className="pointer-events-none absolute -right-2 -top-2 w-10 opacity-20" />
                <p className="text-4xl font-black text-red-700">{value}</p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-gray-700">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-6 text-center">
            <h3 className="text-2xl font-black text-gray-950">Request a Robot Demo or STEM Station</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-700">
              If you would like MAGNAtech to bring a robot demo or STEM station to your event, contact{" "}
              <a href="mailto:alisonlovelady@opsb.net" className="font-black text-red-700 underline-offset-2 hover:underline">
                alisonlovelady@opsb.net
              </a>
              .
            </p>
            <a
              href="/resources"
              className="mt-5 inline-flex items-center gap-2 rounded bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800"
            >
              View outreach resources <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="calendar" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Event Calendar">
            Public demos, school visits, camps, and competitions show MAGNAtech in action.
          </SectionHeader>
          <div className="grid gap-5 lg:grid-cols-[0.36fr_0.64fr]">
            <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-wide text-red-700">Upcoming</p>
              <h3 className="mt-2 text-2xl font-black">Team Calendar</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">Choose a date to see scheduled events, or clear it to view everything.</p>
              <label className="mt-5 block text-sm font-bold text-gray-800">
                Select a date
                <input value={selectedCalendarDate} onChange={(event) => setSelectedCalendarDate(event.target.value)} type="date" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm outline-red-300" />
              </label>
              {selectedCalendarDate && <button type="button" onClick={() => setSelectedCalendarDate("")} className="mt-3 text-sm font-bold text-red-700 hover:text-red-800">Show all events</button>}
            </div>
            <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
              {visibleCalendarEvents.map((event) => (
                <div key={event.title} className="grid gap-3 border-b border-gray-200 p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-red-700">{event.type}</p>
                    <h3 className="mt-1 font-black text-gray-950">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={15} /> {event.location}
                    </p>
                  </div>
                  <p className="flex items-center gap-2 text-sm font-bold text-red-700">
                    <CalendarDays size={16} /> {event.date}
                  </p>
                </div>
              ))}
              {visibleCalendarEvents.length === 0 && <p className="p-6 text-sm font-semibold text-gray-600">No events are scheduled for this date.</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="archive" className="relative overflow-hidden bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Team Archive" />
          <div className="overflow-x-auto pb-2">
            <div className="flex snap-x gap-4">
              {seasons.map((season) => (
                (() => {
                  const robotSymbol = season.robotSymbol;
                  return (
                    <a
                      key={season.year}
                      href={`/archive/${season.slug}`}
                      className="relative min-w-[78%] snap-center overflow-hidden rounded border border-gray-200 bg-gray-50 p-6 transition hover:border-[#c59a3d] hover:bg-white hover:shadow-sm sm:min-w-[44%] lg:min-w-[31%]"
                    >
                      <Image src="/greek-assets/cropped/laurel-branch.png" alt="" aria-hidden="true" width={1102} height={618} className="pointer-events-none absolute right-5 top-5 w-11 rotate-6 opacity-25" />
                      <div className="flex aspect-video items-end rounded bg-[linear-gradient(135deg,rgba(196,34,33,0.16),rgba(17,24,39,0.10)),repeating-linear-gradient(45deg,rgba(196,34,33,0.18)_0_1px,transparent_1px_18px)] p-4">
                        <p className="text-sm font-bold text-gray-600">Robot pic</p>
                      </div>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold uppercase tracking-wide text-red-700">{season.year}</p>
                        {robotSymbol && (
                          <span title={season.robotName} className="rounded border border-[#c59a3d]/50 bg-[#fff8e7] p-2 text-[#8a641d]">
                            <Image src={robotSymbol} alt={`${season.robotName} symbol`} width={320} height={320} className="robot-symbol h-[18px] w-[18px] object-contain" />
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-2xl font-black">{season.game}</h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{season.summary}</p>
                    </a>
                  );
                })()
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {programs.map((program) => (
              <a
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="rounded border border-red-200 bg-red-50 p-6 transition hover:bg-red-100"
              >
                <p className="text-sm font-bold uppercase tracking-wide text-red-700">{program.name}</p>
                <h3 className="mt-2 text-2xl font-black text-gray-950">{program.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-700">{program.summary}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="resources" className="site-grid py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Resources" />
          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource) => {
              const ResourceIcon = resource.icon;
              return (
                <a
                  key={resource.title}
                  href={resource.href}
                  target={opensInNewTab(resource.href) ? "_blank" : undefined}
                  rel={opensInNewTab(resource.href) ? "noreferrer" : undefined}
                  className="rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:border-red-300 hover:shadow-md"
                >
                  <ResourceIcon className="text-red-700" size={28} />
                  <h3 className="mt-4 text-lg font-black">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{resource.detail}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="links" className="bg-gray-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-red-300">Quick Links</p>
            <h2 className="display-font mt-3 text-4xl font-black">MAGNAtech links</h2>
            <p className="mt-4 text-base leading-7 text-gray-300">
              Social media, sponsor materials, event links, and team resources.
            </p>
          </div>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              (() => {
                const QuickIcon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={opensInNewTab(link.href) ? "_blank" : undefined}
                    rel={opensInNewTab(link.href) ? "noreferrer" : undefined}
                    className="flex w-full items-center justify-between rounded border border-white/15 bg-white/10 px-5 py-4 text-left font-bold text-white hover:bg-white/15"
                  >
                    <span className="flex items-center gap-3">
                      {QuickIcon && <QuickIcon size={18} />}
                      {link.label}
                    </span>
                    <ArrowRight size={18} />
                  </a>
                );
              })()
            ))}
          </div>
        </div>
      </section>

      <section id="newsletter" className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Newsletter" >
            Sign up for MAGNAtech updates, event notes, outreach highlights, and sponsor news.
          </SectionHeader>
          <form onSubmit={handleNewsletterSubmit} className="rounded border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr_auto]">
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Name</span>
                <input name="name" type="text" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-800">Email</span>
                <input required name="email" type="email" className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-3 text-sm" />
              </label>
              <button
                type="submit"
                disabled={newsletterState === "submitting"}
                className="self-end rounded bg-red-700 px-5 py-3 text-sm font-black text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {newsletterState === "submitting" ? "Signing up..." : "Sign Up"}
              </button>
            </div>
            {newsletterState === "success" && (
              <div className="mt-4 flex items-start gap-3 rounded border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                <p>You&apos;re subscribed! Watch your inbox for MAGNAtech updates.</p>
              </div>
            )}
            {newsletterState === "error" && (
              <div className="mt-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">{newsletterError}</div>
            )}
          </form>
        </div>
      </section>

      <footer className="bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-gray-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold">MAGNAtech - WM Rebel Robotics - FRC 3468</p>
          <p>Building robots, leaders, and STEM opportunities in West Monroe.</p>
        </div>
      </footer>
    </div>
  );
}
