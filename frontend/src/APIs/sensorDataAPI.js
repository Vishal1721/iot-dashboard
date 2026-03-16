import axios from "axios";
import { getToken } from "@/utils/auth";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ==============================
// Send sensor value (Frontend)
// ==============================
export const sendSensorData = async (projectId, sensorId, data) => {
  const token = getToken();

  return api.post(
    `/projects/${projectId}/sensor/${sensorId}/sendDataFromWeb`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

// ==============================
// Receive sensor values
// ==============================
export const receiveSensorData = async (projectId, sensorId) => {
  try {
    const token = getToken();

    const response = await api.get(
      `/projects/${projectId}/sensor/${sensorId}/getData`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const formatted = (response.data?.data || []).map((item) => ({
      id: item._id,
      value: item.value,
      sensorId: item.sensor,
      projectId: projectId,
      timestamp: item.createdAt,
    }));

    return { data: formatted };
  } catch (error) {
    console.error("Failed to receive sensor data:", error);
    return { data: [] };
  }
};

// ==============================
// Delete single sensor data
// ==============================
export const deleteSensorData = async (projectId, sensorId, dataId) => {
  try {
    const token = getToken();

    const response = await api.delete(
      `/projects/${projectId}/sensor/${sensorId}/deleteData/${dataId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Failed to delete sensor data:", error);
    return null;
  }
};
