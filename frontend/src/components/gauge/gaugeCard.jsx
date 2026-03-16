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
      <Card className="h-auto bg-white rounded-xl md:rounded-2xl shadow-lg mb-6 border border-gray-200">
        <CardHeader className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-white">
            Output Sensors
          </CardTitle>
          <CardDescription className="text-lg text-center text-gray-100">
            Sensor data which are sent from microController to server.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 bg-gray-50 rounded-b-xl">
          {sensors?.length === 0 ? (
            <CardDescription className="text-lg text-center font-semibold text-gray-600">
              No output sensors found.
            </CardDescription>
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-6 overflow-auto">
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
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow w-80 sm:w-64 lg:w-72 max-w-full mb-6 border border-gray-200"
                  >
                    <CardHeader className="flex flex-col items-center justify-center h-16 bg-gray-50 rounded-t-xl border-b border-gray-200">
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {sensor?.name}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-gray-600">
                        {sensor?.type}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center p-4">
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
                              limit: safeMax,
                              color: "#EA4228",
                              showTick: true,
                              tooltip: {
                                text: `Too High ${sensor?.unit}!`,
                              },
                            },
                          ],
                        }}
                      />

                      <div className="text-center mt-4 space-y-2">
                        <p className="text-xl font-semibold text-gray-800">
                          {latestData ? Number(latestData.value) : 0}{" "}
                          <span className="text-sm font-normal text-gray-600">
                            {sensor?.unit}
                          </span>
                        </p>

                        <p className="text-gray-600 text-sm text-center font-medium">
                          Last modified:
                          <span className="font-semibold text-gray-800 ml-1">
                            {latestData
                              ? formatDate(latestData.timestamp)
                              : "N/A"}
                          </span>
                        </p>
                      </div>
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
