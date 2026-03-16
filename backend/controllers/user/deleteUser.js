const UserModel = require("../../models/userModel");

const deleteUser = async (req, res) => {
  try {
        
    const deletedUser = await UserModel.deleteUser(req.user.id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile deleted",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports = deleteUser;
