 import api from "@/utils/api"

 
export const getAllUser = async () => {
  try {
    const response = await api.get("/api/users");
    return response.data;
  } catch (error) {
    console.log("Failed to retrieve users:", error);

    return {
      status: error.response?.status,
      message: error.response?.data?.message,
      users: [],
    };
  }
};

export const updateUser = async (userData) => {
    try {
        if(userData){
            const { createdAt, updatedAt, ...rest } = userData;
            userData = rest;
        }
        const response = await api.patch('/api/users/update', userData);
        // console.log(response.data.message);
        return response.data;
    } catch (error) {
        console.log('Failed to update user:', error);
        return "Failed to update user";
    }
 }

 export const deleteUser = async () => {
   try {
     const response = await api.delete("/api/users/profile");
     return response.data;
   } catch (error) {
     console.error("Delete account error:", error);
     return {
       status: "error",
       message: "Failed to delete account",
     };
   }
 };