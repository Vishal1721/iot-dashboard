import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import {
  deleteProject,
  getAllProjects,
  updateProject,
} from "@/APIs/projectAPI";
import { getAllUser } from "@/APIs/UserAPI";

import { Button } from "@/components/ui/button1";
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
} from "@/components/ui/dialog1";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Loading from "@/components/loading";

import { toast } from "sonner";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.5 } },
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

const ManageProject = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    microcontroller: "",
    id: user?._id || "",
  });

  useEffect(() => {
    if (!user?._id) return;

    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();

        if (response.status === "success") {
          setProjects(response.projects);
        }

        const usersRes = await getAllUser();

        if (usersRes.status === "success") {
          setAllUsers(usersRes.users);
        }
      } catch (error) {
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?._id]);

  const handleDelete = async (projectId) => {
    try {
      const response = await deleteProject(projectId);

      if (response.status === "success") {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId),
        );
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.title ||
        !formData.description ||
        !formData.microcontroller
      ) {
        setShowForm(false);
        toast.error("Please fill all fields");
        return;
      }

      const requestData = {
        projectName: formData.title,
        description: formData.description,
        MicroController: formData.microcontroller,
      };

      if (isEditing) {
        const response = await updateProject(formData.id, requestData);

        if (response.status === "success") {
          setProjects((prev) =>
            prev.map((project) =>
              project._id === formData.id ? response.data : project,
            ),
          );
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }

      setFormData({ title: "", description: "", microcontroller: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create project:", error);
      toast.error("Failed to create project" + error);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.projectName,
      description: project.description,
      microcontroller: project.MicroController,
      id: project._id,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDialogClose = () => {
    setFormData({ title: "", description: "", microcontroller: "" });
    setShowForm(false);
    setIsEditing(false);
  };

  const handleExplore = (projectId) => {
    navigate(`/allTracking/${projectId}`);
  };

  if (loading) {
    return (
      <div className="relative h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      className="p-3 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <h1 className="flex items-center mt-4 ml-5 text-lg sm:text-xl lg:text-2xl text-foreground font-bold">
          Manage & Explore Projects
        </h1>
        <div className="w-full overflow-auto py-8">
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.length > 0 ? (
              projects.map((project) => {
                const projectUser = allUsers.find(
                  (u) => u._id.toString() === project.owner.toString(),
                );
                return (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileFocus={{ scale: 1.05 }}
                    whileHover="hover"
                  >
                    <Card className="bg-quaternary rounded-xl shadow-md w-80 md:w-64 lg:w-72 max-w-full h-fit">
                      <CardHeader className=" bg-gradient-to-r from-foreground to-tertiary text-secondary  rounded-t-xl flex justify-between">
                        <div className="flex flex-row justify-between">
                          <HoverCard>
                            <HoverCardTrigger>
                              <Trash2
                                className="h-6 w-6 text-destructive cursor-pointer float-right"
                                onClick={() => handleDelete(project._id)}
                              />
                            </HoverCardTrigger>
                            <HoverCardContent className="text-foreground bg-gray-300 w-fit cursor-pointer">
                              Delete
                            </HoverCardContent>
                          </HoverCard>

                          <Dialog open={showForm}>
                            <DialogTrigger>
                              <Pencil
                                className="h-6 w-6 float-right text-secondary-foreground cursor-pointer"
                                onClick={() => handleEdit(project)}
                              />
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md text-foreground font-bold bg-secondary rounded-xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Update project details below
                                </DialogTitle>
                                <DialogDescription>
                                  Update the project details below.
                                </DialogDescription>
                              </DialogHeader>

                              <form onSubmit={handleFormSubmit}>
                                <div className="grid gap-4">
                                  <Label className="font-medium text-foreground">
                                    Project Title:
                                  </Label>

                                  <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-100 font-medium"
                                  />

                                  <Label className="font-medium text-foreground">
                                    Project Description:
                                  </Label>

                                  <Input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-100 font-medium"
                                  />

                                  <Label className="font-medium text-foreground">
                                    Microcontroller:
                                  </Label>

                                  <Input
                                    type="text"
                                    name="microcontroller"
                                    value={formData.microcontroller}
                                    onChange={handleInputChange}
                                    required
                                    className="bg-gray-100 font-medium"
                                  />
                                </div>

                                <DialogFooter className="mt-4">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleDialogClose}
                                  >
                                    Cancel
                                  </Button>

                                  <Button
                                    type="submit"
                                    className="bg-foreground hover:bg-tertiary text-white"
                                  >
                                    Update
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="flex flex-col items-left -mr-0">
                          <CardTitle className="text-xl font-bold text-center">
                            {project.projectName}
                          </CardTitle>

                          <CardDescription className="text-base text-secondary text-center">
                            {project.description || "No description available"}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 flex flex-col justify-between bg-quaternary rounded-b-xl text-center">
                        <p className="mb-2">
                          <span className="font-semibold">
                            MicroController:
                          </span>{" "}
                          {project.MicroController || "Unknown"}
                        </p>

                        <p className="mb-1">
                          <span className="font-semibold">Name:</span>{" "}
                          {project.owner
                            ? `${project.owner.firstName} ${project.owner.lastName}`
                            : "Unknown"}
                        </p>

                        <p className="mb-1">
                          <span className="font-semibold">Reg No.:</span>{" "}
                          {project.owner?.registerNumber || "Unknown"}
                        </p>

                        <p className="mb-1">
                          <span className="font-semibold">Batch:</span>{" "}
                          {project.owner?.batch || "Unknown"}
                        </p>

                        <div className="flex justify-center">
                          <Button
                            className="bg-foreground text-white hover:bg-tertiary hover:text-secondary font-semibold mt-2"
                            onClick={() => handleExplore(project._id)}
                          >
                            Explore
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center col-span-full">No projects found.</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageProject;
