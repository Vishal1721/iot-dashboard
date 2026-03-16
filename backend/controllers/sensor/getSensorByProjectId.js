const ProjectModel = require("../../models/projectModel");
const SensorModel = require("../../models/sensorModel");

const getSensorByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Check project exists & ownership
    const project = await ProjectModel.findProjectById(projectId);
    console.log("Project found:", project);
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // Fetch sensors
    const sensors = await SensorModel.findByProjectId(projectId);

    return res.status(200).json({
      status: "success",
      count: sensors.length,
      sensors,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getSensorByProjectId;
