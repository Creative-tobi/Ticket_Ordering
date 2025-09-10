const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, unique: true },
  role: { type: String, require: true, default: "organizer" },
});

const eventSchema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "Organizer" },
  name: { type: String, require: true },
  description: { type: String, require: true },
  genre: { type: String, require: true },
  price: { type: Number, require: true },
  type: { type: String, require: true },
  category: { type: String, require: true },
});

const ticketSchema = new mongoose.Schema({
  userID: { type: mongoose.Types.ObjectId, ref: "Attendee" },
  event: { type: mongoose.Types.ObjectId, ref: "Event" },
  status: { type: String, require: true, default: "booked" },
  category: { type: String, require: true },
  qrcode: { type: String },
});


// module.exports = mongoose.model('Organizer', organizerSchema);
// module.exports = mongoose.model("Event", eventSchema);
// module.exports = mongoose.model('Ticket', ticketSchema);

module.exports = {
  Organizer: mongoose.model("Organizer", organizerSchema),
  Event: mongoose.model("Event", eventSchema),
  Ticket: mongoose.model("Ticket", ticketSchema),
};