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
import { Activity } from "lucide-react";

const GaugeCard = ({ sensors, sensorData }) => {
  return (
    <>
      <style>{`
        .gauge-outer-card {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .gauge-outer-card:hover {
          border-color: rgba(255,255,255,0.14) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.45);
        }
        .gauge-inner-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .gauge-inner-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.16) !important;
        }
        .gauge-accent {
          height: 2px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%);
        }
        .sensor-value-badge {
          background: rgba(79,110,247,0.13);
          border: 1px solid rgba(79,110,247,0.22);
          color: #8aabff;
          transition: background 0.2s ease;
        }
        .gauge-inner-card:hover .sensor-value-badge {
          background: rgba(79,110,247,0.2);
        }
      `}</style>

      <div className="lg:px-16 mb-6">
        {/* Outer container card */}
        <div
          className="gauge-outer-card rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          }}
        >
          {/* Blue accent bar */}
          <div className="gauge-accent" />

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl font-bold text-white">Output Sensors</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Live data received from your microcontroller
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-400" />
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
                  <Activity size={20} className="text-gray-600" />
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
                {(sensorData || []).map((data, index) => {
                  const sensor = sensors[index];
                  const latestData =
                    Array.isArray(data) && data.length
                      ? data[data.length - 1]
                      : null;
                  const min = Number(sensor?.minThreshold ?? 0);
                  const max = Number(sensor?.maxThreshold ?? 100);
                  const safeMin = Math.max(0, min - Math.abs(min * 0.5));
                  const safeMax = max + Math.abs(max * 0.5) + 10;

                  return (
                    <div
                      key={index}
                      className="gauge-inner-card rounded-xl overflow-hidden w-72 flex flex-col"
                      style={{
                        background:
                          "linear-gradient(160deg, #22263a 0%, #1a1e2d 100%)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                      }}
                    >
                      {/* Inner accent bar */}
                      <div className="gauge-accent" />

                      {/* Sensor name header */}
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
                        <div>
                          <p className="text-white font-semibold text-sm leading-tight">
                            {sensor?.name}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                            {sensor?.type}
                          </p>
                        </div>
                        <span className="sensor-value-badge text-xs font-mono font-bold px-2 py-0.5 rounded-md">
                          {latestData ? Number(latestData.value) : 0}
                          {sensor?.unit ? ` ${sensor.unit}` : ""}
                        </span>
                      </div>

                      {/* Gauge */}
                      <div className="flex justify-center px-4 pt-2">
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
                                tooltip: { text: `Too Low ${sensor?.unit}!` },
                              },
                              {
                                limit: max,
                                color: "#5BE12C",
                                showTick: true,
                                tooltip: { text: `${sensor?.unit} in Limit!` },
                              },
                              {
                                limit: safeMax,
                                color: "#EA4228",
                                showTick: true,
                                tooltip: { text: `Too High ${sensor?.unit}!` },
                              },
                            ],
                          }}
                        />
                      </div>

                      {/* Footer info */}
                      <div
                        className="mx-4 mb-4 mt-1 rounded-lg px-4 py-3"
                        style={{
                          background: "rgba(0,0,0,0.22)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">
                            Last updated
                          </span>
                          <span className="text-xs font-medium text-gray-300">
                            {latestData
                              ? formatDate(latestData.timestamp)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wider">
                            Range
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            {min} – {max}
                            {sensor?.unit ? ` ${sensor.unit}` : ""}
                          </span>
                        </div>
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

export default GaugeCard;
