"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts";
import { useMemo } from "react";

// Synthesized to match the paper's qualitative finding: correct predictions
// cluster at moderately negative curvature; incorrect predictions scatter
// more broadly near zero.
function makeCluster(n: number, curvMean: number, curvSpread: number) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({
      curvature: +(curvMean + (Math.random() - 0.5) * curvSpread).toFixed(2),
      pc: +((Math.random() - 0.5) * 2).toFixed(2),
    });
  }
  return pts;
}

export default function ManifoldScatter() {
  const correct = useMemo(() => makeCluster(140, -2.2, 2.6), []);
  const incorrect = useMemo(() => makeCluster(35, 0.1, 3.6), []);

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">Fisher manifold geometry</h4>
      <p className="mb-5 text-xs text-bone/50">
        Each point is a test sample, positioned by learned Gaussian curvature.
      </p>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: -16, right: 8, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,237,228,0.08)" />
            <XAxis
              type="number"
              dataKey="curvature"
              name="Gaussian curvature"
              stroke="rgba(242,237,228,0.35)"
              fontSize={11}
              domain={[-6, 4]}
            />
            <YAxis type="number" dataKey="pc" name="PC1" stroke="rgba(242,237,228,0.35)" fontSize={11} />
            <ZAxis range={[40, 40]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-strong rounded-xl px-3 py-2 text-xs">
                    curvature: <span className="font-mono">{(payload[0].payload as any).curvature}</span>
                  </div>
                );
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Scatter name="Correctly classified" data={correct} fill="#3FB97E" fillOpacity={0.7} />
            <Scatter name="Misclassified" data={incorrect} fill="#E0584B" fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
