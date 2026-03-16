import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProjects,
  getProjectsByUserId,
  deleteProject,
  updateProject,
} from "@/APIs/projectAPI";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button1";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card1";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    projectName: "",
    description: "",
    MicroController: "",
  });

  // ✅ FETCH PROJECTS
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?._id) return;

      try {
        const response = await getProjectsByUserId(user._id);

        if (response.status === "success") {
          setProjects(response.projects || []);
        } else {
          toast.error(response.message || "Failed to load projects");
        }
      } catch (err) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?._id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projectName || !formData.description || !formData.MicroController) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (isEditing) {
        const response = await updateProject(formData.id, {
          projectName: formData.projectName,
          description: formData.description,
          MicroController: formData.MicroController,
        });

        if (response.status === "success") {
          setProjects((prev) =>
            prev.map((proj) =>
              proj._id === formData.id ? response.project : proj,
            ),
          );
          toast.success(response.message);
        } else {
          toast.error(response.message || "Update failed");
        }
      } else {
        const response = await createProjects({
          projectName: formData.projectName,
          description: formData.description,
          MicroController: formData.MicroController,
        });

        if (response.status === "success") {
          setProjects((prev) => [...prev, response.project]);
          toast.success(response.message);
        } else {
          toast.error(response.message || "Create failed");
          return;
        }
      }

      setFormData({ id: "", projectName: "", description: "", MicroController: "" });
      setIsEditing(false);
      setShowForm(false);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await deleteProject(projectId);

      if (response.status === "success") {
        setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
        toast.success(response.message);
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (project) => {
    setFormData({
      id: project._id,
      projectName: project.projectName,
      description: project.description,
      MicroController: project.MicroController,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleExplore = (projectId) => {
    navigate(`/liveTracking/${projectId}`);
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-5 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          Manage & Explore Projects
        </h1>
        <Button
          onClick={() => {
            setFormData({
              id: "",
              projectName: "",
              description: "",
              MicroController: "",
            });
            setIsEditing(false);
            setShowForm(true);
          }}
        >
          Create New Project
        </Button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Project" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label htmlFor="MicroController">Microcontroller</Label>
                <Input
                  id="MicroController"
                  name="MicroController"
                  value={formData.MicroController}
                  onChange={handleInputChange}
                  placeholder="e.g. ESP32"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <Card key={project._id} className="w-72">
              <CardHeader>
                <CardTitle>{project.projectName}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <p>
                  <strong>Microcontroller:</strong> {project.MicroController}
                </p>
                {/* Device Key */}
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded mt-3">
                  <p className="text-sm font-semibold">Device Key</p>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs break-all">
                      {project.deviceKey?.slice(0, 12)}...
                    </span>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(project.deviceKey);
                        toast.success("Device key copied");
                      }}
                      className="text-xs bg-black text-white px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Pencil
                    className="cursor-pointer"
                    onClick={() => handleEdit(project)}
                  />
                  <Trash2
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(project._id)}
                  />
                </div>

                <Button
                  className="mt-4 w-full"
                  onClick={() => handleExplore(project._id)}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
