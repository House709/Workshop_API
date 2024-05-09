var express = require("express");
var router = express.Router();
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    let user = await Users.findOne({
      username,
    });
    if (!user) {
      return res.status(500).send({
        status: "500",
        message: "Login fail",
      });
    }
    const checkPassword = bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({
        status: "500",
        message: "Login fail",
      });
    }
    if (!user.isApprove) {
      return res.status(401).send("Please wait admin approve.");
    }
    const token = jwt.sign(
      {
        _id: user._id,
        username: username,
        isApprove: user.isApprove,
        role: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    process.env.JWT_KEY;

    return res.status(201).send({
      status: "201",
      message: "Login success",
      token,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "500",
      message: "Login fail",
    });
  }
});

module.exports = router;
