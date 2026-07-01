"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { pipelineNodes, pipelineEdges } from "@/data/project";

const nodeDescriptions: Record<string, string> = {
  input: "A 224×224 RGB knee radiograph enters the network.",
  stage1: "Early convolutional stage extracts low-level edges and textures.",
  stage2: "28×28×512 features — local texture and fine-grained detail.",
  fa1: "Fisher-Rao distance to a learned prior reweights this scale's features.",
  stage3: "14×14×1024 features — mid-level structural patterns emerge.",
  fa2: "A second, independent Fisher prior tunes attention for mid-level structure.",
  stage4: "7×7×2048 features — receptive field now covers nearly the whole image.",
  fa3: "Deepest Fisher attention scale, tuned for global structural deviation.",
  curvature: "Gaussian curvature weights geometrically informative regions before pooling.",
  ib: "A variational bottleneck compresses the representation, keeping only what predicts the class.",
  output: "Softmax produces calibrated probabilities for Normal / Osteopenia / Osteoporosis.",
};

function isAttention(id: string) {
  return id.startsWith("fa");
}

export default function PipelineDiagram() {
  const [active, setActive] = useState<string | null>(null);
  const find = (id: string) => pipelineNodes.find((n) => n.id === id)!;

  return (
    <div className="relative w-full">
      <div className="glass-strong relative w-full overflow-x-auto rounded-3xl p-4 sm:p-8">
        <svg
          viewBox="0 0 100 70"
          className="h-[340px] w-full min-w-[720px] sm:h-[420px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(242,237,228,0.35)" />
            </marker>
          </defs>

          {/* edges */}
          {pipelineEdges.map(([from, to], i) => {
            const a = find(from);
            const b = find(to);
            const x1 = a.x,
              y1 = a.y,
              x2 = b.x,
              y2 = b.y;
            const isVertical = Math.abs(x1 - x2) < 1;
            const path = isVertical
              ? `M ${x1} ${y1} L ${x2} ${y2}`
              : `M ${x1 + 3} ${y1} C ${(x1 + x2) / 2} ${y1}, ${
                  (x1 + x2) / 2
                } ${y2}, ${x2 - 3} ${y2}`;
            const dimmed =
              active && from !== active && to !== active ? 0.18 : 0.75;
            return (
              <motion.path
                key={i}
                d={path}
                fill="none"
                stroke={
                  isAttention(to) || isAttention(from)
                    ? "rgba(232,163,61,0.55)"
                    : "rgba(62,107,255,0.55)"
                }
                strokeWidth={0.45}
                markerEnd="url(#arrowhead)"
                strokeDasharray="2 2"
                animate={{ strokeDashoffset: [8, 0], opacity: dimmed }}
                transition={{
                  strokeDashoffset: {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: { duration: 0.25 },
                }}
              />
            );
          })}

          {/* nodes */}
          {pipelineNodes.map((n, i) => {
            const attn = isAttention(n.id);
            const isOutput = n.id === "output" || n.id === "input";
            const w = attn ? 13 : 11;
            const h = attn ? 9 : 11;
            const dimmed = active && active !== n.id ? 0.45 : 1;
            return (
              <g
                key={n.id}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive((a) => (a === n.id ? null : n.id))}
              >
                <motion.rect
                  x={n.x - w / 2}
                  y={n.y - h / 2}
                  width={w}
                  height={h}
                  rx={attn ? 4.5 : 2.2}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: dimmed, scale: 1 }}
                  animate={{ opacity: dimmed }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  fill={
                    attn
                      ? "rgba(232,163,61,0.14)"
                      : isOutput
                      ? "rgba(63,185,126,0.14)"
                      : "rgba(62,107,255,0.12)"
                  }
                  stroke={
                    attn
                      ? "#E8A33D"
                      : isOutput
                      ? "#3FB97E"
                      : "#3E6BFF"
                  }
                  strokeWidth={active === n.id ? 0.6 : 0.32}
                />
                <text
                  x={n.x}
                  y={n.y - 0.6}
                  textAnchor="middle"
                  fontSize={attn ? 2.5 : 2.7}
                  fontFamily="var(--font-inter)"
                  fontWeight={600}
                  fill="#F2EDE4"
                  opacity={dimmed}
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y + 2.4}
                  textAnchor="middle"
                  fontSize={2.1}
                  fontFamily="var(--font-jbmono)"
                  fill="rgba(242,237,228,0.55)"
                  opacity={dimmed}
                >
                  {n.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 min-h-[3.2rem] px-1">
        <motion.p
          key={active ?? "default"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-bone/65"
        >
          {active
            ? nodeDescriptions[active]
            : "Hover or tap a block to see what happens at that stage."}
        </motion.p>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 px-1 text-xs text-bone/50">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-manifold" /> Backbone stage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-curvature" /> Fisher attention
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-risk-normal" /> Input / output
        </span>
      </div>
    </div>
  );
}
