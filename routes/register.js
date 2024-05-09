var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Users = require("../models/userModel");

router.post("/", async function (req, res, next) {
  try {
    let { password, username } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
      username,
      password: hashPassword,
    });
    const user = await newUser.save();
    return res.status(200).send({
      data: user,
      message: "Create Success",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      status: "500",
      message: "Create Fail",
      success: false,
    });
  }
});
module.exports = router;
