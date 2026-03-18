import api from "./api";

export const getStatus = async () => {
  try {
    const response = await api.get(`/api/users/profile`);

    if (response?.data?.status === "success") {
      return "Connected";
    }

    return "Disconnected";
  } catch (error) {
    const message = error?.response?.data?.message;

    if (message?.includes("Invalid") || error?.response?.status === 403) {
      return "Expired";
    }

    return "Disconnected";
  }
};
