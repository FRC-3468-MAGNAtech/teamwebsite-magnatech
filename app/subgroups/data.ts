import {
  BadgeDollarSign,
  Camera,
  Code2,
  DraftingCompass,
  LineChart,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type SubgroupFocusArea = {
  name: string;
  description: string;
};

export type Subgroup = {
  slug: string;
  name: string;
  icon: LucideIcon;
  summary: string;
  focusAreas: SubgroupFocusArea[];
  parentSlug?: string;
};

export const subgroups: Subgroup[] = [
  {
    slug: "build",
    name: "Build",
    icon: Wrench,
    summary: "Build handles shop upkeep, fabrication, assembly, wiring, and maintenance of the competition robot.",
    focusAreas: [
      { name: "Mechanical", description: "Shop upkeep, fabrication, assembly, and maintenance of the physical robot." },
      { name: "Electrical", description: "Wiring the robot, sensor integration, and air-pressure systems." },
    ],
  },
  {
    slug: "programming",
    name: "Programming",
    icon: Code2,
    summary: "Programming writes the robot's code, from autonomous routines to weekly drive practice and vision processing.",
    focusAreas: [
      { name: "Programming/Software", description: "Java/C++ coding, autonomous routines, weekly drive practice routines, and vision processing." },
    ],
  },
  {
    slug: "cad-design",
    name: "CAD and Design",
    icon: DraftingCompass,
    summary: "CAD models and 3-D prints robot parts and giveaways, working as part of the Build subgroup.",
    focusAreas: [
      { name: "3-D Design", description: "Using Bambu Studio to 3-D print robot parts, team giveaways for competition, and outreach." },
      { name: "CAD/Prototyping", description: "Using Onshape to model the robot before it is built and CAM files for the CNC machine." },
    ],
    parentSlug: "build",
  },
  {
    slug: "business",
    name: "Business",
    icon: BadgeDollarSign,
    summary: "Business manages marketing, awards documentation, grant applications, and sponsor relations.",
    focusAreas: [
      { name: "Marketing", description: "Use Canva or Adobe to share documents pertaining to team branding, t-shirt designs, and giveaway designs." },
      { name: "Awards", description: "Working on submitted awards, grant applications, documentation, and sponsor relations." },
    ],
  },
  {
    slug: "media",
    name: "Media",
    icon: Camera,
    summary: "Media documents the team through photography, video, and social media, working as part of the Business subgroup.",
    focusAreas: [
      { name: "Digital Media", description: "Photography; video/photo editing using Adobe, and collaborating on social media ideas and scheduling social media posts." },
    ],
    parentSlug: "business",
  },
  {
    slug: "strategy",
    name: "Strategy",
    icon: LineChart,
    summary: "Strategy studies match data and builds game-play tactics, working as part of the Business subgroup.",
    focusAreas: [
      { name: "Lead Scouting/Strategy", description: "Data analyzing match data and determining game-play tactics. Mock kickoff and strategy trainings." },
    ],
    parentSlug: "business",
  },
];

export function getSubgroupChildren(slug: string) {
  return subgroups.filter((subgroup) => subgroup.parentSlug === slug);
}

export function getSubgroupParent(subgroup: Subgroup) {
  return subgroup.parentSlug ? subgroups.find((item) => item.slug === subgroup.parentSlug) : undefined;
}
