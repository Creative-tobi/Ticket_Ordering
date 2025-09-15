const express = require("express");
const { Event, Organizer, Ticket } = require("../models/Organizer.models");
// const Event = require("../models/Organizer.models");
const Attendee = require("../models/Attendee.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../service/nodemailer");
const qrcode = require("qrcode");

//creating attendee
async function createAttendee(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingAttendee = await Attendee.findOne({ email });
    if (existingAttendee) {
      return res.status(400).send({ error: "Attendeeemail already exist" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAttendee = new Attendee({
      name,
      email,
      password: hashedPassword,
    });

    await newAttendee.save();

    //generate token
    const token = jwt.sign(
      {
        id: newAttendee._id,
        role: "attendee",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const registrationSubject = "Attendee Account Created Successfully";
    const registrationMessage = `Hello ${name},

Welcome to OPEN EDITORS! Your attendee account has been created successfully.

Account Details:
Name: ${name}
Email: ${email}
Role: Attendee

You can now log in to your attendee account and start purchasing tickets for events.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The OPEN EDITORS Team
        `;
    sendMail.sendEmail(email, registrationSubject, registrationMessage);

    res.status(201).send({
      message: "You have successfully registered for the attedee post",
      token,
      Attendee: {
        id: newAttendee._id,
        name: newAttendee.name,
        email: newAttendee.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

//login
async function attedeeLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Invalid credential" });
    }

    const attendee = await Attendee.findOne({ email });
    if (!attendee) {
      return res.status(404).send({ error: "organizer not found" });
    }

    const isValidPassword = await bcrypt.compare(password, attendee.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: attendee._id, role: "attendee" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // sendMail.sendEmail(
    //   `${email}`,
    //   "ACCOUNT LOGIN",
    //   `You are currently signed in as ${email}`
    // );

    res.status(200).send({
      message: "Login successful",
      token,
      attendee: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//Attendee profile
async function attendeeProfile(req, res) {
  try {
    const attendeeID = req.user.id;
    const attendee = await Attendee.findById(attendeeID).select("-password");

    if (!attendee) {
      return res.status(400).send({ error: "Attendee not found" });
    }

    // sendMail.sendEmail(
    //   attendee.email,
    //   "PROFILE VIEW",
    //   `You are currently viewing your profile as ${attendee.email}`
    // );

    res.status(200).send({ message: "Attendee profile", attendee });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//get total event
async function getEvent(req, res) {
  try {
    const allEvent = await Event.find().select("-password");
    res.status(201).send({ message: "Event fetched successfully", allEvent });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//creating Ticket
async function createTicket(req, res) {
  try {
    const { userID, event, status } = req.body;
    const attendee = await Attendee.findById(userID).select("name email");
    const eventDetails = await Event.findById(event).select(
      "name type description genre price category"
    );

    


    const qrPayLoad = `Event: ${eventDetails.name}, 
      Type: ${eventDetails.type}, 
      Description: ${eventDetails.description}, 
      Genre: ${eventDetails.genre}, 
      Price: ${eventDetails.price}, 
      Category: ${eventDetails.category} 
      | Attendee: ${attendee.name}, 
      Email: ${attendee.email} 
      | Status: ${status}`;

    // const ticketURL = `${userID}-${event}`;

    const qrcodeData = await qrcode.toDataURL(qrPayLoad);

    const ticket = await Ticket.create({
      ...req.body,
      qrcode: qrcodeData,
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("event", "type description genre price category name")
      .populate("userID", "name email");

    const ticketSubject = "Ticket Purchased Successfully";
    const ticketMessage = `Hello ${attendee.name},

You have successfully purchased a ticket for the following event on the OPEN EDITORS platform.

Event Details:
Name: ${populatedTicket.event.name}
Type: ${populatedTicket.event.type}
Description: ${populatedTicket.event.description}
Price: ${populatedTicket.event.price}
Category: ${populatedTicket.event.category}
Genre: ${populatedTicket.event.genre}

Ticket Status: ${status}

Your QR code for entry is attached to this email. Please save this email for your records.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The OPEN EDITORS Team
        `;
    sendMail.sendEmail(attendee.email, ticketSubject, ticketMessage);

    res
      .status(200)
      .send({ message: "Ticket created successfully", populatedTicket });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

//getting all ticket
async function getTickets(req, res) {
  try {
    const { userID } = req.body;
    const allEvent = await Event.find();
    const Attendee = await Attendee.findById(userID);
    if (!Attendee) {
      return res.status(404).send({ message: "Organizer not found" });
    }
    res.status(201).send({ message: "Book fetched", allEvent });
  } catch (error) {}
}
module.exports = {
  createAttendee,
  attendeeProfile,
  attedeeLogin,
  getEvent,
  createTicket,
  getTickets,
};
