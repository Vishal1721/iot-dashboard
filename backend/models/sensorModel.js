const Sensor = require("./sensorSchema");
const SensorData = require("./sensorDataModel");

class SensorModel {
  static async createSensor(sensorData) {
    return await Sensor.create(sensorData);
  }

  static async findSensorById(id) {
    return await Sensor.findById(id);
  }

  static async findSensorByNameAndProjectId(sensorName, projectId) {
    return await Sensor.findOne({
      sensorName: { $regex: `^${sensorName}$`, $options: "i" },
      project: projectId,
    });
  }

  static async findSensorByName(sensorName) {
    return await Sensor.findOne({ sensorName });
  }

  static async findByProjectId(projectId) {
    return await Sensor.find({ project: projectId });
  }

  static async getAllSensors() {
    return await Sensor.find();
  }

  static async updateSensor(id, sensorData) {
    return await Sensor.findByIdAndUpdate(id, sensorData, { new: true });
  }

  static async deleteSensor(id) {
    return await Sensor.findByIdAndDelete(id);
  }

  static async deleteSensorDataBySensorId(sensorId) {
    return await SensorData.deleteMany({ sensor: sensorId });
  }

  //SENSOR DATA METHODS

  static async createSensorData(sensorData) {
    return await SensorData.create(sensorData);
  }

  static async findSensorDataById(id) {
    return await SensorData.findById(id);
  }

  static async findSensorDataByIds(ids) {
    return await SensorData.find({
      _id: { $in: ids },
    });
  }
  static async findSensorDataBySensorId(sensorId) {
    return await SensorData.find({ sensor: sensorId }).sort({ createdAt: -1 }); // 🔥 latest first
  }

  static async deleteSensorData(id) {
    return await SensorData.findByIdAndDelete(id);
  }

  static async deleteMultipleSensorData(ids) {
    return await SensorData.deleteMany({
      _id: { $in: ids },
    });
  }
}

module.exports = SensorModel;
