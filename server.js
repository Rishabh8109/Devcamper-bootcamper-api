const express = require("express");
const app = express();
const Dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");
const path = require('path');

// Body parser
app.use(express.json());

// Dev logging middleware
app.use(morgan("dev"));



// routes file
const bootcamps = require("./routes/Bootcamps");
const courses = require("./routes/Courses");

// file upload
app.use(fileUpload());


// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

// coutom error handler
app.use(errorHandler)

// load env vars
Dotenv.config();

// Establising Databse conecttion
connectDB();

// set static file
app.use(express.static(path.join(__dirname , 'public')));

// server Establising
const server = app.listen(PORT, () =>
	console.log(
		`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
		.blue.bold
	)
);





// Handling unhandled promiss rejection
process.on('unhandledRejection' , (err , promise) => {
  console.log(`Error ${err.message}`.red.bold);

  // close the server & exit process
 server.close(() => process.exit(1));
})