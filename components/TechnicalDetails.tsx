"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Code2, FlaskConical } from "lucide-react";
import type { Stage } from "@/data/project";

export default function TechnicalDetails({ stage }: { stage: Stage }) {
  const [openTech, setOpenTech] = useState(false);
  const [openCode, setOpenCode] = useState(false);

  if (!stage.technical && !stage.code) return null;

  return (
    <div className="mt-6 flex flex-col gap-3">
      {stage.technical && (
        <div className="glass rounded-2xl">
          <button
            onClick={() => setOpenTech((v) => !v)}
            className="focus-ring flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-bone">
              <FlaskConical size={15} className="text-manifold" />
              Technical detail
            </span>
            <ChevronDown
              size={16}
              className={`text-bone/50 transition-transform duration-300 ${
                openTech ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openTech && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="border-t border-bone/10 px-5 py-4 font-mono text-[13px] leading-relaxed text-bone/75">
                  {stage.technical}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {stage.code && stage.code.length > 0 && (
        <div className="glass rounded-2xl">
          <button
            onClick={() => setOpenCode((v) => !v)}
            className="focus-ring flex w-full items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-bone">
              <Code2 size={15} className="text-curvature" />
              Source code
            </span>
            <ChevronDown
              size={16}
              className={`text-bone/50 transition-transform duration-300 ${
                openCode ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence initial={false}>
            {openCode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-bone/10 px-2 pb-2 pt-2">
                  {stage.code.map((block) => (
                    <div key={block.label} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono text-bone/40">
                        <span>{block.label}</span>
                        <span>{block.lang}</span>
                      </div>
                      <pre className="overflow-x-auto rounded-xl bg-ink-950/60 p-4 text-[12.5px] leading-relaxed text-bone/90">
                        <code>{block.src}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
