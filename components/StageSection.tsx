import { ReactNode } from "react";
import type { Stage } from "@/data/project";
import Reveal from "./Reveal";
import TechnicalDetails from "./TechnicalDetails";
import { Check } from "lucide-react";

export default function StageSection({
  stage,
  visual,
  reverse = false,
}: {
  stage: Stage;
  visual?: ReactNode;
  reverse?: boolean;
}) {
  return (
    <section
      id={stage.id}
      className="scroll-mt-28 border-t border-bone/[0.06] px-6 py-20 sm:px-10 lg:px-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid items-start gap-12 lg:grid-cols-12 lg:gap-16 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="lg:col-span-5">
            <Reveal>
              <span className="font-mono text-xs text-curvature">{stage.index}</span>
              <p className="text-eyebrow mt-2 font-mono text-[11px] uppercase text-bone/40">
                {stage.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
                {stage.title}
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-bone/70">
                {stage.plain}
              </p>

              {stage.bullets && (
                <ul className="mt-6 flex flex-col gap-3">
                  {stage.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-bone/65">
                      <Check size={15} className="mt-0.5 shrink-0 text-manifold" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              <TechnicalDetails stage={stage} />
            </Reveal>
          </div>

          {visual && (
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>{visual}</Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
