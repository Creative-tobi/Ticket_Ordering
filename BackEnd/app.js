const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoute = require("./routes/admin.routes");
const attendeeRoute = require("./routes/attendee.routes");
const organizerRoute = require("./routes/organizer.routes");

dotenv.config();
connectDB();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api", adminRoute);
app.use("/api", organizerRoute);
app.use("/api", attendeeRoute);

app.listen(PORT, () =>{
    console.log(`Server running at ${PORT}`);
});