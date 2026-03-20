import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card1";
import { formatDate } from "@/utils/time-functions";
import { Zap } from "lucide-react";

const Switch = ({ checked, onChange }) => {
  return (
    <label className="relative flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      {/* Track */}
      <div
        className="w-16 h-8 rounded-full relative transition-all duration-300"
        style={{
          background: checked
            ? "linear-gradient(135deg, #22c55e, #16a34a)"
            : "rgba(255,255,255,0.08)",
          border: checked
            ? "1px solid rgba(34,197,94,0.4)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: checked ? "0 0 14px rgba(34,197,94,0.35)" : "none",
        }}
      >
        {/* Thumb */}
        <div
          className="absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all duration-300"
          style={{
            left: checked ? "calc(100% - 28px)" : "4px",
            background: checked ? "#fff" : "rgba(255,255,255,0.5)",
            boxShadow: checked
              ? "0 2px 8px rgba(0,0,0,0.3)"
              : "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </label>
  );
};

const SwitchCard = ({ sensor, sensorData, onSwitchChange }) => {
  const lastData =
    sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  const [isChecked, setIsChecked] = useState(lastData?.value === 1);

  useEffect(() => {
    setIsChecked(lastData?.value === 1);
  }, [lastData]);

  const handleSwitchChange = async () => {
    const newValue = isChecked ? 0 : 1;
    try {
      await onSwitchChange(sensor.id, newValue);
      setIsChecked(!isChecked);
    } catch (error) {
      console.error("Failed to change switch");
    }
  };

  return (
    <>
      <style>{`
        .switch-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .switch-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.16) !important;
        }
        .switch-accent {
          height: 2px;
          border-radius: 12px 12px 0 0;
        }
        .status-badge-on {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #4ade80;
          box-shadow: 0 0 12px rgba(34,197,94,0.2);
        }
        .status-badge-off {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #6b7280;
        }
      `}</style>

      <div
        className="switch-card rounded-xl overflow-hidden w-64 flex flex-col"
        style={{
          background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Accent bar — green when ON, default blue when OFF */}
        <div
          className="switch-accent"
          style={{
            background: isChecked
              ? "linear-gradient(90deg, #22c55e 0%, rgba(34,197,94,0) 100%)"
              : "linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%)",
            transition: "background 0.3s ease",
          }}
        />

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              {sensor.name}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
              {sensor.type}
            </p>
          </div>
          <Zap
            size={14}
            className="transition-colors duration-300"
            style={{ color: isChecked ? "#4ade80" : "#4b5563" }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-5 py-5 gap-4">
          {/* Status badge */}
          <span
            className={`px-6 py-2 text-sm font-bold rounded-full tracking-widest transition-all duration-300 ${
              isChecked ? "status-badge-on" : "status-badge-off"
            }`}
          >
            {isChecked ? "ON" : "OFF"}
          </span>

          {/* Toggle switch */}
          <Switch checked={isChecked} onChange={handleSwitchChange} />

          {/* Last modified */}
          <div
            className="w-full rounded-lg px-4 py-3"
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
                {sensorData.length > 0
                  ? formatDate(sensorData[sensorData.length - 1].timestamp)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SwitchCard;
