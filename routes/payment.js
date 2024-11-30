const express = require("express");
const {
  createPaymentIntent,
  validatePayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-intent", createPaymentIntent);
router.get("/:paymentId", validatePayment);

module.exports = router;
