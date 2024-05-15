var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "/public/product_image" });

router.get("/", async function (req, res, next) {
  try {
    let products = await productModel.find();

    return res.status(200).send({
      data: products,
      message: "success",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }
    let product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
        success: false,
      });
    }
    return res.status(200).send({
      data: product,
      message: "Success",
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

router.post(
  "/",
  upload.single("product_image"),
  async function (req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }
      const { product_name, price, amount } = req.body;

      const resizedImageBuffer = await sharp(req.file.path)
        .resize({ width: 300 })
        .toBuffer();

      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-indexed
      const year = now.getFullYear().toString();

      const folder = `${month}${year}`;
      let dbPath = `/product_image/${folder}`;
      const savePath = `./public/product_image/${folder}`;

      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath, { recursive: true });
      }
      console.log(req.file);
      const fileName =
        now.getTime() + `.` + req.file.originalname.split(".").pop();

      const imagePath = savePath + `/` + fileName;
      dbPath = dbPath + `/` + fileName;

      console.log(imagePath);
      await sharp(resizedImageBuffer).toFile(imagePath);

      let check = await productModel.findOne({ product_name });
      if (check) {
        return res.json({
          message: "Product already exits.",
        });
      }
      let newProduct = new productModel({
        product_name,
        price,
        amount,
        product_image: dbPath,
      });
      let product = await newProduct.save();
      return res.status(201).send({
        data: product,
        message: "create success",
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "create fail",
        success: false,
      });
    }
  }
);

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }
    await productModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: req.body }
    );
    let product = await productModel.findById(id);
    return res.status(200).send({
      data: product,
      message: "Update Success",
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
    await productModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
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

router.post("/:id/orders", async function (req, res, next) {
  try {
    let { order_amount } = req.body;
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }
    let product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
        success: false,
      });
    }
    const token = req.headers.authorization.split("Bearer ")[1];
    const decodedToken = jwt.decode(token);
    if (product.amount < order_amount) {
      return res.json({
        message: "Not enough product",
      });
    }
    let newOrder = new orderModel({
      customer_name: decodedToken.username,
      product_name: product.product_name,
      order_amount,
    });

    await productModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { amount: product.amount - order_amount } }
    );

    let orders = await newOrder.save();
    return res.status(201).send({
      status: 201,
      message: "Create order success",
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "create fail",
      success: false,
    });
  }
});

router.get("/:id/orders", async function (req, res, next) {
  try {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: "Invalid ID",
        success: false,
        error: ["ID is not a valid ObjectId"],
      });
    }
    let product = await productModel.findById(id);
    const orders = await orderModel.find({
      product_name: product.product_name,
    });

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
