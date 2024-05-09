const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  customer_name: { type: String },
  product_name: { type: String },
  order_amount: { type: Number, require: true },
});

module.exports = mongoose.model("orders", orders);
