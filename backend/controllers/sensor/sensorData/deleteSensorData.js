const projectModel = require("../../../models/projectModel");
const SensorModel = require("../../../models/sensorModel");
const joi = require("joi");

const deleteSensorData = async (req, res) => {
  const paramsSchema = joi.object({
    projectId: joi.string().length(24).hex().required(),
    sensorId: joi.string().length(24).hex().required(),
    dataId: joi.string().length(24).hex().required(),
  });
  console.log(req.params);
  const { error, value } = paramsSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  try {
    // Check project
    const project = await projectModel.findProjectById(value.projectId);
    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // Find sensor data
    const sensorData = await SensorModel.findSensorDataById(value.dataId);
    if (!sensorData) {
      return res.status(404).json({
        status: "error",
        message: "Sensor data not found",
      });
    }

    // Get sensor
    const sensor = await SensorModel.findSensorById(sensorData.sensor);

    if (!sensor || sensor.project.toString() !== value.projectId) {
      return res.status(400).json({
        status: "error",
        message: "Sensor data does not belong to this project",
      });
    }

    // Delete sensor data
    await SensorModel.deleteSensorData(value.dataId);

    return res.status(200).json({
      status: "success",
      message: "Sensor data deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = deleteSensorData;
