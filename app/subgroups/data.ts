import {
  BadgeDollarSign,
  Camera,
  Code2,
  DraftingCompass,
  LineChart,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Subgroup = {
  slug: string;
  name: string;
  icon: LucideIcon;
  summary: string;
  responsibilities: string[];
};

export const subgroups: Subgroup[] = [
  {
    slug: "build",
    name: "Build",
    icon: Wrench,
    summary: "Build designs, fabricates, assembles, wires, repairs, and maintains the competition robot.",
    responsibilities: ["Mechanical assembly", "Wiring and pneumatics", "Prototyping", "Robot maintenance"],
  },
  {
    slug: "programming",
    name: "Programming",
    icon: Code2,
    summary: "Programming develops robot code, driver tools, autonomous routines, and technical systems.",
    responsibilities: ["Robot control code", "Autonomous paths", "Driver station tools", "Testing and debugging"],
  },
  {
    slug: "cad-design",
    name: "CAD and Design",
    icon: DraftingCompass,
    summary: "CAD and Design turns robot concepts into models, drawings, prototypes, and manufacturable parts.",
    responsibilities: ["Robot CAD", "Part drawings", "Design reviews", "Prototype planning"],
  },
  {
    slug: "business",
    name: "Business",
    icon: BadgeDollarSign,
    summary: "Business manages sponsorship, outreach records, awards documentation, and team communication.",
    responsibilities: ["Sponsor outreach", "Grant writing", "Impact documentation", "Event coordination"],
  },
  {
    slug: "media",
    name: "Media",
    icon: Camera,
    summary: "Media documents the team through photography, video, social media, graphics, and branding.",
    responsibilities: ["Photography", "Video editing", "Social media", "Graphic design"],
  },
  {
    slug: "strategy",
    name: "Strategy",
    icon: LineChart,
    summary: "Strategy studies match data, scouting notes, event schedules, and game plans for competition.",
    responsibilities: ["Scouting", "Match planning", "Data review", "Alliance strategy"],
  },
];
