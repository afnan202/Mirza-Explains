"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { stages } from "@/data/project";

export default function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  const [active, setActive] = useState(stages[0].id);

  useEffect(() => {
    const sections = stages
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* top progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left bg-gradient-to-r from-manifold via-curvature to-manifold"
      />

      {/* dot rail, desktop only */}
      <nav
        aria-label="Section progress"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {stages.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-2"
            aria-current={active === s.id}
          >
            <span
              className={`pointer-events-none whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-mono opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                active === s.id
                  ? "glass text-bone opacity-100"
                  : "glass text-bone/60"
              }`}
            >
              {s.index} · {s.title}
            </span>
            <span
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                active === s.id
                  ? "scale-125 bg-manifold shadow-[0_0_0_4px_rgba(62,107,255,0.25)]"
                  : "bg-bone/25 group-hover:bg-bone/50"
              }`}
            />
          </a>
        ))}
      </nav>
    </>
  );
}
