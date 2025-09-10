const express = require("express");
 const {
   createOrganizer,
   organizerLogin,
   organizerProfile,
   createEvent,
   getEvent,
   updateEvent,
   createTicket,
   getTickets,
 } = require("../controller/organizer.controller");
 const authmiddleware = require("../middleware/auth.middleware");
 const roleMiddleware = require("../middleware/role.middleware");

 const router = express.Router();
 router.post("/organizer/register", createOrganizer);
 router.post("/organizer/login", organizerLogin);
 router.get("/organizer/profile/:id", authmiddleware, organizerProfile);

 //event
 router.post("/organizer/event", createEvent);
 router.get("/organizer/getevent", getEvent);
 router.put("/organizer/updateevent/:id", updateEvent);

 router.post("/organizer/ticket/:id", createTicket);
 router.get("/organizer/gettickets", getTickets);

 module.exports = router;