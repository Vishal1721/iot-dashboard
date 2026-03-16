import React from "react";
import GaugeComponent from "react-gauge-component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card1";
import { formatDate } from "@/utils/time-functions";

const GaugeCard = ({ sensors, sensorData }) => {
  return (
    <div className="lg:px-16">
      <Card className="h-auto bg-quaternary rounded-xl md:rounded-2xl shadow-xl mb-6">
        <CardHeader className="flex items-center justify-between p-4">
          <CardTitle className="text-2xl font-bold">Output Sensors</CardTitle>
          <CardDescription className="text-lg text-center">
            Sensor data which are sent from microController to server.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sensors?.length === 0 ? (
            <CardDescription className="text-lg text-center font-semibold">
              No output sensors found.
            </CardDescription>
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-4 overflow-auto">
              {(sensorData || []).map((data, index) => {
                const sensor = sensors[index];

                const latestData =
                  Array.isArray(data) && data.length
                    ? data[data.length - 1]
                    : null;
                const min = Number(sensor?.minThreshold ?? 0);
                const max = Number(sensor?.maxThreshold ?? 100);

                // Ensure valid gauge boundaries
                const safeMin = Math.max(0, min - Math.abs(min * 0.5));
                const safeMax = max + Math.abs(max * 0.5) + 10;

                return (
                  <Card
                    key={index}
                    className="bg-secondary rounded-xl shadow-xl w-80 sm:w-64 lg:w-72 max-w-full mb-6"
                  >
                    <CardHeader className="flex flex-col items-center justify-center h-16">
                      <CardTitle className="text-xl font-bold text-center">
                        {sensor?.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-center">
                        {sensor?.type}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center">
                      <GaugeComponent
                        value={latestData ? Number(latestData.value) : 0}
                        minValue={safeMin}
                        maxValue={safeMax}
                        arc={{
                          width: 0.3,
                          padding: 0.005,
                          cornerRadius: 1,
                          subArcs: [
                            {
                              limit: min,
                              color: "#F5CD19",
                              showTick: true,
                              tooltip: {
                                text: `Too Low ${sensor?.unit}!`,
                              },
                            },
                            {
                              limit: max,
                              color: "#5BE12C",
                              showTick: true,
                              tooltip: {
                                text: `${sensor?.unit} in Limit!`,
                              },
                            },
                            {
                              limit: safeMax, // ✅ FIXED (was max + 10)
                              color: "#EA4228",
                              showTick: true,
                              tooltip: {
                                text: `Too High ${sensor?.unit}!`,
                              },
                            },
                          ],
                        }}
                      />

                      <p className="text-center mt-2">
                        {latestData ? Number(latestData.value) : 0}{" "}
                        {sensor?.unit}
                      </p>

                      <p className="text-gray-700 text-sm text-center font-medium mt-2">
                        Last modified:
                        <span className="font-bold ml-1">
                          {latestData
                            ? formatDate(latestData.timestamp)
                            : "N/A"}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GaugeCard;
