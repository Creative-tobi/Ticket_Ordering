const express = require("express");
const {
  createAdmin,
  adminLogin,
  adminProfile,
  getOrganizer,
  getAttendee,
  deleteEvent,
  deleteAttendee,
  deleteOrganizer,
  getTickets,
  getEvent,
  deleteTicket,
} = require("../controller/admin.controller");
const authmiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();
router.post("/admin/register", createAdmin);
router.post("/admin/login", adminLogin);
router.get("/admin/profile/:id", authmiddleware, adminProfile);

router.get(
  "/admin/organizer",
  authmiddleware,
  roleMiddleware("admin"),
  getOrganizer
);
router.get(
  "/admin/attendee",
  authmiddleware,
  roleMiddleware("admin"),
  getAttendee
);

router.get("/admin/event", getEvent);

router.delete(
  "/admin/deleteevent/:id",
  authmiddleware,
  roleMiddleware("admin"),
  deleteEvent
);
router.delete(
  "/admin/deleteAttendee/:id",
  authmiddleware,
  roleMiddleware("admin"),
  deleteAttendee
);
router.delete(
  "/admin/deleteOrganizer/:id",
  authmiddleware,
  roleMiddleware("admin"),
  deleteOrganizer
);

router.get("/admin/gettickets", getTickets);

router.delete(
  "/admin/deleteTicket/:id",
  authmiddleware,
  roleMiddleware("admin"),
  deleteTicket
);

module.exports = router;
