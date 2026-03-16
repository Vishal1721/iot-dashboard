import api from "@/utils/api";

export const getProjectsByUserId = async (userId) => {
  try {
    const response = await api.get(`/projects/getByUser/${userId}`);

    console.log("Projects fetched successfully:", response.data);

    return response.data.projects || [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};
