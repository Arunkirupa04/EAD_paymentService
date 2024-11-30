const express = require("express");
const cors = require("cors"); // Import CORS
const paymentRoutes = require("./routes/payment");

const app = express();

// Enable CORS for all origins (or you can specify specific domains)
app.use(cors()); // This will allow all origins by default

app.use(express.json()); // To parse JSON requests

// Define routes
app.use("/api/v1/payment", paymentRoutes);

module.exports = app;
