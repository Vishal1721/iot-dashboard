const Joi = require("joi");
const SensorModel = require("../../../models/sensorModel");
const ProjectModel = require("../../../models/projectModel");
const UserModel = require("../../../models/userModel");
const sendEmail = require("../../../utils/email");

const lastEmailSentTime = {};

const formatEmailContent = (
  username,
  sensorName,
  sensorValue,
  minThreshold,
  maxThreshold,
) => {
  return `
    <div style="font-family: Arial;">
      <h2 style="color:red;">🚨 Sensor Alert 🚨</h2>
      <p>Dear ${username},</p>
      <p>
        Sensor <strong>${sensorName}</strong> reported value 
        <strong>${sensorValue}</strong> which is outside 
        range <strong>${minThreshold} - ${maxThreshold}</strong>.
      </p>
      <p>Please take immediate action.</p>
      <br/>
      <p>IoT Monitoring System</p>
    </div>
  `;
};

const sendSensorDataByName = async (req, res) => {
  const paramsSchema = Joi.object({
    projectName: Joi.string().required(),
    sensorName: Joi.string().required(),
  });

  const bodySchema = Joi.object({
    value: Joi.number().required(),
  });

  const { error: pErr, value: pVal } = paramsSchema.validate(req.params);
  if (pErr) {
    return res.status(400).json({
      status: "error",
      message: pErr.details[0].message,
    });
  }

  const { error: bErr, value: bVal } = bodySchema.validate(req.body);
  if (bErr) {
    return res.status(400).json({
      status: "error",
      message: bErr.details[0].message,
    });
  }

  try {
    console.log("Received body:", req.body);

    // 🔎 Find project
    const project = await ProjectModel.findProjectByName(pVal.projectName);

    if (!project) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    console.log("Project found:", project._id.toString());

    // 🔎 Find sensor inside project
    const sensor = await SensorModel.findSensorByNameAndProjectId(
      pVal.sensorName,
      project._id,
    );

    if (!sensor) {
      return res.status(404).json({
        status: "error",
        message: "Sensor not found in this project",
      });
    }

    console.log("Sensor found:", sensor._id.toString());

    // ⚡ Validate INPUT sensor
    if (sensor.sensorMode === "input" && ![0, 1].includes(bVal.value)) {
      return res.status(400).json({
        status: "error",
        message: "Value must be 0 or 1 for INPUT sensor",
      });
    }

    // 📦 Store sensor data
    const sensorData = await SensorModel.createSensorData({
      sensor: sensor._id,
      value: bVal.value,
    });

    console.log("Sensor data stored:", sensorData._id.toString());

    // 🚀 Emit realtime update to dashboard
    if (req.io) {
      const room = project._id.toString();

      console.log("Emitting sensorDataUpdate to room:", room);

      req.io.to(room).emit("sensorDataUpdate", {
        id: sensorData._id.toString(),
        projectId: project._id.toString(),
        sensorId: sensor._id.toString(),
        sensorName: sensor.sensorName,
        value: sensorData.value,
        timestamp: sensorData.createdAt,
      });
    }

    // ⚠ Threshold check (only for OUTPUT sensors)
    if (
      sensor.sensorMode !== "input" &&
      sensor.minThreshold !== undefined &&
      sensor.maxThreshold !== undefined &&
      (sensorData.value < sensor.minThreshold ||
        sensorData.value > sensor.maxThreshold)
    ) {
      const user = await UserModel.findById(project.owner);

      if (user && user.email) {
        const now = Date.now();
        const last = lastEmailSentTime[sensor._id] || 0;

        // ⏱ limit email frequency (15 minutes)
        if (now - last > 15 * 60 * 1000) {
          const emailBody = formatEmailContent(
            user.username,
            sensor.sensorName,
            sensorData.value,
            sensor.minThreshold,
            sensor.maxThreshold,
          );

          await sendEmail(user.email, "🚨 Sensor Alert", emailBody);

          lastEmailSentTime[sensor._id] = now;
        }
      }
    }

    return res.status(201).json({
      status: "success",
      message: "Sensor data stored successfully",
      data: sensorData,
    });
  } catch (error) {
    console.error("Error storing sensor data:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = sendSensorDataByName;
