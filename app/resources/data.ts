import { BookOpen, FileText, Presentation, Wrench, type LucideIcon } from "lucide-react";

export type ResourceDocument = {
  title: string;
  description: string;
  href?: string;
  category: string;
  icon: LucideIcon;
};

export const resourceDocuments: ResourceDocument[] = [
  {
    title: "2026 IMPACT Binder",
    description: "Impact documentation, outreach records, team story, and award reference material.",
    href: "/resources/2026-impact-binder.pdf",
    category: "Impact",
    icon: BookOpen,
  },
  {
    title: "2026 Machine Attributes Binder",
    description: "Robot and machine documentation for technical review and reference.",
    href: "/resources/2026-machine-attributes-binder.pdf",
    category: "Robot",
    icon: Wrench,
  },
  {
    title: "2026 One-Pagers",
    description: "One-page examples for IMPACT, team attributes, machine attributes, and CompSocrates.",
    href: "/resources/2026-one-pagers.pdf",
    category: "Examples",
    icon: FileText,
  },
  {
    title: "2026 IMPACT Presentation",
    description: "Presentation slides and materials will be added here later.",
    category: "Coming Soon",
    icon: Presentation,
  },
];
