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
import { Settings2, Radio, ChevronDown } from "lucide-react";

const LiveTracking = () => {
  const { user } = useAuth();
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

    socket.emit("joinProject", selectedProject._id);

    const handleSensorUpdate = (data) => {
      setSensorData((prev) => {
        const updated = [...prev];
        const sensorIndex = sensors.findIndex((s) => s._id === data.sensorId);
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
    <>
      <style>{`
        .live-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(74,222,128,0.4);
          animation: pulse-live 2s infinite;
        }
        @keyframes pulse-live {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          70%  { box-shadow: 0 0 0 7px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .manage-btn {
          background: linear-gradient(135deg, #4f6ef7 0%, #6c8fff 100%);
          box-shadow: 0 4px 14px rgba(79,110,247,0.3);
          transition: all 0.2s ease;
        }
        .manage-btn:hover {
          box-shadow: 0 6px 22px rgba(79,110,247,0.5);
          transform: translateY(-1px);
        }
        .project-info-card {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .project-info-card:hover {
          border-color: rgba(255,255,255,0.15) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
        }
        .section-card {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .section-card:hover {
          border-color: rgba(255,255,255,0.13) !important;
        }
        .select-trigger-custom {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .select-trigger-custom:focus,
        .select-trigger-custom:hover {
          border-color: rgba(79,110,247,0.5) !important;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.12);
        }
      `}</style>

      <div className="p-6 w-full">
        {/* ── Top Bar ── */}
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center gap-3">
            <div className="live-dot" />
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">
                Track Individual Project
              </h1>
              <p className="text-gray-500 text-xs mt-0.5">
                Real-time sensor monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Project Selector */}
            <Select
              value={selectedProject?._id || ""}
              onValueChange={(value) =>
                setSelectedProject(projects.find((p) => p._id === value))
              }
            >
              <SelectTrigger
                className="select-trigger-custom w-[200px] border text-white text-sm rounded-lg px-3 py-2"
                style={{
                  background:
                    "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>

              <SelectContent
                style={{
                  background: "#181b28",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {projects.map((project) => (
                  <SelectItem
                    key={project._id}
                    value={project._id}
                    className="text-white focus:bg-white/10 focus:text-white text-sm"
                  >
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Manage Sensors */}
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <button className="manage-btn flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg text-sm">
                  <Settings2 size={14} />
                  Manage Sensors
                </button>
              </DialogTrigger>

              <DialogContent
                className="max-w-2xl text-white"
                style={{
                  background: "#181b28",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-white text-lg">
                    Manage Sensors
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Create, update or delete sensors for this project.
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

        {/* ── Project Info Card ── */}
        {selectedProject && (
          <div
            className="project-info-card mb-6 rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
            }}
          >
            {/* Blue accent bar */}
            <div
              style={{
                height: "2px",
                background:
                  "linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%)",
              }}
            />
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-base">
                  {selectedProject.projectName}
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {selectedProject.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Radio size={12} className="text-green-400" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Output / Gauge Section ── */}
        <GaugeCard sensors={outputSensors} sensorData={outputSensorData} />

        {/* ── Input Sensors Section ── */}
        {inputSensors.length > 0 && (
          <div className="lg:px-16 mb-6">
            <div
              className="section-card rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 28px rgba(0,0,0,0.3)",
              }}
            >
              {/* Blue accent bar */}
              <div
                style={{
                  height: "2px",
                  background:
                    "linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%)",
                }}
              />
              <div className="pt-6 pb-2 text-center px-6">
                <h2 className="text-xl font-bold text-white">Input Sensors</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Control your connected input devices below
                </p>
              </div>

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
                        prev.map((arr, i) => {
                          const s = sensors[i];
                          if (s?.id === sensorId) return [...arr, formatted];
                          return arr;
                        }),
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Charts & Table ── */}
        <BarChartCard sensors={sensors} sensorData={sensorData} />
        <LineChartCard sensors={sensors} sensorData={sensorData} />
        <TableCard
          sensors={sensors}
          sensorData={sensorData}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default LiveTracking;
