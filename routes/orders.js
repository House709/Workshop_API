var express = require("express");
var router = express.Router();
const orderModel = require("../models/orderModel");

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

module.exports = router;
