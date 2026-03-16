import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "@/APIs/UserAPI";
import { useNavigate } from "react-router-dom";
import { getProjectsByUserId } from "@/APIs/profileApi";
import { updateUser } from "@/APIs/UserAPI";

import { FaEdit } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card1";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog1";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button1";
import { getToken } from "@/utils/auth";

const containerVariants = {
  hidden: { opacity: 0, y: -100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Profile = () => {
  const { user, fetchUserData, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [projects, setProjects] = useState([]);
  const [editUser, setEditUser] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.email,
    )}&background=random&color=ffffff&bold=true`;

    setProfileImageUrl(avatarUrl);
    setEditUser(user);

    const fetchProject = async () => {
      try {
        const projectsData = await getProjectsByUserId(user._id);
        setProjects(projectsData || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProject();
  }, [user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const updatedUser = await updateUser(editUser);
      setEditUser(updatedUser.data);

      toast({
        variant: "success",
        title: updatedUser?.status,
        description: updatedUser?.message,
      });

      fetchUserData(getToken(), updatedUser.data.id);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "Failed to update user",
        description: "Please try again later",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmDelete) return;

    const response = await deleteUser();

    if (response.status === "success") {
      logout();
      navigate("/login");
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.message,
      });
    }
  };

  return (
    <div className="w-full h-full mt-64 pt-10 sm:mt-10 sm:pt-8 md:pt-5 lg:mt-0 flex flex-col sm:flex-row items-center justify-center p-2 sm:p-3 md:p-4 lg:p-8 sm:space-x-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Card className="shadow-lg mb-4 sm:mb-0 w-full">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader className="bg-gradient-to-br from-primary to-blue-800 text-white rounded-t-lg pb-3">
              <div>
                <Dialog>
                  <DialogTrigger className="w-full">
                    <FaEdit className="float-right text-white text-2xl cursor-pointer hover:text-gray-200" />
                  </DialogTrigger>

                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 font-semibold">
                        Edit Profile
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Update your profile details below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <Input
                        className="bg-gray-50 border-gray-300 focus:border-blue-500"
                        name="username"
                        value={editUser.username}
                        onChange={handleInputChange}
                        placeholder="Username"
                      />
                      <Input
                        className="bg-gray-50 border-gray-300 focus:border-blue-500"
                        name="firstName"
                        value={editUser.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />
                      <Input
                        className="bg-gray-50 border-gray-300 focus:border-blue-500"
                        name="lastName"
                        value={editUser.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                      />
                      <Input
                        className="bg-gray-50 border-gray-300 focus:border-blue-500"
                        name="registerNumber"
                        value={editUser.registerNumber}
                        onChange={handleInputChange}
                        placeholder="Register Number"
                      />
                      <Input
                        className="bg-gray-50 border-gray-300 focus:border-blue-500"
                        name="batch"
                        value={editUser.batch}
                        onChange={handleInputChange}
                        placeholder="Batch"
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          onClick={handleSubmit}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Save
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col items-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="rounded-full h-48 w-48 mb-4 border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="rounded-full h-48 w-48 mb-4 bg-gray-400"></div>
                )}

                <CardTitle className="text-xl font-bold mb-0 text-white">
                  My Profile
                </CardTitle>
                <CardDescription className="text-gray-100">
                  View and edit your profile
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="py-6 px-2 sm:px-4 md:px-8 bg-gray-50 rounded-b-lg">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="font-semibold text-gray-700">Email:</div>
                <div className="text-gray-600 font-medium">{user.email}</div>

                <div className="font-semibold text-gray-700">Username:</div>
                <div className="text-gray-600 font-medium">{user.username}</div>

                <div className="font-semibold text-gray-700">First Name:</div>
                <div className="text-gray-600 font-medium">
                  {user.firstName}
                </div>

                <div className="font-semibold text-gray-700">Last Name:</div>
                <div className="text-gray-600 font-medium">{user.lastName}</div>

                <div className="font-semibold text-gray-700">
                  Register Number:
                </div>
                <div className="text-gray-600 font-medium">
                  {user.registerNumber}
                </div>

                <div className="font-semibold text-gray-700">Batch:</div>
                <div className="text-gray-600 font-medium">{user.batch}</div>

                <div className="font-semibold text-gray-700">Role:</div>
                <div className="text-gray-600 font-medium">
                  {user.role === "user" ? "user" : "admin"}
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white w-full"
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <Card className="shadow-lg mb-4 sm:mb-0 w-full">
          <CardHeader className="bg-gradient-to-br from-primary to-blue-800 text-white rounded-t-lg pb-3">
            <CardTitle className="text-xl font-bold mb-0 text-center">
              Projects and Sensors
            </CardTitle>
            <CardDescription className="text-base text-gray-100 text-center">
              Here is the list of project you created
            </CardDescription>
          </CardHeader>

          <CardContent className="py-6 px-2 sm:px-4 md:px-8 bg-gray-50 rounded-b-lg">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="mb-4 bg-white p-4 shadow-md rounded-lg border border-gray-200"
              >
                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div className="text-lg font-bold text-gray-800">
                    Project Name:
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {project.projectName}
                  </div>

                  <div className="text-gray-600 font-medium">Description:</div>
                  <div className="text-gray-600 font-medium">
                    {project.description}
                  </div>

                  <div className="text-gray-600 font-medium">
                    MicroController:
                  </div>
                  <div className="text-gray-600 font-medium">
                    {project.MicroController}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
