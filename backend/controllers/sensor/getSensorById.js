const SensorModel = require("../../models/sensorModel");

const getSensorById = async (req, res) => {
  console.log(
    "Getting sensor with ID:",
    req.params.sensorId,
    "for project:",
    req.params.projectId,
  );
  const { sensorId, projectId } = req.params;

  try {
    const sensor = await SensorModel.findSensorById(sensorId);

    if (!sensor || sensor.project.toString() !== projectId) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found in this project",
      });
    }

    return res.status(200).json({
      status: "success",
      sensor,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = getSensorById;
