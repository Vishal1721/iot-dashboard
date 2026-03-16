const ProjectModel = require("../../models/projectModel");

const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.getAllProjects();
    console.log("projects →", projects);

    return res.status(200).json({
      status: "success",
      count: projects.length,
      projects,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getAllProjects;
