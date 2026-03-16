const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    MicroController: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deviceKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

class ProjectModel {
  static async createProject(projectData) {
    return await Project.create(projectData);
  }

  static async findProjectById(id) {
    return await Project.findById(id);
  }

  static async findByUserId(userId) {
    return await Project.find({ owner: userId });
  }

  static async findProjectByName(projectName) {
    return await Project.findOne({ projectName });
  }

  static async findUserEmailByProjectId(projectId) {
    const project = await Project.findById(projectId).populate(
      "owner",
      "email",
    );

    if (!project) {
      throw new Error("Project not found");
    }

    if (!project.owner) {
      throw new Error("User not found");
    }

    return project.owner.email;
  }

  static async getAllProjects() {
  return await Project.find().populate(
    "owner",
    "firstName lastName registerNumber batch",
  );
  }

  static async updateProject(id, projectData) {
    return await Project.findByIdAndUpdate(id, projectData, { new: true });
  }

  static async deleteProject(id) {
    return await Project.findByIdAndDelete(id);
  }
}

module.exports = ProjectModel;
