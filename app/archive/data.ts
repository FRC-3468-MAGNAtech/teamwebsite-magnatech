export type Season = {
  year: string;
  game: string;
  robotName?: string;
  robotSymbol?: string;
  robotPhoto?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  slug: string;
  summary: string;
  events: string[];
  seniors: string[];
};

export const seasons: Season[] = [
  {
    year: "2027",
    game: "BIOCORE",
    robotName: "BIOCORE",
    robotSymbol: "/robot-symbols/cropped/biocore.png",
    slug: "2027",
    summary: "The upcoming season begins with training, sponsor growth, and a new challenge reveal.",
    events: ["Kickoff", "Build season", "Competition season"],
    seniors: ["Senior spotlight coming soon"],
  },
  {
    year: "2026",
    game: "REBUILT",
    robotName: "KRONOS",
    robotSymbol: "/robot-symbols/cropped/kronos.png",
    robotPhoto: {
      src: "/photos/robots/kronos.jpg",
      alt: "Kronos robot",
      width: 633,
      height: 489,
    },
    slug: "2026",
    summary: "REBUILT season archive for robot photos, technical details, event results, and team highlights.",
    events: ["Kickoff", "Robot reveal", "Regional events"],
    seniors: ["Senior spotlight coming soon"],
  },
  {
    year: "2025",
    game: "REEFSCAPE",
    robotName: "POSEIDON",
    robotSymbol: "/robot-symbols/cropped/poseidon.png",
    robotPhoto: {
      src: "/photos/robots/poseidon.jpeg",
      alt: "Poseidon robot",
      width: 2048,
      height: 1152,
    },
    slug: "2025",
    summary: "REEFSCAPE captures the lessons, outreach, awards, and robot story from a full competition season.",
    events: ["Kickoff", "Build season", "Competition events"],
    seniors: ["Senior spotlight coming soon"],
  },
  {
    year: "2024",
    game: "CRESCENDO",
    robotName: "TALOS",
    robotSymbol: "/robot-symbols/cropped/talos.png",
    robotPhoto: {
      src: "/photos/robots/talos.jpg",
      alt: "Talos robot",
      width: 4000,
      height: 4000,
    },
    slug: "2024",
    summary: "CRESCENDO season archive for robot media, events, outreach, and team milestones.",
    events: ["Kickoff", "Build season", "Competition events"],
    seniors: ["Senior spotlight coming soon"],
  },
  {
    year: "2023",
    game: "CHARGED UP",
    robotName: "HYDRA",
    robotSymbol: "/robot-symbols/cropped/hydra.png",
    robotPhoto: {
      src: "/photos/robots/hydra.jpg",
      alt: "Hydra robot",
      width: 406,
      height: 661,
    },
    slug: "2023",
    summary: "CHARGED UP season archive for robot media, events, outreach, and team milestones.",
    events: ["Kickoff", "Build season", "Competition events"],
    seniors: ["Senior spotlight coming soon"],
  },
  {
    year: "2022",
    game: "RAPID REACT",
    robotName: "TIM",
    robotSymbol: "/robot-symbols/cropped/tim.png",
    slug: "2022",
    summary: "RAPID REACT season archive for robot media, events, outreach, and team milestones.",
    events: ["Kickoff", "Build season", "Competition events"],
    seniors: ["Senior spotlight coming soon"],
  },
];

export const programs = [
  {
    slug: "ftc",
    name: "FTC",
    title: "FIRST Tech Challenge",
    teams: ["Team 1", "Team 2"],
    summary: "FTC outreach documentation for mentoring, team creation, events, and program support.",
  },
  {
    slug: "fll",
    name: "FLL",
    title: "FIRST LEGO League",
    teams: ["Team 1", "Team 2"],
    summary: "FLL outreach documentation for mentoring, camps, demonstrations, and team support.",
  },
];
