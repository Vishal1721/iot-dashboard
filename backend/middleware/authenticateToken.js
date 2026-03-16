const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  //Get Authorization header
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access token required",
    });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded)
    console.log("Token", token)
    req.user = decoded; // { id: ... }

    next(); 
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticateToken;
