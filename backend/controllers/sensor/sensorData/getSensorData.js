const SensorModel = require("../../../models/sensorModel");
const ProjectModel = require("../../../models/projectModel");
const Joi = require("joi");

const getSensorData = async (req, res) => {
  const paramsSchema = Joi.object({
    projectId: Joi.string().length(24).hex().required(),
    sensorId: Joi.string().length(24).hex().required(),
  });

  const { error, value } = paramsSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((d) => d.message).join(", "),
    });
  }

  try {
    // 1️⃣ Check project
    const project = await ProjectModel.findProjectById(value.projectId);
    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // 2️⃣ Check sensor
    const sensor = await SensorModel.findSensorById(value.sensorId);
    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found",
      });
    }
    console.log("Sensor project:", sensor.project.toString());
    console.log("Requested project:", value.projectId);

    // 3️⃣ Ensure sensor belongs to project
    if (sensor.project.toString() !== value.projectId) {
      return res.status(400).json({
        status: "error",
        message: "Sensor does not belong to this project",
      });
    }
    // 4️⃣ Get sensor data
    const sensorData = await SensorModel.findSensorDataBySensorId(
      value.sensorId,
    );

    return res.status(200).json({
      status: "success",
      message: "Sensor data fetched successfully",
      data: sensorData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = getSensorData;
