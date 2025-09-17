const express = require("express");
const { Event, Ticket, Organizer } = require("../models/Organizer.models");
const Attendee = require("../models/Attendee.models");
// const Organizer = require("../models/Organizer.models")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../service/nodemailer");

//Register organizer
async function createOrganizer(req, res) {
  try {
    const { name, email, password, OTP } = req.body;

    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).send({ error: "Organizer email already exist" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    const newOrganizer = new Organizer({
      name,
      email,
      password: hashedPassword,
      OTP: otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await newOrganizer.save();

    //generate token
    const token = jwt.sign(
      {
        id: newOrganizer._id,
        role: "organizer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    const registrationSubject = "Organizer Account Created Successfully";
    const registrationMessage = `Hello ${name},

Welcome to OPEN EDITORS! Your organizer account has been created successfully.

Account Details:
Name: ${name}
Email: ${email}
OTP: ${otp}
Role: Organizer

You can now log in to your organizer account and start creating and managing events.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(email, registrationSubject, registrationMessage);

    res.status(201).send({
      message: "You have successfully registered for the organizer post",
      token,
      organizer: {
        id: newOrganizer._id,
        name: newOrganizer.name,
        email: newOrganizer.email,
        OTP: newOrganizer.OTP,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

// creating new otp after expire
async function resendOTP(req, res) {
  try {
    const { email } = req.body; 
    const organizer = await Organizer.findOne(email);

    if (!organizer) {
      return res.status(404).send({ message: "Organizer not found" });
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    organizer.OTP = otp;
    organizer.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await organizer.save();

    // Send email with new OTP
    const subject = "Your OTP Code";
    const message = `Hello ${organizer.name},

Your new OTP code is ${otp}. It will expire in 10 minutes.

Best regards,
The OPEN EDITORS Team`;

    await sendMail.sendEmail(organizer.email, subject, message);

    res.status(200).send({
      message: "New OTP sent successfully",
      email: organizer.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

async function verifyOTP(req, res) {
  const { email, OTP } = req.body;
  try {
    if (!email || !OTP) {
      return res.status(400).send({ message: "Invalid credential" });
    }

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(404).send({ message: "Organizer not found" });
    }

    if (organizer.OTP !== Number(OTP))
      return res.status(400).send({ Message: "invalid OTP" });
    if (organizer.otpExpires < Date.now())
      return res
        .status(400)
        .send({ message: "OTP expired, please request a new one" });

    organizer.isVerified = true;
    organizer.OTP = null;
    organizer.otpExpires = null;
    await organizer.save();

    res.status(200).send({ message: "Account verified successfully" });
  } catch (error) {
    error.console(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

//organizer Login
async function organizerLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Invalid credential" });
    }

    const organizer = await Organizer.findOne({ email });
    if (!organizer) {
      return res.status(404).send({ error: "Organizer not found" });
    }

    const isValidPassword = await bcrypt.compare(password, organizer.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const otpverify = await Organizer.findOne({ email, isVerified: true });
    if (!otpverify) {
      return res.status(400).send({ message: "Please verify your account" });
    }

    const token = jwt.sign(
      { id: organizer._id, role: "organizer" },
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
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//Organizer profile
async function organizerProfile(req, res) {
  try {
    const organizerID = req.user.id;
    const organizer = await Organizer.findById(organizerID).select("-password");

    if (!organizer) {
      return res.status(400).send({ error: "Organizer not found" });
    }

    // sendMail.sendEmail(
    //   organizer.email,
    //   "PROFILE VIEW",
    //   `You are currently viewing your profile as ${organizer.email}`
    // );

    res.status(200).send({ message: "Organizer profile", organizer });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//creating event
async function createEvent(req, res) {
  try {
    const { userID, name, type, description, price, genre, category } =
      req.body;
    const organize = await Organizer.findById(userID);
    console.log(userID);

    if (!organize) {
      return res.status(404).send({ message: "Organizer not found" });
    }

    const newEvent = await Event.create({
      name,
      description,
      price,
      genre,
      type,
      category,
    });

    newEvent.save();

    const eventSubject = "Event Created Successfully";
    const eventMessage = `Hello ${organize.name},

You have successfully created a new event on the OPEN EDITORS platform.

Event Details:
Name: ${name}
Description: ${description}
Price: ${price}
Category: ${category}
Type: ${type}
Genre: ${genre}

Your event is now live and available for attendees to purchase tickets.

If you need to make any changes or have questions, please contact our support team.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(organize.email, eventSubject, eventMessage);

    res.status(200).send({ message: "Event added succesfully", newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

//getting all event
async function getEvent(req, res) {
  try {
    const { userID } = req.body;
    const allEvent = await Event.find(userID);
    const organizer = await Organizer.findById(userID);
    if (!organizer) {
      return res.status(404).send({ message: "Organizer not found" });
    }
    res.status(201).send({ message: "Book fetched", allEvent });
  } catch (error) {}
}

//update event
async function updateEvent(req, res) {
  try {
    const updateId = req.params.id;
    const { price, name } = req.body;
    const organizerID = req.user.id;
    const organizer = await Organizer.findById(organizerID);

    const org = await Event.findById(updateId);
    if (!org) return res.status(404).send({ message: "Event not found" });

    org.price = price;
    org.name = name;
    // taask.completedAt = completed ? new Date().toISOString() : null;

    await org.save();

    const updateSubject = "Event Updated Successfully";
    const updateMessage = `Hello ${organizer.name},

You have successfully updated your event on the OPEN EDITORS platform.

Updated Event Details:
Name: ${name}
Price: ${price}

The changes have been applied and are now live.

If you have any questions or need further assistance, please contact our support team.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(organizer.email, updateSubject, updateMessage);

    return res.status(200).send({ message: "Event updated successfully", org });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}

//creating ticket
async function createTicket(req, res) {
  try {
    const { userID, event, status } = req.body;
    const organizer = await Organizer.findById(userID);
    const ticket = await Ticket.create(req.body);
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("event", "type description genre price")
      .populate("userID", "name email");

    const ticketSubject = "Ticket Created Successfully";
    const ticketMessage = `Hello ${organizer.name},

You have successfully created a ticket for your event on the OPEN EDITORS platform.

Ticket Details:
Event: ${populatedTicket.event.type}
Status: ${status}

The ticket is now available for purchase by attendees.

If you have any questions or need assistance, please contact our support team.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(organizer.email, ticketSubject, ticketMessage);

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
  createOrganizer,
  organizerLogin,
  organizerProfile,
  createEvent,
  getEvent,
  updateEvent,
  createTicket,
  getTickets,
  verifyOTP,
  resendOTP,
};
