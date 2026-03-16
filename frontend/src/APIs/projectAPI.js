import api from "@/utils/api";

// Create a new project
export const createProjects = async (data) => {
  try {
    const response = await api.post("/api/projects", data);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

// Read all projects by using userId
export const getProjectsByUserId = async (userId) => {
  try {
    const response = await api.get(`/api/projects/getByUser/${userId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

// Read all projects
export const getAllProjects = async () => {
  try {
    const response = await api.get("/api/projects/all");
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

// Read a project by using projectId
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/api/projects/get/${projectId}`);
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

// Update a project
export const updateProject = async (projectId, data) => {
  try {
    const response = await api.patch(
      `/api/projects/update/${projectId}`,
      data
    );
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(
      `/api/projects/delete/${projectId}`
    );
    return response.data;
  } catch (error) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message,
    };
  }
};