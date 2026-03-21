"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ExtractionGaugeProps {
  extracted: number;
  inReview: number;
  pending: number;
}

const LEGEND = [
  { label: "Extracted", color: "#145d66" },
  { label: "In Review", color: "#475569" },
  { label: "Pending", color: "#e2e8f0" },
];

export function ExtractionGauge({ extracted, inReview, pending }: ExtractionGaugeProps) {
  const data = [
    { name: "Extracted", value: extracted, color: "#145d66" },
    { name: "In Review", value: inReview, color: "#475569" },
    { name: "Pending", value: pending, color: "#e2e8f0" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gauge */}
      <div className="relative w-full">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="85%"
              startAngle={180}
              endAngle={0}
              innerRadius={62}
              outerRadius={84}
              dataKey="value"
              strokeWidth={0}
              paddingAngle={1}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
                    {payload[0].name}: {payload[0].value}%
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text overlay — positioned above the flat edge of the semicircle */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center">
          <p className="text-4xl font-bold text-slate-900 dark:text-stone-100">{extracted}%</p>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-stone-400">Project Extracted</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 text-xs text-slate-500 dark:text-stone-400">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
