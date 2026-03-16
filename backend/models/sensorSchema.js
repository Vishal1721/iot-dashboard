const mongoose = require("mongoose");

const sensorSchema = new mongoose.Schema({
  sensorName: { type: String, required: true },

  sensorMode: {
    type: String,
    enum: ["input", "output"],
    required: true,
  },

  unit: String,
  minThreshold: Number,
  maxThreshold: Number,

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;