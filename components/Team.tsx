"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { team } from "@/data/project";

const roleColor: Record<string, string> = {
  "Lead Author": "text-manifold-light border-manifold/30 bg-manifold/10",
  "Co-Author": "text-curvature border-curvature/30 bg-curvature/10",
  Supervisor: "text-risk-normal border-risk-normal/30 bg-risk-normal/10",
};

export default function Team() {
  return (
    <section
      id="team"
      className="scroll-mt-28 border-t border-bone/[0.06] px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="font-mono text-xs text-curvature">Team</span>
          <p className="text-eyebrow mt-2 font-mono text-[11px] uppercase text-bone/40">
            Who built this
          </p>
          <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
            The people behind IG-CNN
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="glass-strong group overflow-hidden rounded-3xl"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-900">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide ${
                      roleColor[member.role] ??
                      "border-bone/20 bg-bone/5 text-bone/60"
                    }`}
                  >
                    {member.role}
                  </span>
                  <h3 className="mt-3 font-display text-xl text-bone">
                    {member.name}
                  </h3>
                  {member.affiliation && (
                    <p className="mt-1 text-xs text-bone/45">{member.affiliation}</p>
                  )}
                  {member.links && member.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring flex items-center gap-1 rounded-full bg-bone/5 px-3 py-1.5 text-[11px] text-bone/60 transition hover:bg-bone/10 hover:text-bone"
                        >
                          {l.label}
                          <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
