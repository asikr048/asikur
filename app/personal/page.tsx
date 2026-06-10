"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin, Mail, Phone, Github, Linkedin, Twitter, Instagram,
  Youtube, Dribbble, Globe, FileText, Settings2,
  GraduationCap, Briefcase, Award, Code2, Zap, Users, Star,
} from "lucide-react";
import { useSiteConfig } from "@/lib/hooks/useSiteConfig";
import GlassCard, { CARD_PALETTE } from "@/components/GlassCard";

interface SkillGroup { name: string; items: string[]; }
interface SkillsData { groups: SkillGroup[]; }

interface CareerItem { id: string; type: string; title: string; org: string; years: string; }
interface CareerSection { title: string; items: CareerItem[]; }
interface CareerData { intro?: string; sections: CareerSection[]; }

// ── Count-up animation ──
function Counter({ value }: { value: string }) {
  const parts = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const [shown, setShown] = useState(parts ? "0" : value);

  useEffect(() => {
    if (!parts) { setShown(value); return; }
    const target = parseFloat(parts[2]);
    const decimals = parts[2].includes(".") ? 1 : 0;
    const dur = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown((target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!parts) return <>{value}</>;
  return <>{parts[1]}{shown}{parts[3]}</>;
}

const TYPE_ICON: Record<string, typeof Briefcase> = {
  "Bachelor": GraduationCap, "Master": GraduationCap,
  "Full-Time": Briefcase, "Intern": Code2,
  "Certificate": Award, "Freelance": Users,
};

export default function PersonalPage() {
  const cfg = useSiteConfig();
  const [skills, setSkills] = useState<SkillsData | null>(null);
  const [career, setCareer] = useState<CareerData | null>(null);

  useEffect(() => {
    fetch("/api/skills").then(r => r.json()).then(setSkills).catch(() => {});
    fetch("/api/career").then(r => r.json()).then(setCareer).catch(() => {});
  }, []);

  const contacts = [
    { icon: Mail,     label: "Email",     value: cfg.email,                         href: `mailto:${cfg.email}` },
    { icon: Phone,    label: "Phone",     value: cfg.phone,                         href: `tel:${cfg.phone}` },
    { icon: FileText, label: "Resume",    value: cfg.resumeURL ? "Download CV" : "", href: cfg.resumeURL },
    { icon: Github,   label: "GitHub",    value: cfg.github   ? "View profile" : "", href: cfg.github },
    { icon: Linkedin, label: "LinkedIn",  value: cfg.linkedin ? "View profile" : "", href: cfg.linkedin },
    { icon: Twitter,  label: "Twitter",   value: cfg.twitter  ? "View profile" : "", href: cfg.twitter },
    { icon: Instagram,label: "Instagram", value: cfg.instagram? "View profile" : "", href: cfg.instagram },
    { icon: Youtube,  label: "YouTube",   value: cfg.youtube  ? "View channel" : "", href: cfg.youtube },
    { icon: Dribbble, label: "Dribbble",  value: cfg.dribbble ? "View profile" : "", href: cfg.dribbble },
    { icon: Globe,    label: "Website",   value: cfg.website  ? "Visit site"   : "", href: cfg.website },
  ].filter(c => c.value);

  const stats = (cfg.stats ?? []).filter(s => s.value || s.label);

  // Flatten all career items into a single timeline (most-recent first)
  const timeline = career?.sections.flatMap(sec =>
    sec.items.map(item => ({ ...item, section: sec.title }))
  ) ?? [];

  return (
    <main className="h-screen w-screen overflow-y-auto md:pl-20 px-4 pb-24 md:pb-12 pt-8">
      <div className="max-w-4xl mx-auto fade-up">

        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1 font-syne" style={{ color: "hsl(var(--p))" }}>About</p>
          <h1 className="text-3xl font-bold font-syne text-white">Personal</h1>
        </div>

        {/* ── Top grid: profile + skills ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Profile card */}
          <GlassCard className="md:col-span-1 rounded-2xl p-6 flex flex-col items-center text-center gap-4 relative" depth={6}>
            {/* Admin login */}
            <Link
              href="https://asikur-mocha.vercel.app/admin/dashboard"
              target="_blank" rel="noopener noreferrer" title="Admin Panel"
              className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium font-syne transition-all duration-200 hover:scale-105"
              style={{ background: "hsl(var(--p) / 0.1)", border: "1px solid hsl(var(--p) / 0.25)", color: "hsl(var(--p))" }}
            >
              <Settings2 size={10} /> Admin
            </Link>

            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl overflow-hidden"
              style={{ border: "2px solid hsl(var(--p) / 0.3)", background: "hsl(210 60% 12%)" }}>
              {cfg.photoURL
                ? <img src={cfg.photoURL} alt="Profile" className="w-full h-full object-cover" style={{ objectPosition: cfg.photoFocus }} />
                : <div className="w-full h-full flex items-center justify-center text-4xl">🧑‍💻</div>}
            </div>

            {/* Name / role */}
            <div>
              <h2 className="text-white font-bold text-lg font-syne">{cfg.heroTitle}</h2>
              <p className="text-xs font-medium mt-0.5" style={{ color: "hsl(var(--p))" }}>{cfg.heroSubtitle}</p>
              {cfg.location && (
                <div className="flex items-center justify-center gap-1 mt-2 text-white/35 text-xs">
                  <MapPin size={10} /> {cfg.location}
                </div>
              )}
            </div>

            {cfg.aboutText && (
              <p className="text-white/45 text-xs leading-relaxed">{cfg.aboutText}</p>
            )}

            {/* Status badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs w-fit"
              style={{ background: "hsl(142 70% 45% / 0.1)", border: "1px solid hsl(142 70% 45% / 0.3)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
              <span className="text-white/60">Open to work</span>
            </div>

            {/* Contact links */}
            <div className="w-full flex flex-col gap-2 mt-auto">
              {contacts.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: "hsl(var(--p) / 0.05)", border: "1px solid hsl(var(--p) / 0.1)" }}>
                  <Icon size={13} style={{ color: "hsl(var(--p))" }} />
                  <span className="text-white/50 text-xs flex-1 truncate">{value}</span>
                </a>
              ))}
            </div>
          </GlassCard>

          {/* Skills */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {skills?.groups.map((group, gi) => {
              const accent = CARD_PALETTE[gi % CARD_PALETTE.length];
              return (
                <GlassCard key={group.name} accent={accent} className="rounded-2xl p-5" depth={6}>
                  <p className="text-xs uppercase tracking-widest mb-3 font-syne" style={{ color: `hsl(${accent})` }}>{group.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map(skill => (
                      <span key={skill}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 cursor-default"
                        style={{ background: `hsl(${accent} / 0.1)`, color: "hsl(195,70%,82%)", border: `1px solid hsl(${accent} / 0.22)` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* ── Stats row ── */}
        {stats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Star,      color: CARD_PALETTE[0] },
              { icon: Briefcase, color: CARD_PALETTE[1] },
              { icon: Users,     color: CARD_PALETTE[2] },
              { icon: Zap,       color: CARD_PALETTE[4] },
            ].slice(0, stats.length).map(({ icon: Icon, color }, i) => (
              <GlassCard key={i} accent={color} className="rounded-2xl p-4 text-center" depth={5}>
                <Icon size={16} className="mx-auto mb-2" style={{ color: `hsl(${color})` }} />
                <p className="font-syne font-extrabold text-2xl" style={{ color: `hsl(${color})` }}>
                  <Counter value={stats[i].value} />
                </p>
                <p className="text-white/40 text-[11px] mt-0.5 leading-tight">{stats[i].label}</p>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ── Career timeline ── */}
        {timeline.length > 0 && (
          <div className="mt-4">
            <GlassCard className="rounded-2xl p-6" depth={5}>
              <p className="text-xs uppercase tracking-widest mb-5 font-syne" style={{ color: "hsl(var(--p))" }}>
                Career &amp; Education
              </p>
              <div className="relative flex flex-col gap-0">
                {/* vertical line */}
                <div className="absolute left-[18px] top-3 bottom-3 w-px"
                  style={{ background: "linear-gradient(180deg, hsl(var(--p) / 0.5), hsl(var(--p2) / 0.2))" }} />

                {timeline.map((item, i) => {
                  const Icon = TYPE_ICON[item.type] ?? Briefcase;
                  const accent = CARD_PALETTE[i % CARD_PALETTE.length];
                  return (
                    <div key={item.id} className="relative flex items-start gap-4 pb-5 last:pb-0 group">
                      {/* dot + icon */}
                      <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: `hsl(${accent} / 0.15)`,
                          border: `1px solid hsl(${accent} / 0.35)`,
                          boxShadow: `0 0 12px hsl(${accent} / 0.15)`,
                        }}>
                        <Icon size={15} style={{ color: `hsl(${accent})` }} />
                      </div>
                      {/* text */}
                      <div className="flex-1 pt-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-white/85 text-sm font-semibold font-syne leading-tight">{item.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                            style={{ background: `hsl(${accent} / 0.12)`, color: `hsl(${accent})`, border: `1px solid hsl(${accent} / 0.2)` }}>
                            {item.years}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">{item.org}
                          <span className="ml-2 opacity-60">· {item.type}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}

      </div>
    </main>
  );
}
