const express = require("express");
const {
  createAttendee,
  attendeeProfile,
  attedeeLogin,
  getEvent,
  createTicket,
  getTickets,
  verifyOTP,
  resendOTP,
} = require("../controller/attendee.controller");
const authmiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();
router.post("/attendee/register", createAttendee);
router.post("/attendee/login", attedeeLogin);
router.get("/attendee/profile/:id", authmiddleware, attendeeProfile);
router.get("/attendee/event", getEvent);
router.post("/attendee/ticket", createTicket);
router.get("/attendee/gettickets", getTickets);
router.post("/attendee/verifyOtp", verifyOTP);
router.put("/attendee/resendOtp", resendOTP);

module.exports = router;
