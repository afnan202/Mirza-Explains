"use client";

import { useState } from "react";
import { Check, Copy, FileText, ExternalLink } from "lucide-react";
import Reveal from "./Reveal";
import { publication } from "@/data/project";

export default function PublishedAs() {
  const [copied, setCopied] = useState(false);

  async function copyBibtex() {
    try {
      await navigator.clipboard.writeText(publication.bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <section
      id="publication"
      className="scroll-mt-28 border-t border-bone/[0.06] px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-mono text-xs text-curvature">Published</span>
          <p className="text-eyebrow mt-2 font-mono text-[11px] uppercase text-bone/40">
            Peer-reviewed venue
          </p>
          <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
            This work is a published conference paper
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-strong mt-10 rounded-3xl p-6 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-manifold-light">
                  <FileText size={18} />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-bone/40">
                    {publication.publisher} · {publication.dateOfConference}
                  </p>
                  <p className="text-xs text-bone/40">{publication.location}</p>
                </div>
              </div>
              <div className="flex gap-3 text-right">
                <div>
                  <div className="font-mono text-lg text-curvature">{publication.accuracy}</div>
                  <div className="text-[10px] text-bone/40">accuracy</div>
                </div>
                <div>
                  <div className="font-mono text-lg text-curvature">{publication.kappa}</div>
                  <div className="text-[10px] text-bone/40">kappa</div>
                </div>
              </div>
            </div>

            <h3 className="mt-6 font-display text-xl leading-snug text-bone sm:text-2xl">
              {publication.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-bone/60">
              {publication.venue}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={publication.abstractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-bone/90"
              >
                View on IEEE Xplore
                <ExternalLink size={13} />
              </a>
              <a
                href={publication.doiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring glass rounded-full px-5 py-2.5 text-sm font-mono text-bone/70 transition hover:text-bone"
              >
                doi.org/{publication.doi}
              </a>
              <button
                onClick={copyBibtex}
                className="focus-ring glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-bone/70 transition hover:text-bone"
              >
                {copied ? <Check size={14} className="text-risk-normal" /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy BibTeX"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
