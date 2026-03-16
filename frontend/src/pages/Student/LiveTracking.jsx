import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SwitchCard from "@/components/switch/switchCard";
import { getProjectsByUserId } from "@/APIs/projectAPI";
import { getSensorByProjectId } from "@/APIs/sensorAPI";
import {
  deleteSensorData,
  receiveSensorData,
  sendSensorData,
} from "@/APIs/sensorDataAPI";
import socket from "@/utils/socket";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog1";

import { Button } from "@/components/ui/button1";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card1";

import Loading from "@/components/loading";
import ManageSensors from "@/components/manageSensors/ManageSensors";
import GaugeCard from "@/components/gauge/gaugeCard";
import { BarChartCard } from "@/components/chart/BarChartCard";
import { LineChartCard } from "@/components/chart/LineChartCard";
import TableCard from "@/components/table/TableCard";
import { toast } from "sonner";

const LiveTracking = () => {
  const { user } = useAuth();
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // ✅ ADDED

  // ==============================
  // 1️⃣ Fetch Projects
  // ==============================
  useEffect(() => {
    if (!user?._id) return;

    const fetchProjects = async () => {
      try {
        const response = await getProjectsByUserId(user._id);
        const projectsData = response?.projects || [];

        setProjects(projectsData);

        if (projectsData.length > 0) {
          const found =
            projectsData.find((p) => p._id === projectId) || projectsData[0];

          setSelectedProject(found);
        }
      } catch (error) {
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?._id, projectId]);
  const handleDelete = async (item) => {
    try {
      await deleteSensorData(selectedProject._id, item.sensorId, item.id);

      toast.success("Deleted successfully");

      // Optional: remove from UI immediately (optimistic update)
      setSensorData((prev) =>
        prev.map((arr) => arr.filter((data) => data.id !== item.id)),
      );
    } catch (error) {
      toast.error("Failed to delete sensor data");
    }
  };
  // ==============================
  // 2️⃣ Fetch Sensors
  // ==============================
  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchSensors = async () => {
      try {
        const response = await getSensorByProjectId(selectedProject._id);

        const normalizedSensors = (
          response?.sensors ||
          response?.data ||
          []
        ).map((sensor) => ({
          ...sensor,
          id: sensor._id,
          name: sensor.sensorName,
          type: sensor.sensorMode?.toUpperCase(),
        }));
        setSensors(normalizedSensors);
      } catch (error) {
        toast.error("Failed to fetch sensors");
      }
    };

    fetchSensors();
  }, [selectedProject?._id]);

  // ==============================
  // 3️⃣ Fetch Sensor Data
  // ==============================
  useEffect(() => {
    if (!selectedProject?._id) return;

    const fetchSensorData = async () => {
      try {
        if (!Array.isArray(sensors) || sensors.length === 0) {
          setSensorData([]);
          return;
        }

        const promises = sensors.map((sensor) =>
          receiveSensorData(selectedProject._id, sensor.id),
        );

        const responses = await Promise.all(promises);
        setSensorData(responses.map((res) => res?.data || []));
      } catch (error) {
        toast.error("Failed to fetch sensor data");
      }
    };

    fetchSensorData();
  }, [sensors, selectedProject?._id, user?._id]);

  // ==============================
  // Socket Updates
  // ==============================
 useEffect(() => {
   if (!selectedProject?._id) return;

   console.log("Joining project room:", selectedProject._id);

   socket.emit("joinProject", selectedProject._id);

   const handleSensorUpdate = (data) => {
     console.log("Realtime data received:", data);

     setSensorData((prev) => {
       const updated = [...prev];

       const sensorIndex = sensors.findIndex(
         (s) => s._id === data.sensorId, // ✅ FIX HERE
       );

       if (sensorIndex !== -1) {
         updated[sensorIndex] = [
           ...(updated[sensorIndex] || []),
           {
             id: data.id,
             value: data.value,
             sensorId: data.sensorId,
             timestamp: data.timestamp,
           },
         ];
       }

       return updated;
     });
   };

   socket.on("sensorDataUpdate", handleSensorUpdate);

   return () => {
     socket.off("sensorDataUpdate", handleSensorUpdate);
   };
 }, [selectedProject?._id, sensors]);
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  // Separate sensors by type
  const outputSensors = sensors.filter(
    (sensor) => sensor.type?.toUpperCase() === "OUTPUT",
  );

 const inputSensors = sensors.filter(
   (sensor) => sensor.type?.toUpperCase() === "INPUT",
 );

  // Match sensorData correctly by index
  const outputSensorData = outputSensors.map((sensor) => {
    const index = sensors.findIndex((s) => s.id === sensor.id);
    return sensorData[index] || [];
  });

  const inputSensorData = sensors
    .map((sensor, index) =>
      sensor.type === "INPUT" ? sensorData[index] : null,
    )
    .filter(Boolean);
  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Track Individual Project</h1>

        <div className="flex items-center gap-3">
          <Select
            value={selectedProject?._id || ""}
            onValueChange={(value) =>
              setSelectedProject(projects.find((p) => p._id === value))
            }
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project._id} value={project._id}>
                  {project.projectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* ✅ ADDED Manage Sensors Button */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="bg-foreground text-white">
                Manage Sensors
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Sensors</DialogTitle>
                <DialogDescription>
                  Create, update or delete sensors.
                </DialogDescription>
              </DialogHeader>

              <ManageSensors
                projectId={selectedProject?._id}
                userId={user?._id}
                sensors={sensors}
                changeSensors={setSensors}
                handleOpen={() => setShowForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {selectedProject && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{selectedProject.projectName}</CardTitle>
            <CardDescription>{selectedProject.description}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <GaugeCard sensors={outputSensors} sensorData={outputSensorData} />
      {/* INPUT SENSORS */}
      {inputSensors.length > 0 && (
        <div className="lg:px-16 mb-6">
          <Card className="h-auto bg-quaternary rounded-xl shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Input Sensors
              </CardTitle>
              <CardDescription>
                You can control the input device here.
              </CardDescription>
            </CardHeader>

            <div className="flex flex-wrap justify-center gap-4 p-6">
              {inputSensors.map((sensor, index) => (
                <SwitchCard
                  key={sensor.id}
                  sensor={sensor}
                  sensorData={inputSensorData[index] || []}
                  onSwitchChange={async (sensorId, value) => {
                    await sendSensorData(selectedProject._id, sensorId, {
                      value,
                    });

                    const formatted = {
                      id: Date.now(),
                      value,
                      sensorId,
                      timestamp: new Date().toISOString(),
                    };

                    setSensorData((prev) =>
                      prev.map((arr, index) => {
                        const sensor = sensors[index];
                        if (sensor?.id === sensorId) {
                          return [...arr, formatted];
                        }
                        return arr;
                      }),
                    );
                  }}
                />
              ))}
            </div>
          </Card>
        </div>
      )}
      <BarChartCard sensors={sensors} sensorData={sensorData} />
      <LineChartCard sensors={sensors} sensorData={sensorData} />
      <TableCard
        sensors={sensors}
        sensorData={sensorData}
        handleDelete={handleDelete}
      />
    </div>
  );
};;

export default LiveTracking;
