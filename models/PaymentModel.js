const mongoose = require("mongoose");
const moment = require("moment"); // For date/time manipulation

// Define the schema for storing payment intent details
const paymentIntentSchema = new mongoose.Schema({
  paymentIntentId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number, // Stored in the smallest currency unit (e.g., cents)
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true, // e.g., 'succeeded', 'failed', 'requires_payment_method', 'canceled'
  },
  paymentMethodId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default is current date and time
  },
});

// Create and export the model for PaymentIntent
const PaymentIntent = mongoose.model("PaymentIntent", paymentIntentSchema);
// Export the function correctly
const validatePaymentId = async (paymentId) => {
  try {
    const payment = await PaymentIntent.findOne({ paymentIntentId: paymentId });

    if (!payment) {
      return false; // Payment ID not found
    }

    // Check if the payment was created within the last 15 minutes
    const currentTime = moment();
    const paymentCreatedTime = moment(payment.createdAt); // Assuming createdAt is stored as a Date
    const duration = moment.duration(currentTime.diff(paymentCreatedTime));

    if (duration.asMinutes() > 15) {
      return false; // Payment is older than 15 minutes
    }

    return true; // Payment is valid and within 15 minutes
  } catch (error) {
    console.error("Error validating payment ID:", error);
    throw new Error("Error validating payment ID");
  }
};

module.exports = {
  PaymentIntent,
  validatePaymentId,
};
