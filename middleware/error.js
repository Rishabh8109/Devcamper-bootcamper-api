const ErrorRespose = require("../utils/ErrorResponse");

const errorHandler = (err ,req,res,next) => {
  let error = {...err};
  error.message = err.message;

  console.log(error);
  // Mongodb Bad ObjecId
  if(err.name === 'CastError'){
    const message = `Bootcamp not found with ID of ${err.value}`;
    error = new ErrorRespose(message , 400)
  }

   // Duplicate key error
   if(err.name = 'MongoError'){
    const message = `Duplicate field value entered`;
    error = new ErrorRespose(message , 400)
  }

  // Mongodbdb validation Errors
  if(err.name = 'ValidationError'){
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorRespose(message , 400)
  }
  // Log to console
  res.status(error.status || 500).json({
    success : false,
    error : error.message || 'Server Error'
  });
}

module.exports = errorHandler;