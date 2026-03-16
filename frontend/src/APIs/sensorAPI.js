import api from "@/utils/api";

// ==============================
// Create Sensor
// Backend: POST /projects/:projectId/sensors
// ==============================
export const createSensor = async (projectId, data) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/sensors`, data);
    return response.data;
  } catch (error) {
    console.error("Create sensor error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: null,
    };
  }
};

// ==============================
// Get Sensor By ID
// Backend: GET /projects/:projectId/sensor/get/:sensorId
// ==============================
export const getSensorById = async (projectId, sensorId) => {
  try {
    const response = await api.get(
      `/api/projects/${projectId}/sensor/get/${sensorId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Get sensor error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: null,
    };
  }
};

// ==============================
// Get Sensors By Project
// Backend: GET /projects/:projectId/sensors/getByProject
// ==============================
export const getSensorByProjectId = async (projectId) => {
  try {
    const response = await api.get(
      `/api/projects/${projectId}/sensors/getByProject`,
    );
    return response.data;
  } catch (error) {
    console.error("Get sensors error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: [],
    };
  }
};

// ==============================
// Get All Sensors (Admin)
// Backend: POST /projects/:projectId/sensor/getAll
// ==============================
export const getAllSensors = async (projectId) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/sensor/getAll`);
    return response.data;
  } catch (error) {
    console.error("Get all sensors error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: [],
    };
  }
};
export const getAdminSensorsByProject = async (projectId) => {
  try {
    const response = await api.get(`/api/admin/projects/${projectId}/sensors`);
    return response.data;
  } catch (error) {
    console.error("Get admin sensors error:", error);
    return {
      status: "error",
      data: [],
    };
  }
};
// ==============================
// Update Sensor
// Backend: PATCH /projects/:projectId/sensor/update/:sensorId
// ==============================
export const updateSensor = async (projectId, sensorId, data) => {
  try {
    const response = await api.patch(
      `/api/projects/${projectId}/sensor/update/${sensorId}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Update sensor error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: null,
    };
  }
};

// ==============================
// Delete Sensor
// Backend: DELETE /projects/:projectId/sensor/delete/:sensorId
// ==============================
export const deleteSensor = async (projectId, sensorId) => {
  try {
    const response = await api.delete(
      `/api/projects/${projectId}/sensor/delete/${sensorId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Delete sensor error:", error);
    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Server Error",
      data: null,
    };
  }
};
