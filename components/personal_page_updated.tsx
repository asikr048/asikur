/**
 * app/personal/page.tsx
 *
 * Drop-in replacement for your existing personal page.
 * The only change is wrapping the existing content in a two-column
 * grid so the new RightPanel fills the previously empty right area.
 *
 * Nothing in your existing left-column JSX needs to change —
 * paste it back in where it says {/* ← your existing card JSX here *\/}.
 */

import RightPanel from "@/components/RightPanel"; // adjust path if needed

export default function PersonalPage() {
  return (
    <div className="w-full min-h-screen px-6 py-8">

      {/* Page heading — keep exactly as you have it */}
      <p className="text-xs uppercase tracking-widest text-teal-400 font-semibold mb-1">
        About
      </p>
      <h1 className="text-3xl font-bold text-white mb-8">Personal</h1>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,_420px)_1fr] gap-6 items-start">

        {/* ── Left column: your existing profile card ─────────────────── */}
        <div>
          {/* ← paste your existing card JSX here, unchanged */}
        </div>

        {/* ── Right column: new panel that fills the empty space ──────── */}
        <div className="hidden xl:block">
          <RightPanel
            projects={[
              { name: "AI Portfolio Dashboard", status: "active" },
              { name: "E-Commerce Platform v2", status: "active" },
              { name: "Design System Library", status: "paused" },
            ]}
            socialLinks={[
              { label: "GitHub",   icon: "Github",   href: "https://github.com/yourhandle" },
              { label: "LinkedIn", icon: "Linkedin",  href: "https://linkedin.com/in/yourhandle" },
              { label: "Twitter",  icon: "Twitter",   href: "https://twitter.com/yourhandle" },
              { label: "Resume",   icon: "FileText",  href: "/resume.pdf" },
            ]}
            quote={{
              text: "First, solve the problem. Then, write the code.",
              author: "John Johnson",
            }}
          />
        </div>

      </div>
    </div>
  );
}
