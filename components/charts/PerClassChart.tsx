"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { perClassData } from "@/data/project";

const radarData = ["precision", "recall", "f1"].map((metric) => {
  const row: Record<string, any> = { metric: metric.toUpperCase() };
  perClassData.forEach((c) => {
    row[c.name] = +(c as any)[metric].toFixed(3);
  });
  return row;
});

const colors: Record<string, string> = {
  Normal: "#3FB97E",
  Osteopenia: "#E8A33D",
  Osteoporosis: "#E0584B",
};

export default function PerClassChart() {
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">Per-class diagnostic profile</h4>
      <p className="mb-5 text-xs text-bone/50">
        Osteoporosis — the highest-stakes class — is also the most reliably caught.
      </p>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid stroke="rgba(242,237,228,0.12)" />
            <PolarAngleAxis dataKey="metric" stroke="rgba(242,237,228,0.5)" fontSize={12} />
            <PolarRadiusAxis domain={[0.7, 1]} stroke="rgba(242,237,228,0.2)" fontSize={9} />
            {Object.keys(colors).map((name) => (
              <Radar
                key={name}
                name={name}
                dataKey={name}
                stroke={colors[name]}
                fill={colors[name]}
                fillOpacity={0.18}
                strokeWidth={2}
              />
            ))}
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-strong rounded-xl px-3 py-2 text-xs">
                    {payload.map((p: any) => (
                      <p key={p.name} style={{ color: p.color }}>
                        {p.name}: <span className="font-mono">{p.value}</span>
                      </p>
                    ))}
                  </div>
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
