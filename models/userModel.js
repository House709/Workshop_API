const mongoose = require("mongoose");
const users = new mongoose.Schema(
  {
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    isApprove: { type: Boolean, default: false },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", users);
