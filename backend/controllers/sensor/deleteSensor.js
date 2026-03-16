const SensorModel = require("../../models/sensorModel");

const deleteSensor = async (req, res) => {
  const { sensorId } = req.params;

  try {
    const deletedSensor = await SensorModel.deleteSensor(sensorId);

    if (!deletedSensor) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Sensor deleted",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = deleteSensor;
