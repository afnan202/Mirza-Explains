"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { confusionMatrix } from "@/data/project";

export default function ConfusionMatrixGrid() {
  const { labels, matrix } = confusionMatrix;
  const max = Math.max(...matrix.flat());
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">Confusion matrix</h4>
      <p className="mb-6 text-xs text-bone/50">
        Rows: true label · Columns: predicted label. Hover a cell.
      </p>

      <div className="flex">
        <div className="mr-2 flex flex-col justify-around py-6 text-right text-[11px] text-bone/45">
          {labels.map((l) => (
            <div key={l} style={{ writingMode: "horizontal-tb" }} className="h-16 flex items-center justify-end pr-1">
              {l}
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}
          >
            {matrix.map((row, r) =>
              row.map((v, c) => {
                const intensity = v / max;
                const isDiag = r === c;
                return (
                  <motion.div
                    key={`${r}-${c}`}
                    onMouseEnter={() => setHover({ r, c })}
                    onMouseLeave={() => setHover(null)}
                    whileHover={{ scale: 1.05 }}
                    className="relative flex aspect-square items-center justify-center rounded-xl text-sm font-mono font-medium"
                    style={{
                      background: isDiag
                        ? `rgba(63,185,126,${0.18 + intensity * 0.55})`
                        : `rgba(224,88,75,${0.08 + intensity * 0.45})`,
                      border: `1px solid ${
                        isDiag
                          ? "rgba(63,185,126,0.4)"
                          : "rgba(224,88,75,0.25)"
                      }`,
                      color: "#F2EDE4",
                    }}
                  >
                    {v}
                  </motion.div>
                );
              })
            )}
          </div>
          <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
            {labels.map((l) => (
              <div key={l} className="text-center text-[11px] text-bone/45">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 min-h-[2rem] text-xs text-bone/60">
        {hover ? (
          <span className="font-mono">
            True {labels[hover.r]} → Predicted {labels[hover.c]}:{" "}
            <span className="text-bone">{matrix[hover.r][hover.c]}</span> samples
          </span>
        ) : (
          <span>Diagonal cells (green) are correct predictions.</span>
        )}
      </div>
    </div>
  );
}
