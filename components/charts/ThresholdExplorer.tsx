"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ThresholdExplorer() {
  const [T, setT] = useState(1);

  const data = useMemo(() => {
    const points = [];
    for (let d2 = 0; d2 <= 100; d2 += 2) {
      const alpha = 1 / (1 + Math.exp(d2 / T));
      points.push({ d2, alpha: +alpha.toFixed(4) });
    }
    return points;
  }, [T]);

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-lg text-bone">
            Try the threshold yourself
          </h4>
          <p className="text-xs text-bone/50">
            α(h,w) = 1 / (1 + e^(d_FR² / T)) — drag T to see attention sharpen or soften.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-bone/50">T =</span>
          <span className="glass rounded-full px-3 py-1 font-mono text-sm text-curvature">
            {T.toFixed(1)}
          </span>
        </div>
      </div>

      <input
        type="range"
        min={0.2}
        max={50}
        step={0.2}
        value={T}
        onChange={(e) => setT(parseFloat(e.target.value))}
        className="mb-6 w-full accent-curvature"
        aria-label="Sensitivity threshold T"
      />

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
            <XAxis
              dataKey="d2"
              stroke="rgba(242,237,228,0.35)"
              fontSize={11}
              label={{
                value: "Fisher distance² (d_FR²)",
                position: "insideBottom",
                offset: -4,
                fontSize: 11,
                fill: "rgba(242,237,228,0.4)",
              }}
            />
            <YAxis
              domain={[0, 1]}
              stroke="rgba(242,237,228,0.35)"
              fontSize={11}
              label={{
                value: "attention α",
                angle: -90,
                position: "insideLeft",
                fontSize: 11,
                fill: "rgba(242,237,228,0.4)",
              }}
            />
            <ReferenceLine y={0.5} stroke="rgba(242,237,228,0.2)" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="alpha" stroke="#E8A33D" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-center text-xs text-bone/45">
        {T < 3
          ? "Low T → sharp, near-binary attention. Small deviations get suppressed hard."
          : T > 25
          ? "High T → nearly uniform attention. The model barely distinguishes regions."
          : "Balanced T ≈ 1–10 → graded attention that tracks how unusual a region really is."}
      </p>
    </div>
  );
}
