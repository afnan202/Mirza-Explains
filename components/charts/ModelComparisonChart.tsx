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
  LabelList,
} from "recharts";
import { comparisonData } from "@/data/project";

export default function ModelComparisonChart() {
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">
        Accuracy across backbones
      </h4>
      <p className="mb-5 text-xs text-bone/50">
        Same dataset, same splits, same training budget.
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(242,237,228,0.08)"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[75, 92]}
              stroke="rgba(242,237,228,0.35)"
              fontSize={11}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="model"
              width={120}
              stroke="rgba(242,237,228,0.5)"
              fontSize={12}
            />
            <Tooltip
              cursor={{ fill: "rgba(242,237,228,0.04)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass-strong rounded-xl px-3 py-2 text-xs">
                    <p className="font-medium text-bone">{d.model}</p>
                    <p className="font-mono text-bone/60">
                      acc {d.accuracy}% · κ {d.kappa}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="accuracy" radius={[0, 6, 6, 0]} barSize={18}>
              {comparisonData.map((d, i) => (
                <Cell
                  key={d.model}
                  fill={
                    d.model === "IG-CNN (Ours)"
                      ? "#E8A33D"
                      : "rgba(62,107,255,0.55)"
                  }
                />
              ))}
              <LabelList
                dataKey="accuracy"
                position="right"
                formatter={(v: number) => `${v}%`}
                fill="rgba(242,237,228,0.7)"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
