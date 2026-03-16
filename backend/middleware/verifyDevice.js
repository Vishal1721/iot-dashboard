const ProjectModel = require("../models/projectModel");

const verifyDevice = async (req, res, next) => {
  const deviceKey = req.headers["x-device-key"];

  console.log("All headers:", req.headers);
  console.log("Device key received:", deviceKey);

  try {
    const projectName = req.params.projectName;

    console.log("Project Name from params:", projectName);

    const project = await ProjectModel.findProjectByName(projectName);

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    console.log("Project found:", project.projectName);
    console.log("Expected key:", project.deviceKey);

    if (!deviceKey || deviceKey !== project.deviceKey) {
      return res.status(401).json({
        status: "error",
        message: "Invalid device key",
      });
    }

    // attach project to request for controllers
    req.project = project;

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = verifyDevice;
