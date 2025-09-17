const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
  role: { type: String, require: true, default: "attendee" },
  OTP: { type: Number, default: null },
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Attendee', attendeeSchema);