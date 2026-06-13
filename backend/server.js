require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const complaintRoutes = require("./routes/complaintRoutes");
const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/complaints", complaintRoutes);

// Test Route
app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "CivicLens Backend Running"
    });

});


// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

    console.log(
        `Server Running On Port : http://localhost:${PORT}`
    );

});