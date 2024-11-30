const mongoose = require("mongoose");

const connectDatabase = () => {
  return mongoose
    .connect(process.env.DB_LOCAL_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`MongoDB connected: ${con.connection.host}`);
    })
    .catch((err) => {
      console.error(`MongoDB connection error: ${err}`);
      throw err; // Re-throw the error to handle it in server.js
    });
};

module.exports = connectDatabase;
