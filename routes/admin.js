var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
require("dotenv").config();

router.patch("/approve/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }
    await userModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { isApprove: true } }
    );
    let user = await userModel.findById(id);
    return res.status(200).json({
      data: user,
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

router.get("/userList", async function (req, res, next) {
  try {
    let userList = await userModel.find({ role: "user" });
    return res.status(200).json({
      status: "200",
      message: "Get user success",
      data: userList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

router.get("/adminList", async function (req, res, next) {
  try {
    let userList = await userModel.find({ role: "user" });
    return res.status(200).json({
      status: "200",
      message: "Get user success",
      data: userList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
});

module.exports = router;
