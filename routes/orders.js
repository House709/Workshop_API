var express = require("express");
var router = express.Router();
const orderModel = require("../models/orderModel");
const mongoose = require("mongoose");

router.get("/", async function (req, res, next) {
  try {
    let orders = await orderModel.find();
    return res.status(201).send({
      data: orders,
      message: "Get order success",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Get order fail",
      success: false,
    });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }

    await orderModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    return res.status(200).send({
      message: "Delete Success",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error",
      success: false,
    });
  }
});

module.exports = router;
