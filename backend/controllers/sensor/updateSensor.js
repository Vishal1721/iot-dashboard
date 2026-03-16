const Joi = require("joi");
const SensorModel = require("../../models/sensorModel");

const updateSensor = async (req, res) => {
  const schema = Joi.object({
    sensorName: Joi.string().optional(),
    unit: Joi.string().optional(),
    sensorMode: Joi.string().valid("input", "output").optional(),
    minThreshold: Joi.number().optional(),
    maxThreshold: Joi.number().optional(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { sensorId } = req.params;

  try {
    const updatedSensor = await SensorModel.updateSensor(sensorId, value);

    if (!updatedSensor) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found",
      });
    }

    return res.status(200).json({
      status: "success",
      sensor: updatedSensor,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = updateSensor;
