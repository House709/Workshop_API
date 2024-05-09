const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "401",
      message: "Auth failed",
    });
  }
};
