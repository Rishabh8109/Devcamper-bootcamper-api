const User = require("../modals/User");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc User Registerration
// @routes   GET /api/v1/auth/register
// @Access PUBLIC
exports.register = async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// @create user
	const user =   await User.create({
    name,
    email,
    password,
    role,
  });

	 // set token into cookie
   sendTokenIntoCookie(user , 200 , res);
};

// @desc User Login
// @routes   GET /api/v1/auth/login
// @Access PUBLIC
exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	// Check email and password is valid
	if (!email || !password) {
		return next(new Error("Please provide email and passwrod", 400));
	}

	const user = await User.findOne({ email: email }).select("+password");

	// Check user emaii exists
	if (!user) {
		return next(new Error("Invalid credatial", 401));
	}

	const isMatch = await user.matchPassword(password);

	// Check user password matched
	if (!isMatch) {
		return next(new Error("Invalid credatial", 401));
	}

  // set token into cookie
  sendTokenIntoCookie(user , 200 , res);
};


// get token from modle and send it to cookies
function sendTokenIntoCookie(user , statusCode , res){

  	// create token
	  const token =  user.getSignedJwtToken();

    // cookie options
    const options = {
      expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000),
      httpOnly : true
    }

    // set secure if production
    if(process.env.NODE_ENV === 'production'){
      options.secure = true
    }

    // setCookies
    res
   .status(statusCode)
   .cookie('token' , token , options)
   .json({
     success: true,
		 token: token,
   });
}

// @desc Get me
// @routes   GET /api/v1/auth/me
// @Access PRIVATE
exports.getMe = async (req,res,next) => {
  const user = await User.findById(req.user._id);

  res
  .status(200)
  .json({
    success : true,
    user : user
  })
}