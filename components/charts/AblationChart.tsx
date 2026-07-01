"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { ablationData } from "@/data/project";

export default function AblationChart() {
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">
        What each component contributes
      </h4>
      <p className="mb-5 text-xs text-bone/50">
        Each bar removes one piece and substitutes the standard alternative.
      </p>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ablationData} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
            <XAxis
              dataKey="variant"
              stroke="rgba(242,237,228,0.4)"
              fontSize={10}
              interval={0}
              angle={-18}
              textAnchor="end"
              height={70}
            />
            <YAxis domain={[80, 92]} stroke="rgba(242,237,228,0.35)" fontSize={11} unit="%" />
            <ReferenceLine y={85.1} stroke="rgba(242,237,228,0.25)" strokeDasharray="4 4" />
            <Tooltip
              cursor={{ fill: "rgba(242,237,228,0.04)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d: any = payload[0].payload;
                return (
                  <div className="glass-strong rounded-xl px-3 py-2 text-xs">
                    <p className="font-medium text-bone">{d.variant}</p>
                    <p className="font-mono text-bone/60">
                      acc {d.accuracy}% · κ {d.kappa}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} barSize={42}>
              {ablationData.map((d) => (
                <Cell
                  key={d.variant}
                  fill={
                    d.variant.includes("Full Model")
                      ? "#E8A33D"
                      : d.variant.includes("Baseline")
                      ? "rgba(242,237,228,0.25)"
                      : "rgba(62,107,255,0.55)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
