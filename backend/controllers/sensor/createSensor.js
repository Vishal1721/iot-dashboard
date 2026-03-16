const Joi = require("joi");
const SensorModel = require("../../models/sensorModel");
const ProjectModel = require("../../models/projectModel");

const createSensor = async (req, res) => {
  const schema = Joi.object({
    sensorName: Joi.string().required(),

    unit: Joi.string().required(),

    sensorMode: Joi.string().valid("input", "output").required(),

    minThreshold: Joi.when("sensorMode", {
      is: "output",
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),

    maxThreshold: Joi.when("sensorMode", {
      is: "output",
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  });
  console.log(
    "Received create sensor request with body:",
    req.body,
    "and params:",
    req.params,
  );
  const { error, value } = schema.validate(req.body);

  if (error) {
    const formattedError = error.details
      .map((d) => d.message.replace(/"/g, ""))
      .join(", ");

    return res.status(400).json({
      status: "error",
      message: formattedError,
    });
  }

  const { projectId } = req.params;
  try {
    // Check project exists
    const projectExists = await ProjectModel.findProjectById(projectId);

    if (!projectExists) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    // Prevent duplicate sensor names
    const existingSensor = await SensorModel.findSensorByNameAndProjectId(
      value.sensorName,
      projectId,
    );

    if (existingSensor) {
      return res.status(409).json({
        status: "error",
        message: "Sensor name already exists in project",
      });
    }

    const minThreshold = value.sensorMode === "input" ? 0 : value.minThreshold;
    const maxThreshold = value.sensorMode === "input" ? 1 : value.maxThreshold;
    console.log(
      "Final sensor data to create:",
      minThreshold,
      maxThreshold,
      value,
      req.user.id,
    );
    const sensor = await SensorModel.createSensor({
      ...value,
      minThreshold,
      maxThreshold,
      project: projectId,
      owner: req.user.id,
    });

    return res.status(201).json({
      status: "success",
      message: "Sensor created successfully",
      sensor,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = createSensor;
