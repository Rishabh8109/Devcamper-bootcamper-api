const express = require("express");
const app = express();
const Dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const morgan = require("morgan");
const connectDB = require("./config/db");


// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
   app.use(morgan("dev"));
}

// routes file
const bootcamps = require("./routes/Bootcamps");

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);

// load env vars
Dotenv.config();

// databse conecttion
connectDB();

const server = app.listen(PORT, () =>
	console.log(
		`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
);


// Handling unhandled promiss rejection
process.on('unhandledRejection' , (err , promise) => {
  console.log(`Error ${err.message}`);

  // close the server & exit process
 server.close(() => process.exit(1));
})