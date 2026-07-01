"use client";

import Reveal from "../Reveal";
import { stages } from "@/data/project";

export default function Roadmap() {
  const items = stages.find((s) => s.id === "conclusion")?.bullets ?? [];
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">What&apos;s next</h4>
      <div className="relative mt-6 flex flex-col gap-7 pl-6">
        <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-manifold via-curvature to-transparent" />
        {items.map((item, i) => (
          <Reveal key={item} delay={i * 0.08}>
            <div className="relative">
              <span className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-ink-950 bg-manifold" />
              <p className="text-sm text-bone/75">{item}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
