const SensorModel = require("../../../models/sensorModel");
const ProjectModel = require("../../../models/projectModel");
const Joi = require("joi");

const getSensorDataByName = async (req, res) => {
  const paramsSchema = Joi.object({
    projectName: Joi.string().required(),
    sensorName: Joi.string().required(),
  });

  const { error, value } = paramsSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details.map((d) => d.message).join(", "),
    });
  }

  try {
    // 1️⃣ Find project by name
    const project = await ProjectModel.findProjectByName(value.projectName);

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // 2️⃣ Find sensor inside that project
    const sensor = await SensorModel.findSensorByNameAndProjectId(
      value.sensorName,
      project._id,
    );

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found in this project",
      });
    }

    // 3️⃣ Get sensor data
    const sensorData = await SensorModel.findSensorDataBySensorId(sensor._id);

    // Optional: emit (not usually needed for GET)
    if (req.io) {
      req.io.to(project._id.toString()).emit("sensorDataFetched", {
        sensorId: sensor._id,
      });
    }

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

module.exports = getSensorDataByName;
