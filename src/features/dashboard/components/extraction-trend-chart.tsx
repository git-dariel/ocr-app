"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DATA = [
  { date: "Mar 8",  submitted: 8,  extracted: 7  },
  { date: "Mar 9",  submitted: 12, extracted: 11 },
  { date: "Mar 10", submitted: 15, extracted: 14 },
  { date: "Mar 11", submitted: 6,  extracted: 5  },
  { date: "Mar 12", submitted: 19, extracted: 17 },
  { date: "Mar 13", submitted: 14, extracted: 13 },
  { date: "Mar 14", submitted: 9,  extracted: 8  },
  { date: "Mar 15", submitted: 22, extracted: 20 },
  { date: "Mar 16", submitted: 18, extracted: 16 },
  { date: "Mar 17", submitted: 11, extracted: 10 },
  { date: "Mar 18", submitted: 16, extracted: 15 },
  { date: "Mar 19", submitted: 23, extracted: 21 },
  { date: "Mar 20", submitted: 17, extracted: 15 },
  { date: "Mar 21", submitted: 19, extracted: 17 },
];

const TOTAL_SUBMITTED = DATA.reduce((s, d) => s + d.submitted, 0);
const TOTAL_EXTRACTED = DATA.reduce((s, d) => s + d.extracted, 0);
const SUCCESS_RATE = Math.round((TOTAL_EXTRACTED / TOTAL_SUBMITTED) * 100);

export function ExtractionTrendChart() {
  return (
    <div className="flex h-full flex-col">
      {/* Legend row */}
      <div className="mb-5 flex items-center gap-6">
        <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-stone-400">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-stone-600" />
          Submitted
        </span>
        <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-stone-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#145d66]" />
          Extracted
        </span>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="submittedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="extractedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#145d66" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#145d66" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ stroke: "#145d66", strokeWidth: 1, strokeDasharray: "4 2" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-white/10 dark:bg-[#252926]">
                    <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-stone-400">
                      {label}
                    </p>
                    {payload.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="capitalize text-slate-600 dark:text-stone-300">
                          {String(p.dataKey)}:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-stone-100">
                          {String(p.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="submitted"
              stroke="#cbd5e1"
              strokeWidth={1.5}
              fill="url(#submittedGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#94a3b8", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="extracted"
              stroke="#145d66"
              strokeWidth={2}
              fill="url(#extractedGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#145d66", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 sm:mt-5 dark:divide-white/6 dark:border-white/8 dark:bg-white/4">
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Submitted</p>
          <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl dark:text-stone-100">
            {TOTAL_SUBMITTED}
          </p>
        </div>
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Extracted</p>
          <p className="mt-1 text-lg font-bold text-[#145d66] sm:text-xl">{TOTAL_EXTRACTED}</p>
        </div>
        <div className="px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Success rate</p>
          <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl dark:text-stone-100">
            {SUCCESS_RATE}%
          </p>
        </div>
      </div>
    </div>
  );
}
