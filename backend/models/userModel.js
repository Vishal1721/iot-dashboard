const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    registerNumber: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
    batch: { type: Number, required: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

class UserModel {
  static async createUser(userData) {
    return await User.create(userData);
  }

  static async findByEmail(email) {
    return await User.findOne({ email });
  }

  static async findByEmailOrUsername(email, username) {
    return await User.findOne({
      $or: [{ email }, { username }],
    });
  }

  static async findById(id) {
    return await User.findById(id).select("-password");
  }

  static async updateUser(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select(
      "-password",
    );
  }

  static async updateUserRole(id, role) {
    return await User.findByIdAndUpdate(id, { role }, { new: true }).select(
      "-password",
    );
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  static async getAllUsers() {
    return await User.find().select("-password");
  }
}

module.exports = UserModel;
