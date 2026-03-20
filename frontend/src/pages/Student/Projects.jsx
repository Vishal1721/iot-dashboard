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
import { Pencil, Trash2, Cpu, ArrowRight, Plus } from "lucide-react";
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
    if (
      !formData.projectName ||
      !formData.description ||
      !formData.MicroController
    ) {
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
      setFormData({
        id: "",
        projectName: "",
        description: "",
        MicroController: "",
      });
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

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <>
      <style>{`
        .project-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .project-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.13);
          border-color: rgba(255,255,255,0.16) !important;
        }
        .explore-btn {
          background: linear-gradient(135deg, #4f6ef7 0%, #6c8fff 100%);
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(79,110,247,0.35);
        }
        .explore-btn:hover {
          background: linear-gradient(135deg, #3a57e8 0%, #5a7aff 100%);
          box-shadow: 0 6px 22px rgba(79,110,247,0.55);
          transform: translateY(-1px);
        }
        .explore-btn:active { transform: translateY(0); }
        .icon-edit {
          transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease;
          border-radius: 8px;
        }
        .icon-edit:hover {
          color: #60a5fa !important;
          background: rgba(96,165,250,0.14);
          transform: scale(1.18);
        }
        .icon-delete {
          transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease;
          border-radius: 8px;
        }
        .icon-delete:hover {
          color: #f87171 !important;
          background: rgba(248,113,113,0.14);
          transform: scale(1.18);
        }
        .copy-btn {
          transition: background 0.15s ease, color 0.15s ease;
        }
        .copy-btn:hover {
          background: rgba(255,255,255,0.18) !important;
          color: #fff;
        }
        .create-btn-top {
          background: linear-gradient(135deg, #4f6ef7 0%, #6c8fff 100%);
          box-shadow: 0 4px 14px rgba(79,110,247,0.3);
          transition: all 0.2s ease;
        }
        .create-btn-top:hover {
          box-shadow: 0 6px 22px rgba(79,110,247,0.5);
          transform: translateY(-1px);
        }
        .form-input:focus {
          border-color: rgba(79,110,247,0.6) !important;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.15) !important;
          outline: none !important;
        }
        .card-accent {
          height: 2px;
          border-radius: 12px 12px 0 0;
          background: linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%);
        }
      `}</style>

      <div className="p-5 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Manage & Explore Projects
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
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
            className="create-btn-top flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={15} />
            Create New Project
          </button>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className="rounded-2xl p-6 w-full max-w-md"
              style={{
                background: "#181b2a",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.65)",
              }}
            >
              <h2 className="text-lg font-semibold text-white">
                {isEditing ? "Edit Project" : "Create New Project"}
              </h2>
              <p className="text-gray-500 text-sm mt-1 mb-5">
                {isEditing
                  ? "Update your project details below."
                  : "Fill in the details to get started."}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  {
                    id: "projectName",
                    label: "Project Name",
                    placeholder: "Enter project name",
                  },
                  {
                    id: "description",
                    label: "Description",
                    placeholder: "Enter description",
                  },
                  {
                    id: "MicroController",
                    label: "Microcontroller",
                    placeholder: "e.g. ESP32",
                  },
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium"
                    >
                      {label}
                    </label>
                    <Input
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className="form-input w-full bg-[#0d0f1c] border border-white/10 text-white placeholder:text-gray-600 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                ))}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="explore-btn px-5 py-2 text-sm text-white font-semibold rounded-lg"
                  >
                    {isEditing ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-wrap gap-5">
          {projects.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-24 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <Cpu size={22} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">No projects yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Create your first project to get started
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project._id}
                className="project-card w-72 rounded-xl flex flex-col overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
                }}
              >
                {/* Top accent bar */}
                <div className="card-accent" />

                {/* Header section */}
                <div className="p-5 pb-3">
                  <h3 className="text-white font-semibold text-base leading-snug">
                    {project.projectName}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 leading-snug">
                    {project.description}
                  </p>
                </div>

                {/* Body */}
                <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
                  {/* Microcontroller — strong badge hierarchy */}
                  <div className="flex items-center gap-2">
                    <Cpu size={12} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">
                      MCU
                    </span>
                    <span
                      className="ml-auto text-xs font-mono font-bold px-2.5 py-0.5 rounded-md"
                      style={{
                        background: "rgba(79,110,247,0.15)",
                        color: "#8aabff",
                        border: "1px solid rgba(79,110,247,0.2)",
                      }}
                    >
                      {project.MicroController}
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  />

                  {/* Device Key */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: "rgba(0,0,0,0.22)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-wider mb-2 font-medium"
                      style={{ color: "#5a6180" }}
                    >
                      Device Key
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-gray-500 break-all">
                        {project.deviceKey?.slice(0, 14)}...
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(project.deviceKey);
                          toast.success("Device key copied");
                        }}
                        className="copy-btn flex-shrink-0 text-xs text-gray-300 px-2.5 py-1 rounded-md font-medium"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Edit / Delete — clearly clickable */}
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleEdit(project)}
                        className="icon-edit p-2 text-gray-500 cursor-pointer"
                        title="Edit project"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="icon-delete p-2 text-gray-500 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Explore — dominant CTA */}
                    <button
                      onClick={() => handleExplore(project._id)}
                      className="explore-btn flex items-center gap-1.5 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                    >
                      Explore
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;

export default Projects;
