const authorizeAdmin = (req, res, next) => {
  if (req.user.role?.toLowerCase() !== "admin") {
    console.log("User from token:", req.user);
    return res.status(403).json({
      status: "error",
      message: "Admin access required",
    });
  }

  next();
};

module.exports = authorizeAdmin;
