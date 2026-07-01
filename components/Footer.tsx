import { meta } from "@/data/project";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 px-6 py-14 sm:px-10 lg:px-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl text-bone">{meta.siteName}</p>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-bone/45">
            An interactive explainer built from &ldquo;{meta.paperTitle}&rdquo; — {meta.authors}.
          </p>
        </div>
        <p className="font-mono text-[11px] text-bone/30">
          Built with Next.js · Tailwind · Framer Motion · Recharts
        </p>
      </div>
    </footer>
  );
}
