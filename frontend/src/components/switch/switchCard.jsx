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

const Switch = ({ checked, onChange }) => {
  return (
    <label className="relative flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-14 h-7 bg-gray-300 rounded-full peer-checked:bg-green-500 transition duration-300 relative shadow-inner">
        <div
          className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${checked ? "translate-x-7" : ""}`}
        ></div>
      </div>
    </label>
  );
};

const SwitchCard = ({ sensor, sensorData, onSwitchChange }) => {
  const lastData =
    sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;
  const [isChecked, setIsChecked] = useState(
    lastData?.value === 1 ? true : false,
  );

  useEffect(() => {
    setIsChecked(lastData?.value === 1 ? true : false);
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
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow w-80 md:w-64 lg:w-72 max-w-full mb-6 border border-gray-200">
      <CardHeader className="flex items-center rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <CardTitle className="text-xl font-bold text-center">
          {sensor.name}
        </CardTitle>
        <CardDescription className="text-sm font-medium text-center text-gray-100">
          {sensor.type}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center p-6">
        <span
          className={`px-6 py-3 my-3 text-sm font-semibold rounded-full tracking-wider cursor-pointer transition-all ${
            isChecked
              ? "bg-green-500 text-white shadow-md hover:bg-green-600"
              : "bg-gray-400 text-white shadow-md hover:bg-gray-500"
          }`}
        >
          {isChecked ? "ON" : "OFF"}
        </span>

        <div className="text-center mt-4 space-y-1">
          <p className="text-gray-600 text-sm font-medium">Last modified</p>
          <p className="text-gray-800 font-semibold text-sm">
            {sensorData.length > 0
              ? formatDate(sensorData[sensorData.length - 1].timestamp)
              : "N/A"}
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-4 pt-1 pb-6 flex justify-center border-t border-gray-100">
        <Switch checked={isChecked} onChange={handleSwitchChange} />
      </CardFooter>
    </Card>
  );
};

export default SwitchCard;
