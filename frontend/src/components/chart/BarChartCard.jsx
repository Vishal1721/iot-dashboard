"use client";

import React from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card1";
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui";

export const BarChartCard = ({ sensors, sensorData }) => {
  return (
    <div className="lg:px-16">
      <Card className="h-auto bg-white rounded-xl md:rounded-2xl shadow-lg mb-6 border border-gray-200">
        <CardHeader className="flex items-center justify-center text-center p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-white">
            Historical Bar Chart
          </CardTitle>
          <CardDescription className="text-lg text-gray-100">
            You can view the historical data of your output sensors here.
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6 px-4 bg-gray-50 rounded-b-xl">
          {sensors?.length === 0 ? (
            <CardDescription className="text-lg text-center font-semibold text-gray-600">
              No output sensors found.
            </CardDescription>
          ) : (
            <div className="w-full overflow-auto">
              <div className="w-full flex flex-wrap justify-center gap-6">
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
                      color: "var(--chart-1)",
                    },
                  };

                  return (
                    <Card
                      key={index}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow w-full max-w-[550px] lg:w-5/12 xl:max-w-3/5 mb-6 border border-gray-200"
                    >
                      <CardHeader className="flex flex-col items-center justify-center h-16 bg-gray-50 rounded-t-xl border-b border-gray-200">
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {sensors[index]?.name}
                        </CardTitle>
                        <CardDescription className="text-base font-medium text-gray-600">
                          {sensors[index]?.type}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Chart config={chartConfig}>
                          <BarChart data={chartData}>
                            <XAxis
                              dataKey="period"
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: "#4B5563", fontSize: 12 }}
                            />
                            <ChartTooltip
                              cursor={false}
                              content={
                                <ChartTooltipContent
                                  hideLabel={false}
                                  unit={sensors[index]?.unit}
                                  className="bg-white border border-gray-200 shadow-lg rounded-lg p-2"
                                />
                              }
                            />
                            <Bar dataKey="value" fill="#3B82F6" radius={5} />
                          </BarChart>
                        </Chart>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
