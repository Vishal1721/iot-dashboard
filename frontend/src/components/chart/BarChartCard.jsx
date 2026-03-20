"use client";

import React from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card1";
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui";
import { BarChart2 } from "lucide-react";

export const BarChartCard = ({ sensors, sensorData }) => {
  return (
    <>
      <style>{`
        .barchart-outer {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .barchart-outer:hover {
          border-color: rgba(255,255,255,0.13) !important;
        }
        .barchart-inner {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .barchart-inner:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.16) !important;
        }
        .chart-accent {
          height: 2px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%);
        }
      `}</style>

      <div className="lg:px-16 mb-6">
        {/* Outer card */}
        <div
          className="barchart-outer rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          }}
        >
          {/* Blue accent bar */}
          <div className="chart-accent" />

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">
                Historical Bar Chart
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Historical data of your output sensors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 size={14} className="text-blue-400" />
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md"
                style={{
                  background: "rgba(79,110,247,0.13)",
                  border: "1px solid rgba(79,110,247,0.22)",
                  color: "#8aabff",
                }}
              >
                {sensors?.length ?? 0} sensor{sensors?.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {sensors?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <BarChart2 size={20} className="text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">
                  No output sensors found
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Add sensors via Manage Sensors
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-wrap justify-center gap-5">
                {sensorData?.map((data, index) => {
                  const chartData = data?.map((dataPoint) => {
                    const month = new Date(
                      dataPoint?.timestamp,
                    ).toLocaleDateString("en-US", { month: "short" });
                    const day = new Date(dataPoint?.timestamp).getDate();
                    return {
                      period: `${month} ${day}`,
                      value: dataPoint?.value,
                    };
                  });

                  const chartConfig = {
                    value: {
                      label: "Value",
                      color: "#4f6ef7",
                    },
                  };

                  return (
                    <div
                      key={index}
                      className="barchart-inner rounded-xl overflow-hidden w-full max-w-[520px] lg:w-5/12"
                      style={{
                        background:
                          "linear-gradient(160deg, #22263a 0%, #1a1e2d 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Inner accent */}
                      <div className="chart-accent" />

                      {/* Inner header */}
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {sensors[index]?.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                            {sensors[index]?.type}
                          </p>
                        </div>
                        <span
                          className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md"
                          style={{
                            background: "rgba(79,110,247,0.13)",
                            border: "1px solid rgba(79,110,247,0.2)",
                            color: "#8aabff",
                          }}
                        >
                          {sensors[index]?.unit || "unit"}
                        </span>
                      </div>

                      {/* Chart */}
                      <div className="p-4">
                        <Chart config={chartConfig}>
                          <BarChart data={chartData}>
                            <CartesianGrid
                              vertical={false}
                              stroke="rgba(255,255,255,0.05)"
                            />
                            <XAxis
                              dataKey="period"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6b7280", fontSize: 11 }}
                            />
                            <YAxis
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#6b7280", fontSize: 11 }}
                              width={32}
                            />
                            <ChartTooltip
                              cursor={{ fill: "rgba(79,110,247,0.08)" }}
                              content={
                                <ChartTooltipContent
                                  hideLabel={false}
                                  unit={sensors[index]?.unit}
                                  className="rounded-lg text-xs"
                                  style={{
                                    background: "#181b28",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                                  }}
                                />
                              }
                            />
                            <Bar
                              dataKey="value"
                              fill="url(#barGradient)"
                              radius={[5, 5, 0, 0]}
                            />
                            <defs>
                              <linearGradient
                                id="barGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#6c8fff"
                                  stopOpacity={1}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#4f6ef7"
                                  stopOpacity={0.75}
                                />
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </Chart>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
