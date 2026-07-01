"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { meta } from "@/data/project";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 lg:px-20">
      {/* signature: animated statistical-manifold grid */}
      <div className="manifold-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-manifold/20 blur-[120px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-0 h-[420px] w-[420px] rounded-full bg-curvature/15 blur-[120px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative mx-auto w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-eyebrow mb-6 font-mono text-xs uppercase text-manifold-light/80"
        >
          An interactive paper walkthrough
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[2.6rem] leading-[1.05] text-bone sm:text-6xl lg:text-7xl"
        >
          Bone density isn&rsquo;t
          <br />
          <span className="italic text-manifold-light">a number.</span>{" "}
          It&rsquo;s a <span className="text-curvature">geometry</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-7 max-w-xl text-balance text-base text-bone/65 sm:text-lg"
        >
          {meta.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34 }}
          className="mt-10 flex flex-wrap items-end gap-x-10 gap-y-6"
        >
          <div>
            <div className="font-display text-5xl text-curvature sm:text-6xl">
              {meta.headlineStat.value}
            </div>
            <div className="mt-1 text-xs text-bone/50">{meta.headlineStat.label}</div>
          </div>
          <div className="flex gap-8">
            {meta.supportingStats.map((s) => (
              <div key={s.label}>
                <div className="font-mono text-xl text-bone">{s.value}</div>
                <div className="mt-1 max-w-[8rem] text-[11px] text-bone/45">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <a
            href="#introduction"
            className="focus-ring group flex items-center gap-2 rounded-full bg-bone px-6 py-3 text-sm font-medium text-ink-950 transition hover:bg-bone/90"
          >
            Start the walkthrough
            <ArrowDown size={14} className="transition group-hover:translate-y-0.5" />
          </a>
          <a
            href="#architecture"
            className="focus-ring glass rounded-full px-6 py-3 text-sm font-medium text-bone transition hover:bg-bone/10"
          >
            Jump to architecture
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-bone/30"
      >
        <ArrowDown size={18} />
      </motion.div>
    </section>
  );
}
