const express = require("express");
const app = express();
const Dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const expressSanatize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require("./config/db");
const path = require('path');

// Body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

// Dev logging middleware
app.use(morgan("dev"));

// routes file
const bootcamps = require("./routes/Bootcamps");
const courses = require("./routes/Courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// file upload
app.use(fileUpload());

// santize data
app.use(expressSanatize());

// Set security headers
app.use(helmet());

// Prevnet xss attects
app.use(xss());

// rate limiting
const limiter = rateLimit({
	windowMs : 10 * 60 * 1000,
	max : 100
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable  Cross Origin request
app.use(cors())

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

// coutom error handler
app.use(errorHandler)

// load env vars
Dotenv.config({path : 'config/.env'});

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