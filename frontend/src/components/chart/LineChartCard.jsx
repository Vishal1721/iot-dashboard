"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card1";
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import { calculateDailyAverages } from "@/utils/time-functions";
import { TrendingUp } from "lucide-react";

// Vibrant palette that pops on dark backgrounds
const colors = [
  "#6c8fff", // blue
  "#f472b6", // pink
  "#34d399", // emerald
  "#fb923c", // orange
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#fbbf24", // amber
  "#f87171", // red
  "#818cf8", // indigo
  "#2dd4bf", // teal
];

// Custom dark tooltip
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#181b28",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        minWidth: "140px",
      }}
    >
      <p
        style={{
          color: "#9ca3af",
          fontSize: "11px",
          marginBottom: "6px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      {payload.map((entry, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4"
          style={{ marginBottom: "3px" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: entry.color,
                display: "inline-block",
              }}
            />
            <span style={{ color: "#d1d5db", fontSize: "12px" }}>
              {entry.name}
            </span>
          </span>
          <span
            style={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {entry.value?.toFixed ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Custom dark legend
const DarkLegend = ({ payload }) => {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            style={{
              width: "24px",
              height: "3px",
              borderRadius: "2px",
              background: entry.color,
              display: "inline-block",
            }}
          />
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const LineChartCard = ({ sensors, sensorData }) => {
  // Build unified chartData
  const dateMap = new Map();
  sensors.forEach((sensor, index) => {
    const dailyAverages = calculateDailyAverages(sensorData[index] || []);
    dailyAverages.forEach((dataPoint) => {
      const date = dataPoint.date;
      if (!dateMap.has(date)) dateMap.set(date, { date });
      dateMap.get(date)[`value-${sensor.id}`] = dataPoint.average;
    });
  });

  const chartData = Array.from(dateMap.values()).sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  if (!sensorData.length || !sensors.length) return null;

  return (
    <>
      <style>{`
        .linechart-outer {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .linechart-outer:hover {
          border-color: rgba(255,255,255,0.13) !important;
        }
        .line-chart-accent {
          height: 2px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%);
        }
      `}</style>

      <div className="w-full overflow-auto lg:px-16 mb-6">
        <div
          className="linechart-outer rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          }}
        >
          {/* Blue accent bar */}
          <div className="line-chart-accent" />

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">
                Sensor Data Over Time
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Daily averages across all sensors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-400" />
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md"
                style={{
                  background: "rgba(79,110,247,0.13)",
                  border: "1px solid rgba(79,110,247,0.22)",
                  color: "#8aabff",
                }}
              >
                {sensors.length} sensor{sensors.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                  width={36}
                />
                <Tooltip content={<DarkTooltip />} />
                <Legend content={<DarkLegend />} />
                {sensors.map((sensor, index) => (
                  <Line
                    key={sensor.id}
                    type="natural"
                    dataKey={`value-${sensor.id}`}
                    name={sensor.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2.5}
                    dot={{
                      fill: colors[index % colors.length],
                      r: 3.5,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                      fill: colors[index % colors.length],
                      stroke: "#1e2235",
                      strokeWidth: 2,
                    }}
                    isAnimationActive={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};
