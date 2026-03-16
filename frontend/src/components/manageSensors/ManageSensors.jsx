import React, { useState } from "react";
import { createSensor, deleteSensor, updateSensor } from "@/APIs/sensorAPI";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

const ManageSensors = ({ projectId, sensors, changeSensors, handleOpen }) => {
  const [sensorId, setSensorId] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [sensorUnit, setSensorUnit] = useState("");
  const [sensorMinThreshold, setSensorMinThreshold] = useState("");
  const [sensorMaxThreshold, setSensorMaxThreshold] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // CREATE SENSOR
  // ==============================
  const handleCreateSensor = async () => {
    if (
      !sensorName ||
      !sensorType ||
      !sensorUnit ||
      (sensorType === "OUTPUT" && (!sensorMinThreshold || !sensorMaxThreshold))
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const data = {
      sensorName,
      unit: sensorUnit,
      sensorMode: sensorType.toLowerCase(),
      minThreshold:
        sensorType === "OUTPUT" ? Number(sensorMinThreshold) : undefined,
      maxThreshold:
        sensorType === "OUTPUT" ? Number(sensorMaxThreshold) : undefined,
    };

    if (sensorType === "INPUT") {
      delete data.minThreshold;
      delete data.maxThreshold;
    }

    try {
      const response = await createSensor(projectId, data);

      if (response.status === "success") {
        toast.success(response.message);

        const newSensor = {
          ...response.sensor,
          id: response.sensor._id,
          name: response.sensor.sensorName,
          type: response.sensor.sensorMode?.toUpperCase(),
        };

        changeSensors([...sensors, newSensor]);

        setSensorName("");
        setSensorType("");
        setSensorUnit("");
        setSensorMinThreshold("");
        setSensorMaxThreshold("");

        handleOpen();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create sensor");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // UPDATE SENSOR
  // ==============================
  const handleUpdateSensor = async () => {
    if (!sensorId) {
      toast.error("Select a sensor first.");
      return;
    }

    setLoading(true);

    const data = {
      sensorName,
      unit: sensorUnit,
      sensorMode: sensorType.toLowerCase(),
      minThreshold:
        sensorType === "OUTPUT" ? Number(sensorMinThreshold) : undefined,
      maxThreshold:
        sensorType === "OUTPUT" ? Number(sensorMaxThreshold) : undefined,
    };

    if (sensorType === "INPUT") {
      delete data.minThreshold;
      delete data.maxThreshold;
    }

    try {
      const response = await updateSensor(projectId, sensorId, data);

      if (response.status === "success") {
        toast.success(response.message);

        const updatedSensor = {
          ...response.sensor,
          id: response.sensor._id,
        };

        changeSensors(
          sensors.map((sensor) =>
            sensor.id === sensorId ? updatedSensor : sensor,
          ),
        );

        handleOpen();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update sensor");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // DELETE SENSOR
  // ==============================
  const handleDelete = async () => {
    if (!sensorId) {
      toast.error("Select a sensor first.");
      return;
    }

    setLoading(true);

    try {
      const response = await deleteSensor(projectId, sensorId);

      if (response.status === "success") {
        toast.success(response.message);

        changeSensors(sensors.filter((sensor) => sensor.id !== sensorId));

        handleOpen();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete sensor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="w-full grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger
          value="create"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
        >
          Create
        </TabsTrigger>
        <TabsTrigger
          value="update"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
        >
          Update
        </TabsTrigger>
        <TabsTrigger
          value="delete"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md transition-all"
        >
          Delete
        </TabsTrigger>
      </TabsList>

      {/* CREATE */}
      <TabsContent value="create">
        <Card className="bg-white border border-gray-200 shadow-lg mt-4">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
            <CardTitle className="text-white">Create Sensor</CardTitle>
            <CardDescription className="text-gray-100">
              Add new sensor to your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Sensor Name</Label>
              <Input
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                className="bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                placeholder="Enter sensor name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Sensor Type</Label>
              <Select
                onValueChange={(value) => {
                  setSensorType(value);
                  if (value === "INPUT") {
                    setSensorUnit("status");
                    setSensorMinThreshold("0");
                    setSensorMaxThreshold("1");
                  }
                }}
              >
                <SelectTrigger className="bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectGroup>
                    <SelectItem
                      value="INPUT"
                      className="hover:bg-gray-100 focus:bg-gray-100"
                    >
                      INPUT
                    </SelectItem>
                    <SelectItem
                      value="OUTPUT"
                      className="hover:bg-gray-100 focus:bg-gray-100"
                    >
                      OUTPUT
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Unit</Label>
              <Input
                value={sensorType === "INPUT" ? "status" : sensorUnit}
                onChange={(e) => setSensorUnit(e.target.value)}
                disabled={sensorType === "INPUT"}
                className={`bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg ${sensorType === "INPUT" ? "bg-gray-100 text-gray-500" : ""}`}
                placeholder="Enter unit (e.g., °C, %, status)"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Min Threshold</Label>
              <Input
                value={sensorType === "INPUT" ? "0" : sensorMinThreshold}
                onChange={(e) => setSensorMinThreshold(e.target.value)}
                disabled={sensorType === "INPUT"}
                className={`bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg ${sensorType === "INPUT" ? "bg-gray-100 text-gray-500" : ""}`}
                placeholder="Enter minimum threshold"
                type="number"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Max Threshold</Label>
              <Input
                value={sensorType === "INPUT" ? "1" : sensorMaxThreshold}
                onChange={(e) => setSensorMaxThreshold(e.target.value)}
                disabled={sensorType === "INPUT"}
                className={`bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg ${sensorType === "INPUT" ? "bg-gray-100 text-gray-500" : ""}`}
                placeholder="Enter maximum threshold"
                type="number"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Button
              onClick={handleOpen}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSensor}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Sensor"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* UPDATE */}
      <TabsContent value="update">
        <Card className="bg-white border border-gray-200 shadow-lg mt-4">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-lg">
            <CardTitle className="text-white">Update Sensor</CardTitle>
            <CardDescription className="text-gray-100">
              Select a sensor to update its details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Select Sensor</Label>
              <Select
                onValueChange={(value) => {
                  setSensorId(value);
                  const selected = sensors.find((s) => s.id === value);
                  if (selected) {
                    setSensorName(selected.sensorName);
                    setSensorType(selected.sensorMode?.toUpperCase());
                    setSensorUnit(selected.unit);
                    setSensorMinThreshold(selected.minThreshold || "");
                    setSensorMaxThreshold(selected.maxThreshold || "");
                  }
                }}
              >
                <SelectTrigger className="bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <SelectValue placeholder="Choose sensor" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectGroup>
                    {sensors.map((sensor) => (
                      <SelectItem
                        key={sensor.id}
                        value={sensor.id}
                        className="hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {sensor.sensorName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Sensor Name</Label>
              <Input
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
                className="bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                placeholder="Enter sensor name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Unit</Label>
              <Input
                value={sensorUnit}
                onChange={(e) => setSensorUnit(e.target.value)}
                className="bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
                placeholder="Enter unit"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Button
              onClick={handleOpen}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSensor}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? "Updating..." : "Update Sensor"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* DELETE */}
      <TabsContent value="delete">
        <Card className="bg-white border border-gray-200 shadow-lg mt-4">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 rounded-t-lg">
            <CardTitle className="text-white">Delete Sensor</CardTitle>
            <CardDescription className="text-gray-100">
              Select a sensor to permanently delete
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Select Sensor</Label>
              <Select onValueChange={(value) => setSensorId(value)}>
                <SelectTrigger className="bg-gray-50 border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500">
                  <SelectValue placeholder="Choose sensor" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectGroup>
                    {sensors.map((sensor) => (
                      <SelectItem
                        key={sensor.id}
                        value={sensor.id}
                        className="hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {sensor.sensorName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <Button
              onClick={handleOpen}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {loading ? "Deleting..." : "Delete Sensor"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ManageSensors;
