"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const modes = [
  {
    id: "normal",
    label: "Normal (Label 0)",
    desc: "Attention centers on the tibial shaft.",
    spot: { x: 50, y: 62 },
    color: "#3FB97E",
  },
  {
    id: "osteopenia",
    label: "Osteopenia (Label 1)",
    desc: "Attention concentrates at the joint space and medial compartment.",
    spot: { x: 50, y: 38 },
    color: "#E8A33D",
  },
];

export default function AttentionMapDemo() {
  const [mode, setMode] = useState(modes[1]);

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-display text-lg text-bone">Where Fisher attention looks</h4>
        <div className="glass flex gap-1 rounded-full p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m)}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                mode.id === m.id ? "bg-manifold text-white" : "text-bone/60 hover:text-bone"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-2xl bg-ink-950/40">
        {/* schematic knee silhouette */}
        <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full">
          <rect x="38" y="0" width="24" height="58" rx="6" fill="rgba(242,237,228,0.12)" />
          <ellipse cx="50" cy="64" rx="22" ry="16" fill="rgba(242,237,228,0.1)" />
          <rect x="40" y="76" width="20" height="62" rx="6" fill="rgba(242,237,228,0.12)" />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${mode.spot.x}% ${mode.spot.y}%, ${mode.color}99 0%, ${mode.color}33 22%, transparent 50%)`,
            }}
          />
        </AnimatePresence>

        <span className="absolute bottom-2 left-2 rounded-full bg-ink-950/70 px-2 py-1 text-[9px] font-mono text-bone/50">
          schematic — not a real radiograph
        </span>
      </div>

      <p className="mt-4 text-center text-xs text-bone/55">{mode.desc}</p>
    </div>
  );
}
