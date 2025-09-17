const express = require("express");
const Admin = require("../models/Admin.models");
const { Event, Organizer, Ticket } = require("../models/Organizer.models");
const Attendee = require("../models/Attendee.models");
// const Organizer = require("../models/Organizer.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../service/nodemailer");

//Register Admin
async function createAdmin(req, res) {
  try {
    const { name, email, password, OTP } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).send({ error: "Admin email already exist" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      OTP: otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await newAdmin.save();

    //generate token
    const token = jwt.sign(
      {
        id: newAdmin._id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // sendMail.sendEmail(
    //   `${email}`,
    //   "ACCOUNT CREATION",
    //   "You have successfully created an account"
    // );

    // send registration details to admin email
    const registerationSubject = "Admin Account Created Successfully";
    const registerationMessage = `Hello ${name},
    Welcome to OPEN EDITORS! Your admin account has been created successfully.

    Account Details:
    Name: ${name}
    Email: ${email}
    OTP: ${otp}
    Role: Admin

    You can now log in to your admin account and start managing the platform.

    If you have any questions or need assistance, feel free to reach out to our support team.
    Best regards,
    The OPEN EDITORS Team
    `;

    res.status(201).send({
      message: "You have successfully registered for the admi post",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        OTP: newAdmin.OTP,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

//resend OTP
async function resendOTP(req, res) {
  try {
    const { email } = req.body; // Admin ID from route param
    const admin = await Admin.findOne(email);

    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    admin.OTP = otp;
    admin.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    // Send email with new OTP
    const subject = "Your OTP Code";
    const message = `Hello ${admin.name},

Your new OTP code is ${otp}. It will expire in 10 minutes.

Best regards,
The OPEN EDITORS Team`;

    await sendMail.sendEmail(admin.email, subject, message);

    res.status(200).send({
      message: "New OTP sent successfully",
      email: admin.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
}
//verify OTP
async function verifyOTP(req, res) {
  const { email, OTP } = req.body;
  try {
    if (!email || !OTP) {
      return res.status(400).send({ message: "Invalid credential" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    if (admin.OTP !== Number(OTP))
      return res.status(400).send({ Message: "invalid OTP" });
    if (admin.otpExpires < Date.now())
      return res
        .status(400)
        .send({ message: "OTP expired, please request a new one" });

    admin.isVerified = true;
    admin.OTP = null;
    admin.otpExpires = null;
    await admin.save();

    res.status(200).send({ message: "Account verified successfully" });
  } catch (error) {
    error.console(error);
    res.status(500).send({ message: "Internal server error" });
  }
}

//Admin Login
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Invalid credential" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).send({ error: "Invalid password" });
    }

    const otpverify = await Admin.findOne({ email, isVerified: true });
    if (!otpverify) {
      return res.status(400).send({ message: "Please verify your account" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
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
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//Admin profile
async function adminProfile(req, res) {
  try {
    const adminID = req.user.id;
    const admin = await Admin.findById(adminID).select("-password");

    if (!admin) {
      return res.status(400).send({ error: "Admin not found" });
    }

    // sendMail.sendEmail(
    //   admin.email,
    //   "PROFILE VIEW",
    //   `You are currently viewing your profile as ${admin.email}`
    // );

    res.status(200).send({ message: "Admin profile", admin });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}
//get total organizer
async function getOrganizer(req, res) {
  try {
    const allOrganizer = await Organizer.find().select("-password");
    res
      .status(200)
      .send({ message: "Organizer fetched", organizer: allOrganizer });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//get total attendee
async function getAttendee(req, res) {
  try {
    const allAttendee = await Attendee.find().select("-password");
    res
      .status(200)
      .send({ message: "Organizer fetched", attendee: allAttendee });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}
//deleting event
async function deleteEvent(req, res) {
  try {
    const adminID = req.user.id;
    const admin = await Admin.findById(adminID);
    const eventToDelete = await Event.findById(req.params.id);
    if (!eventToDelete) {
      return res.status(404).send({ error: "Event not found" });
    }
    const deleted = await Event.findByIdAndDelete(req.params.id);

    // Send delete email to admin
    const deleteSubject = "Event Deleted Successfully";
    const deleteMessage = `Hello ${admin.name},

You have successfully deleted the following event from the platform:

Event Name: ${eventToDelete.name}
Description: ${eventToDelete.description}
Price: ${eventToDelete.price}
Category: ${eventToDelete.category}
Type: ${eventToDelete.type}

If this was not intended, please contact support immediately.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(admin.email, deleteSubject, deleteMessage);

    res.status(200).send({ message: "Event has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//deleting organizer
async function deleteOrganizer(req, res) {
  try {
    const adminID = req.user.id;
    const admin = await Admin.findById(adminID);
    const organizerToDelete = await Organizer.findById(req.params.id);
    if (!organizerToDelete) {
      return res.status(404).send({ error: "Organizer not found" });
    }
    const deleted = await Organizer.findByIdAndDelete(req.params.id);

    const deleteSubject = "Organizer Deleted Successfully";
    const deleteMessage = `Hello ${admin.name},

You have successfully deleted the following organizer from the platform:

Name: ${organizerToDelete.name}
Email: ${organizerToDelete.email}

If this was not intended, please contact support immediately.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(admin.email, deleteSubject, deleteMessage);

    res
      .status(200)
      .send({ message: "Organizer has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//deleting ticket
async function deleteTicket(req, res) {
  try {
    const adminID = req.user.id;
    const admin = await Admin.findById(adminID);
    const ticketToDelete = await Ticket.findById(req.params.id);
    if (!ticketToDelete) {
      return res.status(404).send({ error: "Ticket not found" });
    }
    const deleted = await Ticket.findByIdAndDelete(req.params.id);

    const deleteSubject = "Ticket Deleted Successfully";
    const deleteMessage = `Hello ${admin.name},

You have successfully deleted the following ticket from the platform:

Event: ${ticketToDelete.event}
Status: ${ticketToDelete.status}

If this was not intended, please contact support immediately.

Best regards,
The OPEN EDITORS Team
    `;
    sendMail.sendEmail(admin.email, deleteSubject, deleteMessage);

    res.status(200).send({ message: "Tickets has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//deleting attendee
async function deleteAttendee(req, res) {
  try {
    const adminID = req.user.id;
    const admin = await Admin.findById(adminID);
    const attendeeToDelete = await Attendee.findById(req.params.id);
    if (!attendeeToDelete) {
      return res.status(404).send({ error: "Attendee not found" });
    }
    const deleted = await Attendee.findByIdAndDelete(req.params.id);

    const deleteSubject = "Attendee Deleted Successfully";
    const deleteMessage = `Hello ${admin.name},

    You have successfully deleted the following attendee from the platform:

    Name: ${attendeeToDelete.name}
    Email: ${attendeeToDelete.email}

    If this was not intended, please contact support immediately.

    Best regards,
    The OPEN EDITORS Team
    `;
    sendMail.sendEmail(admin.email, deleteSubject, deleteMessage);

    res.status(200).send({ message: "Attendee has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

//get total ticket
async function getTickets(req, res) {
  try {
    const allTickets = await Ticket.find()
      .populate("event", "name description price type category")
      .populate("userID", "name email");
    res
      .status(201)
      .send({ message: "Ticket fetched successfully", allTickets });
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

module.exports = {
  createAdmin,
  adminLogin,
  adminProfile,
  getOrganizer,
  getAttendee,
  deleteEvent,
  deleteOrganizer,
  deleteAttendee,
  getTickets,
  getEvent,
  deleteTicket,
  verifyOTP,
  resendOTP,
};
