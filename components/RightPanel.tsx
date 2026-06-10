"use client";

import { useEffect, useState } from "react";
import {
  Code2,
  GitBranch,
  LayoutKanban,
  Quote,
  Github,
  Linkedin,
  Twitter,
  FileText,
  ExternalLink,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "active" | "paused" | "done";

interface Project {
  name: string;
  status: ProjectStatus;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ProjectStatus, { dot: string; badge: string; label: string }> = {
  active: {
    dot: "bg-teal-400 shadow-[0_0_0_3px_rgba(45,212,191,0.2)]",
    badge: "bg-teal-400/10 text-teal-400",
    label: "Active",
  },
  paused: {
    dot: "bg-yellow-400/70",
    badge: "bg-yellow-400/10 text-yellow-300",
    label: "Paused",
  },
  done: {
    dot: "bg-green-400/70",
    badge: "bg-green-400/10 text-green-400",
    label: "Done",
  },
};

// Random-ish but deterministic commit activity (55 days, 7 rows × 8 cols)
const ACTIVITY_DATA = [
  0, 0, 0, 1, 0, 1, 2, 0, 1, 3, 2, 1, 0, 0, 2, 3, 4, 2, 1, 0, 0, 3, 4, 3, 2,
  1, 0, 0, 2, 1, 0, 3, 4, 3, 1, 0, 1, 2, 4, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 0,
  1, 3, 4, 3, 2,
];

const LEVEL_CLASSES = [
  "bg-white/5",
  "bg-teal-400/15",
  "bg-teal-400/35",
  "bg-teal-400/60",
  "bg-teal-400/90",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-widest font-semibold text-teal-400 flex items-center gap-1.5 mb-1">
      {children}
    </p>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 transition-colors duration-200 hover:border-teal-400/20 hover:bg-teal-400/[0.03] ${className}`}
    >
      {children}
    </div>
  );
}

function CardTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-widest text-white/35 font-medium flex items-center gap-1.5 mb-3">
      <Icon size={13} className="text-teal-400" />
      {children}
    </p>
  );
}

// ─── Activity Graph ───────────────────────────────────────────────────────────

function ActivityGraph() {
  const ROWS = 7;
  const cols = Math.ceil(ACTIVITY_DATA.length / ROWS);

  return (
    <GlassCard>
      <CardTitle icon={GitBranch}>Activity — last 3 months</CardTitle>

      <div className="flex gap-[3px]">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex flex-col gap-[3px]">
            {Array.from({ length: ROWS }).map((_, r) => {
              const idx = c * ROWS + r;
              const level = idx < ACTIVITY_DATA.length ? ACTIVITY_DATA[idx] : 0;
              return (
                <div
                  key={r}
                  className={`w-[11px] h-[11px] rounded-[2px] ${LEVEL_CLASSES[level]}`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[10px] text-white/30">Less</span>
        {LEVEL_CLASSES.map((cls, i) => (
          <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${cls}`} />
        ))}
        <span className="text-[10px] text-white/30">More</span>
      </div>
    </GlassCard>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────────────────

function QuickStats() {
  const stats = [
    { value: "4+", label: "Years exp." },
    { value: "32", label: "Projects" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="rounded-[10px] border border-white/[0.06] bg-white/[0.03] px-3 py-3.5 text-center"
        >
          <p className="text-[22px] font-bold text-white leading-none mb-1">
            {value.replace(/[+%]/, "")}
            <span className="text-teal-400">{value.match(/[+%]/)?.[0] ?? ""}</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-white/30">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Tech Stack ───────────────────────────────────────────────────────────────

function TechStack() {
  const primary = ["Next.js", "React", "TypeScript"];
  const secondary = ["Node.js", "Tailwind", "PostgreSQL", "Prisma", "Figma"];

  return (
    <GlassCard>
      <CardTitle icon={Code2}>Tech stack</CardTitle>
      <div className="flex flex-wrap gap-1.5">
        {primary.map((t) => (
          <span
            key={t}
            className="text-[11px] font-medium px-2.5 py-[3px] rounded-md border border-teal-400/20 bg-teal-400/[0.08] text-teal-400"
          >
            {t}
          </span>
        ))}
        {secondary.map((t) => (
          <span
            key={t}
            className="text-[11px] font-medium px-2.5 py-[3px] rounded-md border border-white/[0.08] bg-white/[0.04] text-white/50"
          >
            {t}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

// ─── Current Projects ─────────────────────────────────────────────────────────

function CurrentProjects({ projects }: { projects: Project[] }) {
  return (
    <GlassCard>
      <CardTitle icon={LayoutKanban}>Current projects</CardTitle>
      <div className="flex flex-col divide-y divide-white/5">
        {projects.map(({ name, status }) => {
          const c = STATUS_COLORS[status];
          return (
            <div key={name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
              <p className="text-[13px] text-white/85 font-medium flex-1">{name}</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${c.badge}`}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

// ─── Availability ─────────────────────────────────────────────────────────────

function Availability() {
  return (
    <GlassCard>
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
        <p className="text-[13px] text-white/70 flex-1">Available for new opportunities</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-400/10 text-green-400 px-2.5 py-0.5 rounded">
          Open
        </span>
      </div>
      <p className="mt-2.5 text-[12px] text-white/30">
        Typically responds within 24 hours · Remote / SF Bay Area
      </p>
    </GlassCard>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────

interface SocialLink {
  label: string;
  icon: React.ElementType;
  href: string;
}

function SocialLinks({ links }: { links: SocialLink[] }) {
  return (
    <div className="flex gap-2">
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] py-2.5 text-[12px] text-white/50 transition-colors duration-150 hover:border-teal-400/25 hover:bg-teal-400/[0.08] hover:text-teal-400"
        >
          <Icon size={15} />
          {label}
        </a>
      ))}
    </div>
  );
}

// ─── Today's Focus ────────────────────────────────────────────────────────────

interface FocusQuote {
  text: string;
  author: string;
}

function TodaysFocus({ quote }: { quote: FocusQuote }) {
  return (
    <GlassCard>
      <CardTitle icon={Quote}>Today's focus</CardTitle>
      <p className="text-[13px] text-white/45 leading-relaxed italic border-l-2 border-teal-400/40 pl-3">
        "{quote.text}"
      </p>
      <p className="mt-1.5 text-[11px] text-teal-400/60">— {quote.author}</p>
    </GlassCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface RightPanelProps {
  projects?: Project[];
  socialLinks?: SocialLink[];
  quote?: FocusQuote;
}

export default function RightPanel({
  projects = [
    { name: "AI Portfolio Dashboard", status: "active" },
    { name: "E-Commerce Platform v2", status: "active" },
    { name: "Design System Library", status: "paused" },
  ],
  socialLinks = [
    { label: "GitHub", icon: Github, href: "https://github.com" },
    { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { label: "Resume", icon: FileText, href: "#" },
  ],
  quote = {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
}: RightPanelProps) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      <QuickStats />
      <TechStack />
      <ActivityGraph />
      <CurrentProjects projects={projects} />
      <Availability />
      <SocialLinks links={socialLinks} />
      <TodaysFocus quote={quote} />
    </div>
  );
}
