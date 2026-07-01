"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Normal", value: 1002, color: "#3FB97E" },
  { name: "Osteopenia", value: 1056, color: "#E8A33D" },
  { name: "Osteoporosis", value: 1028, color: "#E0584B" },
];

export default function DatasetDonut() {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-7">
      <h4 className="font-display text-lg text-bone">3,086 radiographs, 3 classes</h4>
      <p className="mb-4 text-xs text-bone/50">
        Assembled from 5 independent repositories, kept close to balanced on purpose.
      </p>
      <div className="relative h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={3}
              strokeWidth={0}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d: any = payload[0].payload;
                return (
                  <div className="glass-strong rounded-xl px-3 py-2 text-xs">
                    <p className="font-medium text-bone">{d.name}</p>
                    <p className="font-mono text-bone/60">
                      {d.value} images · {((d.value / total) * 100).toFixed(1)}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl text-bone">{total}</span>
          <span className="text-[11px] text-bone/45">total images</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-5">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-2 text-xs text-bone/60">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.name} · {d.value}
          </span>
        ))}
      </div>
    </div>
  );
}
