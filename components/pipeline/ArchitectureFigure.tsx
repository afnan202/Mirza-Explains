"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type NodeId =
  | "input"
  | "stage1"
  | "stage2"
  | "stage3"
  | "stage4"
  | "fa1"
  | "fa2"
  | "fa3"
  | "curvature"
  | "bottleneck"
  | "output";

const descriptions: Record<NodeId, string> = {
  input: "A 224×224×3 knee radiograph enters the network.",
  stage1: "Stage 1 — earliest convolutions, extracting low-level edges and textures.",
  stage2: "Stage 2 output — 28×28×512. Feeds Fisher Attention ① for fine-grained local texture.",
  stage3: "Stage 3 output — 14×14×1024. Feeds Fisher Attention ② for mid-level structural patterns.",
  stage4: "Stage 4 output — 7×7×2048. Feeds Fisher Attention ③, receptive field now covers ~420×420 input pixels.",
  fa1: "Fisher Attention ①: μ and σ² convolutions define a Gaussian per location; Fisher-Rao distance to a learned prior sets attention α, applied with a residual add.",
  fa2: "Fisher Attention ②: the same mechanism, independent learnable prior tuned for mid-level structure.",
  fa3: "Fisher Attention ③: deepest scale, tuned for global structural deviation across nearly the whole image.",
  curvature: "Manifold Curvature Pooling: Gaussian curvature weights geometrically informative regions — edges, ridges, boundaries — before pooling to a 2048-dim vector.",
  bottleneck: "Information Bottleneck: a variational layer compresses the representation, trading I(X;Z) against I(Z;Y) to keep only what predicts the class.",
  output: "Softmax produces calibrated probabilities across Normal / Osteopenia / Osteoporosis.",
};

const stageConfigs = [
  { id: "stage1" as NodeId, label: "Stage 1", dims: "", x0: 190, size: 108 },
  { id: "stage2" as NodeId, label: "Stage 2", dims: "28×28×512", x0: 420, size: 92 },
  { id: "stage3" as NodeId, label: "Stage 3", dims: "14×14×1024", x0: 650, size: 76 },
  { id: "stage4" as NodeId, label: "Stage 4", dims: "7×7×2048", x0: 862, size: 60 },
];

const CY = 195; // vertical center line for backbone cubes

const attnConfigs = [
  { id: "fa1" as NodeId, num: 1, sourceX: 420 + 92 / 2, x: 372 },
  { id: "fa2" as NodeId, num: 2, sourceX: 650 + 76 / 2, x: 594 },
  { id: "fa3" as NodeId, num: 3, sourceX: 862 + 60 / 2, x: 796 },
];
const ATTN_W = 195;
const ATTN_Y = 380;
const ATTN_H = 260;

const OFF = 0.22; // isometric offset ratio for cube 3D effect

function Cube({
  x0,
  size,
  active,
  dimmed,
}: {
  x0: number;
  size: number;
  active: boolean;
  dimmed: boolean;
}) {
  const top = CY - size / 2;
  const off = size * OFF;
  const opacity = dimmed ? 0.35 : 1;
  return (
    <g opacity={opacity} style={{ transition: "opacity 0.25s" }}>
      {/* right face */}
      <polygon
        points={`${x0 + size},${top} ${x0 + size},${top + size} ${x0 + size + off},${
          top + size - off
        } ${x0 + size + off},${top - off}`}
        fill="#121729"
        stroke={active ? "#3E6BFF" : "rgba(62,107,255,0.35)"}
        strokeWidth={active ? 1.4 : 0.8}
      />
      {/* top face */}
      <polygon
        points={`${x0},${top} ${x0 + size},${top} ${x0 + size + off},${top - off} ${
          x0 + off
        },${top - off}`}
        fill="#2A3454"
        stroke={active ? "#3E6BFF" : "rgba(62,107,255,0.35)"}
        strokeWidth={active ? 1.4 : 0.8}
      />
      {/* front face */}
      <rect
        x={x0}
        y={top}
        width={size}
        height={size}
        fill="#1B2338"
        stroke={active ? "#3E6BFF" : "rgba(62,107,255,0.4)"}
        strokeWidth={active ? 1.6 : 1}
      />
    </g>
  );
}

function AttentionBlock({
  x,
  num,
  active,
  dimmed,
}: {
  x: number;
  num: number;
  active: boolean;
  dimmed: boolean;
}) {
  const y = ATTN_Y;
  const w = ATTN_W;
  const h = ATTN_H;
  const opacity = dimmed ? 0.35 : 1;
  const stroke = active ? "#E8A33D" : "rgba(224,88,75,0.4)";

  return (
    <g opacity={opacity} style={{ transition: "opacity 0.25s" }}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="rgba(224,88,75,0.06)"
        stroke={stroke}
        strokeWidth={active ? 1.6 : 1}
      />
      <rect
        x={x}
        y={y}
        width={w}
        height={38}
        rx={12}
        fill="rgba(224,88,75,0.22)"
      />
      <rect x={x} y={y + 18} width={w} height={20} fill="rgba(224,88,75,0.22)" />
      <circle cx={x + 26} cy={y + 19} r={12} fill="#E0584B" />
      <text x={x + 26} y={y + 23} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0A0C10">
        {num}
      </text>
      <text x={x + 46} y={y + 24} fontSize={13} fontWeight={600} fill="#F2EDE4">
        Fisher Attention
      </text>

      {/* Conv mu / sigma boxes */}
      <rect x={x + 16} y={y + 56} width={70} height={28} rx={5} fill="rgba(62,107,255,0.12)" stroke="#3E6BFF" strokeWidth={0.8} />
      <text x={x + 51} y={y + 74} textAnchor="middle" fontSize={11} fill="#A9BFFF" fontStyle="italic">
        Conv μ
      </text>
      <rect x={x + w - 86} y={y + 56} width={70} height={28} rx={5} fill="rgba(62,107,255,0.12)" stroke="#3E6BFF" strokeWidth={0.8} />
      <text x={x + w - 51} y={y + 74} textAnchor="middle" fontSize={11} fill="#A9BFFF" fontStyle="italic">
        Conv σ
      </text>

      {/* connectors down to d_FR */}
      <path d={`M ${x + 51} ${y + 84} L ${x + w / 2 - 4} ${y + 112}`} stroke="rgba(242,237,228,0.35)" strokeWidth={1} fill="none" />
      <path d={`M ${x + w - 51} ${y + 84} L ${x + w / 2 + 4} ${y + 112}`} stroke="rgba(242,237,228,0.35)" strokeWidth={1} fill="none" />

      <rect x={x + w / 2 - 30} y={y + 112} width={60} height={26} rx={5} fill="rgba(232,163,61,0.14)" stroke="#E8A33D" strokeWidth={0.9} />
      <text x={x + w / 2} y={y + 130} textAnchor="middle" fontSize={11} fill="#F4CC8F" fontStyle="italic">
        d_FR
      </text>
      <text x={x + w / 2 + 42} y={y + 130} fontSize={13} fill="#F4CC8F" fontStyle="italic">
        α
      </text>

      <text x={x + w / 2} y={y + 164} textAnchor="middle" fontSize={11} fill="#F2EDE4" opacity={0.8}>
        sigmoid
      </text>
      <text x={x + w / 2} y={y + 178} textAnchor="middle" fontSize={9} fill="#F2EDE4" opacity={0.5}>
        temperature function
      </text>

      <path d={`M ${x + w / 2} ${y + 184} L ${x + w / 2} ${y + 202}`} stroke="rgba(242,237,228,0.35)" strokeWidth={1} markerEnd="url(#archArrow)" />
      <circle cx={x + w / 2} cy={y + 218} r={15} fill="none" stroke="#F2EDE4" strokeWidth={1.2} opacity={0.7} />
      <text x={x + w / 2} y={y + 223} textAnchor="middle" fontSize={16} fill="#F2EDE4" opacity={0.8}>
        ⊕
      </text>
      <path d={`M ${x + w / 2} ${y + 233} L ${x + w / 2} ${y + h - 4}`} stroke="rgba(242,237,228,0.3)" strokeWidth={1} />
    </g>
  );
}

export default function ArchitectureFigure() {
  const [active, setActive] = useState<NodeId | null>(null);
  const dim = (id: NodeId) => active !== null && active !== id;

  const hoverProps = (id: NodeId) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onClick: () => setActive((a) => (a === id ? null : id)),
    style: { cursor: "pointer" },
  });

  return (
    <div className="w-full">
      <div className="glass-strong relative w-full overflow-x-auto rounded-3xl p-4 sm:p-8">
        <svg viewBox="0 0 1700 700" className="h-[440px] w-full min-w-[1400px] sm:h-[520px]">
          <defs>
            <marker id="archArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(242,237,228,0.4)" />
            </marker>
            <linearGradient id="curvatureHeat" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3E6BFF" />
              <stop offset="35%" stopColor="#3FB97E" />
              <stop offset="65%" stopColor="#E8A33D" />
              <stop offset="100%" stopColor="#E0584B" />
            </linearGradient>
          </defs>

          {/* Backbone bracket */}
          <text x={465} y={38} textAnchor="middle" fontSize={16} fontWeight={600} fill="#F2EDE4" opacity={0.85}>
            ResNet-50 Backbone
          </text>
          <path d="M 150 55 L 150 48 L 960 48 L 960 55" stroke="rgba(242,237,228,0.3)" strokeWidth={1} fill="none" />

          {/* Input node */}
          <g {...hoverProps("input")} opacity={dim("input") ? 0.35 : 1} style={{ transition: "opacity 0.25s", cursor: "pointer" }}>
            <text x={75} y={128} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4">Input</text>
            <rect x={20} y={140} width={110} height={110} rx={6} fill="#14171F" stroke="#3E6BFF" strokeWidth={1.2} />
            {/* simple schematic knee icon */}
            <rect x={55} y={150} width={18} height={40} rx={3} fill="rgba(242,237,228,0.18)" />
            <ellipse cx={75} cy={195} rx={26} ry={18} fill="rgba(242,237,228,0.14)" />
            <rect x={65} y={210} width={18} height={35} rx={3} fill="rgba(242,237,228,0.18)" />
            <text x={75} y={270} textAnchor="middle" fontSize={11} fill="#F2EDE4" opacity={0.55}>224×224×3</text>
          </g>
          <path d="M 130 195 L 186 195" stroke="rgba(242,237,228,0.35)" strokeWidth={1.3} markerEnd="url(#archArrow)" />

          {/* Stage cubes + connecting arrows */}
          {stageConfigs.map((s, i) => {
            const top = CY - s.size / 2;
            const nextX = stageConfigs[i + 1]?.x0;
            return (
              <g key={s.id}>
                <g {...hoverProps(s.id)}>
                  <Cube x0={s.x0} size={s.size} active={active === s.id} dimmed={dim(s.id)} />
                  <rect x={s.x0 - 6} y={top - 6} width={s.size + s.size * OFF + 12} height={s.size + s.size * OFF + 12} fill="transparent" />
                </g>
                <text x={s.x0 + s.size / 2} y={top + s.size + s.size * OFF + 22} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4" opacity={dim(s.id) ? 0.4 : 0.9}>
                  {s.label}
                </text>
                {s.dims && (
                  <text x={s.x0 + s.size / 2} y={top + s.size + s.size * OFF + 38} textAnchor="middle" fontSize={11} fontFamily="var(--font-jbmono)" fill="#A9BFFF" opacity={dim(s.id) ? 0.4 : 0.75}>
                    {s.dims}
                  </text>
                )}
                {nextX !== undefined && (
                  <path
                    d={`M ${s.x0 + s.size} ${CY} L ${nextX - 6} ${CY}`}
                    stroke="rgba(242,237,228,0.35)"
                    strokeWidth={1.3}
                    markerEnd="url(#archArrow)"
                  />
                )}
              </g>
            );
          })}

          {/* downward arrows: stage2/3/4 -> attention blocks */}
          {attnConfigs.map((a) => (
            <path
              key={`down-${a.id}`}
              d={`M ${a.sourceX} ${CY + 60} L ${a.x + ATTN_W / 2} ${ATTN_Y - 4}`}
              stroke="rgba(232,163,61,0.4)"
              strokeWidth={1.2}
              markerEnd="url(#archArrow)"
              fill="none"
            />
          ))}

          {/* attention blocks */}
          {attnConfigs.map((a) => (
            <g key={a.id} {...hoverProps(a.id)}>
              <AttentionBlock x={a.x} num={a.num} active={active === a.id} dimmed={dim(a.id)} />
            </g>
          ))}

          {/* curvature pooling */}
          <g {...hoverProps("curvature")} opacity={dim("curvature") ? 0.35 : 1} style={{ transition: "opacity 0.25s", cursor: "pointer" }}>
            <rect x={1040} y={370} width={190} height={220} rx={14} fill="rgba(63,185,126,0.08)" stroke="#3FB97E" strokeWidth={active === "curvature" ? 1.8 : 1.1} />
            <text x={1135} y={398} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4">Manifold</text>
            <text x={1135} y={415} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4">Curvature Pooling</text>
            <rect x={1065} y={430} width={140} height={90} rx={8} fill="url(#curvatureHeat)" opacity={0.85} />
            <text x={1135} y={540} textAnchor="middle" fontSize={10} fill="#F2EDE4" opacity={0.6}>Gaussian curvature</text>
            <text x={1135} y={554} textAnchor="middle" fontSize={10} fill="#F2EDE4" opacity={0.6}>heatmap</text>
          </g>

          {/* arrows into curvature: from stage4 + from each attention block */}
          <path d={`M 922 165 L 922 100 L 1135 100 L 1135 366`} stroke="rgba(62,107,255,0.3)" strokeWidth={1.1} fill="none" markerEnd="url(#archArrow)" />
          {attnConfigs.map((a, i) => (
            <path
              key={`up-${a.id}`}
              d={`M ${a.x + ATTN_W} ${ATTN_Y + 40 + i * 30} C ${a.x + ATTN_W + 120} ${ATTN_Y + 40 + i * 30}, ${1040 - 40} ${470 + i * 15}, 1040 ${470 + i * 15}`}
              stroke="rgba(63,185,126,0.35)"
              strokeWidth={1.1}
              fill="none"
              markerEnd="url(#archArrow)"
            />
          ))}

          {/* curvature -> bottleneck */}
          <path d="M 1230 480 L 1266 480" stroke="rgba(242,237,228,0.35)" strokeWidth={1.3} markerEnd="url(#archArrow)" />

          {/* Information bottleneck (bowtie) */}
          <g {...hoverProps("bottleneck")} opacity={dim("bottleneck") ? 0.35 : 1} style={{ transition: "opacity 0.25s", cursor: "pointer" }}>
            <text x={1345} y={358} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4">Information</text>
            <text x={1345} y={375} textAnchor="middle" fontSize={13} fontWeight={600} fill="#F2EDE4">Bottleneck</text>
            <polygon points="1270,390 1270,570 1345,480" fill="#161A21" stroke={active === "bottleneck" ? "#E8A33D" : "rgba(242,237,228,0.3)"} strokeWidth={active === "bottleneck" ? 1.6 : 1} />
            <polygon points="1345,480 1420,390 1420,570" fill="#161A21" stroke={active === "bottleneck" ? "#E8A33D" : "rgba(242,237,228,0.3)"} strokeWidth={active === "bottleneck" ? 1.6 : 1} />
            <text x={1250} y={475} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#A9BFFF">I(X;Z)</text>
            <text x={1440} y={475} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#A9BFFF">I(Z;Y)</text>
          </g>

          {/* bottleneck -> output */}
          <path d="M 1420 480 L 1446 480" stroke="rgba(242,237,228,0.35)" strokeWidth={1.3} markerEnd="url(#archArrow)" />

          {/* Output panel */}
          <g {...hoverProps("output")} opacity={dim("output") ? 0.35 : 1} style={{ transition: "opacity 0.25s", cursor: "pointer" }}>
            <rect x={1450} y={370} width={210} height={220} rx={12} fill="rgba(242,237,228,0.03)" stroke={active === "output" ? "#3FB97E" : "rgba(242,237,228,0.2)"} strokeWidth={active === "output" ? 1.6 : 1} />
            <text x={1555} y={394} textAnchor="middle" fontSize={12} fontWeight={600} fill="#F2EDE4" opacity={0.8}>softmax</text>
            <text x={1465} y={490} fontSize={10} fill="#F2EDE4" opacity={0.4} transform="rotate(-90 1465 490)">confidence</text>

            {[
              { label: "Normal", color: "#3FB97E", frac: 0.08, y: 412 },
              { label: "Osteopenia", color: "#E8A33D", frac: 0.09, y: 466 },
              { label: "Osteoporosis", color: "#E0584B", frac: 0.92, y: 520 },
            ].map((row) => (
              <g key={row.label}>
                <text x={1480} y={row.y - 6} fontSize={11} fill="#F2EDE4" opacity={0.8}>{row.label}</text>
                <rect x={1480} y={row.y} width={155} height={16} rx={4} fill={row.color} opacity={0.18} />
                <rect x={1480} y={row.y} width={155 * row.frac} height={16} rx={4} fill={row.color} opacity={0.85} />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <div className="mt-4 min-h-[3rem] px-1">
        <motion.p
          key={active ?? "default"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-bone/65"
        >
          {active ? descriptions[active] : "Hover or tap any block to see what happens at that stage — matches Fig. 1 of the paper."}
        </motion.p>
      </div>
    </div>
  );
}
