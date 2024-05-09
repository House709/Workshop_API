const mongoose = require("mongoose");
const products = new mongoose.Schema({
  product_name: { type: String, unique: true, require: true },
  price: { type: Number, require: true },
  amount: { type: Number, require: true },
});

module.exports = mongoose.model("products", products);
