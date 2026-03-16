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

const colors = [
  "#3B82F6",
  "#EC4899",
  "#10B981",
  "#F97316",
  "#06B6D4",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#14B8A6",
];

export const LineChartCard = ({ sensors, sensorData }) => {
  // Create a unified chartData array
  const chartData = [];
  const dateMap = new Map();

  sensors.forEach((sensor, index) => {
    const dailyAverages = calculateDailyAverages(sensorData[index] || []);
    dailyAverages.forEach((dataPoint) => {
      const date = dataPoint.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { date });
      }
      dateMap.get(date)[`value-${sensor.id}`] = dataPoint.average;
    });
  });

  // Convert dateMap to chartData array
  dateMap.forEach((value) => {
    chartData.push(value);
  });

  // Sort chartData by date
  chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="w-full overflow-auto lg:px-16">
      {sensorData.length > 0 && sensors.length > 0 && (
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200 w-full mb-6">
          <CardHeader className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl">
            <CardTitle className="text-base sm:text-xl font-bold text-white">
              Sensor Data Over Time
            </CardTitle>
            <CardDescription className="text-sm sm:text-base font-medium text-gray-100">
              Compare all sensor data over time, with daily averages
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-gray-50 rounded-b-xl">
            <Chart config={chartConfig}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    vertical={false}
                    stroke="#E5E7EB"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                  />
                  <Tooltip
                    content={
                      <ChartTooltipContent
                        hideLabel={false}
                        className="bg-white border border-gray-200 shadow-lg rounded-lg p-3"
                      />
                    }
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                      color: "#374151",
                    }}
                  />
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
                        r: 4,
                        strokeWidth: 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: colors[index % colors.length],
                        stroke: "#FFFFFF",
                        strokeWidth: 2,
                      }}
                      isAnimationActive={false}
                      connectNulls={true}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Chart>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
