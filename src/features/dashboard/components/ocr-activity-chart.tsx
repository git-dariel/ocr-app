"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATA = [
  { day: "S", runs: 4 },
  { day: "M", runs: 12 },
  { day: "T", runs: 19 },
  { day: "W", runs: 9 },
  { day: "T", runs: 15 },
  { day: "F", runs: 7 },
  { day: "S", runs: 2 },
];

const PEAK_IDX = DATA.reduce(
  (best, d, i) => (d.runs > DATA[best].runs ? i : best),
  0,
);

function CustomTick({ x, y, payload, index }: {
  x?: number;
  y?: number;
  payload?: { value: string };
  index?: number;
}) {
  const isPeak = index === PEAK_IDX;
  return (
    <text
      x={x}
      y={(y ?? 0) + 12}
      textAnchor="middle"
      fontSize={13}
      fill={isPeak ? "#145d66" : "#94a3b8"}
      fontWeight={isPeak ? 700 : 400}
    >
      {payload?.value}
    </text>
  );
}

function PeakLabel({ x, y, width, value, index }: {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  index?: number;
}) {
  if (index !== PEAK_IDX) return null;
  const cx = (x ?? 0) + (width ?? 0) / 2;
  const badgeW = 44;
  return (
    <g>
      <rect
        x={cx - badgeW / 2}
        y={(y ?? 0) - 30}
        width={badgeW}
        height={20}
        rx={10}
        fill="#145d66"
      />
      <text
        x={cx}
        y={(y ?? 0) - 16}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill="white"
      >
        {value}
      </text>
    </g>
  );
}

export function OcrActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={DATA} barSize={30} margin={{ top: 36, right: 10, left: 10, bottom: 0 }}>
        <YAxis domain={[0, "dataMax"]} hide />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={CustomTick as never}
        />
        <Tooltip
          cursor={{ fill: "rgba(20,93,102,0.06)", radius: 8 } as object}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-lg">
                {payload[0].value} runs
              </div>
            );
          }}
        />
        <Bar dataKey="runs" radius={[14, 14, 14, 14]}>
          {DATA.map((_, i) => (
            <Cell key={i} fill={i === PEAK_IDX ? "#145d66" : "#1e293b"} />
          ))}
          <LabelList dataKey="runs" content={PeakLabel as never} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
