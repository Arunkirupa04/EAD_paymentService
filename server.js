const http = require("http"); // Import the HTTP module
const app = require("./app"); // Import the app (Express application)

const dotenv = require("dotenv");
const path = require("path");

const connectDatabase = require("./config/database");

dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Ensure database connection is established before starting the server
connectDatabase()
  .then(() => {
    // Define the port for the server
    const PORT = process.env.PORT || 8010;

    // Create an HTTP server and pass the Express app to it
    const server = http.createServer(app);

    // Start the server and listen on the defined port
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process with a failure status code
  });
