import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getAllProjects } from "@/APIs/projectAPI";
import { getAdminSensorsByProject } from "@/APIs/sensorAPI";
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
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card1";

import { Button } from "@/components/ui/button1";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog1";

import Loading from "@/components/loading";
import ManageSensors from "@/components/manageSensors/ManageSensors";
import GaugeCard from "@/components/gauge/gaugeCard";
import SwitchCard from "@/components/switch/switchCard";
import TableCard from "@/components/table/TableCard";

import { toast } from "sonner";

const AllTracking = () => {
  const { user } = useAuth();
  const { projectId } = useParams();

  const [projects, setProjects] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH PROJECTS / SENSORS / DATA
  // ===============================
  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await getAllProjects();

        setProjects(response?.projects || []);

        if (response?.projects?.length > 0) {
          const project =
            response.projects.find((proj) => proj._id === projectId) ||
            response.projects[0];

          setSelectedProject(project);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    const getSensors = async () => {
      try {
        const response = await getAdminSensorsByProject(selectedProject?._id);

        const formattedSensors = (response.data || []).map((sensor) => ({
          ...sensor,
          id: sensor._id,
          name: sensor.sensorName,
          type: sensor.sensorMode?.toUpperCase(),
        }));

        setSensors(formattedSensors);
        setSensorData([]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch sensors");
      }
    };

    const getSensorData = async () => {
      setLoading(true);

      try {
        const promises = sensors.map((sensor) =>
          receiveSensorData(selectedProject?._id, sensor.id),
        );

        const responses = await Promise.all(promises);

        setSensorData(responses.map((r) => r?.data || []));
      } catch (error) {
        console.error(error);
        toast.error("Failed to get sensor data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id && !selectedProject) getProjects();
    if (selectedProject?._id) getSensors();
    if (sensors.length > 0) getSensorData();
  }, [user?._id, selectedProject?._id, sensors.length]);

  // ===============================
  // SOCKET LISTENERS
  // ===============================

  useEffect(() => {
    socket.on("sensorData", (data) => {
      setSensorData((prev) => {
        const updated = prev.map((sensorArray) => {
          if (
            sensorArray.length > 0 &&
            sensorArray[0].sensorId === data.sensorId
          ) {
            return [...sensorArray, data];
          }

          if (sensorArray.length === 0) {
            return [data];
          }

          return sensorArray;
        });

        return updated;
      });
    });

    socket.on("deleteSensorData", (data) => {
      setSensorData((prev) =>
        prev.map((arr) => arr.filter((item) => item.id !== data.id)),
      );
    });

    return () => {
      socket.off("sensorData");
      socket.off("deleteSensorData");
    };
  }, []);

  // ===============================
  // SWITCH CHANGE
  // ===============================

  const handleSwitchChange = async (sensorId, newValue) => {
    try {
      const response = await sendSensorData(selectedProject._id, sensorId, {
        id: user?._id,
        value: newValue,
      });

      if (response?.status === "success") {
        toast.success(response?.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send sensor data");
    }
  };

  // ===============================
  // DELETE SENSOR DATA
  // ===============================

  const handleDelete = async (item) => {
    try {
      const response = await deleteSensorData(
        item?.projectId,
        item?.sensorId,
        item?.id,
        user?._id,
      );

      if (response?.status === "success") {
        toast.success("Deleted successfully");
      }
    } catch {
      toast.error("Failed to delete data");
    }
  };

  // ===============================
  // MANAGE SENSOR MODAL
  // ===============================

  const changeSensors = (newSensors) => {
    setSensors(newSensors);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="p-3 w-full">
      {/* HEADER */}

      <div className="flex justify-between items-center my-5 md:px-12 lg:px-20">
        <h1 className="text-2xl font-bold">Track Individual Project</h1>

        <Select
          value={selectedProject}
          onValueChange={(value) => setSelectedProject(value)}
        >
          <SelectTrigger className="w-[180px] bg-slate-50">
            <SelectValue
              placeholder={
                selectedProject ? selectedProject.projectName : "Select Project"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project._id} value={project}>
                {project.projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* PROJECT INFO CARD */}

      <Card className="bg-quaternary rounded-2xl shadow-xl mx-4 mb-6">
        <CardHeader className="flex items-center justify-between p-6">
          <div className="flex items-center gap-6">
            <img src="/project.png" className="w-20" />

            <div>
              <CardTitle className="text-2xl font-bold">
                {selectedProject?.projectName}
              </CardTitle>

              <CardDescription>{selectedProject?.description}</CardDescription>

              <CardDescription className="font-semibold mt-2">
                Microcontroller: {selectedProject?.MicroController}
              </CardDescription>
            </div>
          </div>

          {/* MANAGE SENSOR */}

          <Dialog open={showForm} onOpenChange={(o) => setShowForm(o)}>
            <DialogTrigger asChild>
              <Button className="bg-foreground text-white">
                Manage Sensors
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-quaternary rounded-xl">
              <DialogTitle>Manage Sensors</DialogTitle>

              <DialogDescription>
                Add / Update / Delete Sensors
              </DialogDescription>

              <ManageSensors
                projectId={selectedProject?._id}
                userId={user?._id}
                sensors={sensors}
                changeSensors={changeSensors}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* OUTPUT SENSORS */}

      <GaugeCard
        sensors={sensors.filter((sensor) => sensor.type === "OUTPUT")}
        sensorData={sensorData}
      />

      {/* INPUT SENSORS */}

      <div className="flex flex-wrap justify-center gap-4 lg:px-16">
        {sensors
          ?.filter((sensor) => sensor.type === "INPUT")
          .map((sensor, index) => (
            <SwitchCard
              key={sensor.id}
              sensor={sensor}
              sensorData={sensorData[index] || []}
              onSwitchChange={handleSwitchChange}
            />
          ))}
      </div>

      {/* TABLE */}

      <TableCard
        sensors={sensors}
        sensorData={sensorData}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AllTracking;
