const ErrorRespose = require("../utils/ErrorResponse")

exports.roleAuthorization = (...roles) => (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new ErrorRespose(`User role ${req.user.role} is not authorize to access this` , 304));
    }
    next();
}