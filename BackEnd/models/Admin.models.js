const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
  role: { type: String, require: true, default: "admin" },
});

module.exports = mongoose.model('Admin', adminSchema);