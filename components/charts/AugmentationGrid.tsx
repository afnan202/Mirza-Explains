"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const techniques = [
  { name: "Random Resized Crop", param: "scale 0.7–1.0", why: "Partial bone visibility" },
  { name: "Horizontal Flip", param: "p = 0.5", why: "Bilateral knee symmetry" },
  { name: "Vertical Flip", param: "p = 0.1", why: "DICOM orientation artifacts" },
  { name: "Rotation", param: "±20°", why: "Patient positioning variability" },
  { name: "Affine Translation", param: "±33%", why: "Landmark displacement" },
  { name: "Brightness / Contrast", param: "±40%", why: "kVp / mAs exposure variation" },
  { name: "Sharpness Jitter", param: "±90%", why: "Reconstruction kernel variation" },
  { name: "Histogram Equalization", param: "adaptive", why: "Low-contrast bone enhancement" },
  { name: "MixUp", param: "α = 0.4", why: "Class boundary generalization" },
  { name: "CutMix", param: "α = 1.0", why: "Local texture preservation" },
  { name: "Random Erasing", param: "p = 0.2", why: "Artifact robustness" },
  { name: "8-fold TTA", param: "test only", why: "Stable inference averaging" },
];

export default function AugmentationGrid() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">Augmentation protocol</h4>
      <p className="mb-5 text-xs text-bone/50">
        Train only — validation and test see resize + normalize only. Tap a tile.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {techniques.map((t, i) => (
          <motion.button
            key={t.name}
            onClick={() => setActive(active === i ? null : i)}
            whileHover={{ y: -2 }}
            className={`focus-ring rounded-xl border px-3 py-3 text-left transition ${
              active === i
                ? "border-manifold/50 bg-manifold/10"
                : "border-bone/10 bg-bone/[0.02] hover:border-bone/20"
            }`}
          >
            <p className="text-xs font-medium text-bone">{t.name}</p>
            <p className="mt-1 font-mono text-[10.5px] text-curvature">{t.param}</p>
          </motion.button>
        ))}
      </div>
      <div className="mt-4 min-h-[1.5rem] text-xs text-bone/55">
        {active !== null ? techniques[active].why : "Each transform mimics a real source of radiographic variation."}
      </div>
    </div>
  );
}
