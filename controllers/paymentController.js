require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { PaymentIntent } = require("../models/PaymentModel"); // Assuming the schema is in this file
const { validatePaymentId } = require("../models/PaymentModel"); // Correct import

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, paymentMethodId } = req.body; // Extract amount, currency, and paymentMethodId

    // Step 1: Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId, // Attach the payment method to the payment intent
      confirmation_method: "manual", // Use manual confirmation method
      return_url: "http://localhost:3000", // Adjust this URL based on your app's structure
      confirm: true, // Automatically confirm the payment intent
    });

    // console.log("PaymentIntent Object:", paymentIntent);

    // Step 2: Save payment intent details to the database if payment succeeded
    if (paymentIntent.status === "succeeded") {
      const newPayment = new PaymentIntent({
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount_received, // Store the amount received (in smallest currency unit)
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paymentMethodId: paymentIntent.payment_method, // Store the payment method ID
      });

      // Save the payment document to the database
      await newPayment.save();

      console.log("Payment Intent saved to DB:", newPayment);
    }

    // Step 3: Send the clientSecret back to the frontend for confirmation
    res.status(201).send({
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Payment processing failed" });
  }
};

// Controller function to handle the payment validation
exports.validatePayment = async (req, res) => {
  console.log("Heellllo");
  const { paymentId } = req.params; // Extract paymentId from the request parameters
  console.log("payy", paymentId);

  try {
    const isValid = await validatePaymentId(paymentId); // Call the service to validate payment
    console.log("Valid che", isValid);
    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("Error during payment validation:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
