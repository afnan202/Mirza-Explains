"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateTrainingCurve } from "@/data/project";

const tabs = [
  { id: "accuracy", label: "Accuracy" },
  { id: "loss", label: "Loss" },
  { id: "ib", label: "IB Loss" },
] as const;

export default function TrainingCurves() {
  const data = useMemo(() => generateTrainingCurve(), []);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("accuracy");

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-lg text-bone">100-epoch training run</h4>
          <p className="text-xs text-bone/50">
            Reconstructed from reported convergence behavior — final val. accuracy 89.95%
          </p>
        </div>
        <div className="glass flex gap-1 rounded-full p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                tab === t.id
                  ? "bg-manifold text-white"
                  : "text-bone/60 hover:text-bone"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {tab === "accuracy" ? (
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="trainAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3E6BFF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3E6BFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="valAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8A33D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#E8A33D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
              <XAxis dataKey="epoch" stroke="rgba(242,237,228,0.35)" fontSize={11} />
              <YAxis domain={[45, 95]} stroke="rgba(242,237,228,0.35)" fontSize={11} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="trainAcc" name="Train acc." stroke="#3E6BFF" fill="url(#trainAcc)" strokeWidth={2} />
              <Area type="monotone" dataKey="valAcc" name="Val acc." stroke="#E8A33D" fill="url(#valAcc)" strokeWidth={2} />
            </AreaChart>
          ) : tab === "loss" ? (
            <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
              <XAxis dataKey="epoch" stroke="rgba(242,237,228,0.35)" fontSize={11} />
              <YAxis stroke="rgba(242,237,228,0.35)" fontSize={11} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="trainLoss" name="Train loss" stroke="#3E6BFF" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="valLoss" name="Val loss" stroke="#E8A33D" dot={false} strokeWidth={2} />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="ibLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E0584B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#E0584B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
              <XAxis dataKey="epoch" stroke="rgba(242,237,228,0.35)" fontSize={11} />
              <YAxis stroke="rgba(242,237,228,0.35)" fontSize={11} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="ibLoss" name="IB loss (KL)" stroke="#E0584B" fill="url(#ibLoss)" strokeWidth={2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      <p className="mb-1 font-mono text-bone/50">epoch {label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-mono">{p.value}</span>
        </p>
      ))}
    </div>
  );
}
