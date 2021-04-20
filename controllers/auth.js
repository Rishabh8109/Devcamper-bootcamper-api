const User = require("../modals/User");
const sendEmail = require("../utils/sendEmail");
const ErrorResponse = require("../utils/ErrorResponse");
const crypto = require("crypto");

// @desc User Registerration
// @routes   GET /api/v1/auth/register
// @Access PUBLIC
exports.register = async (req, res, next) => {
	const { name, email, password, role } = req.body;

	 const isEmailExist = await User.findOne({email : email});
	 if(isEmailExist){
		 return next(new ErrorResponse('Email already exits' , 400))
	 }

	// @create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	// set token into cookie
	sendTokenIntoCookie(user, 200, res);
};

// @desc User Login
// @routes   GET /api/v1/auth/login
// @Access PUBLIC
exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	// Check email and password is valid
	if (!email || !password) {
		return next(new ErrorResponse("Please provide email and passwrod", 400));
	}

	const user = await User.findOne({ email: email }).select("+password");

	// Check user emaii exists
	if (!user) {
		return next(new Error("Invalid credatial & email not found", 401));
	}

	const isMatch = await user.matchPassword(password);

	// Check user password matched
	if (!isMatch) {
		return next(new Error("Invalid credatial", 401));
	}

	// set token into cookie
	sendTokenIntoCookie(user, 200, res);
};

// get token from modle and send it to cookies
function sendTokenIntoCookie(user, statusCode, res) {
	// create token
	const token = user.getSignedJwtToken();

	// cookie options
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	// set secure if production
	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	// setCookies
	res.status(statusCode).cookie("token", token, options).json({
		success: true,
		token: token,
	});
}

// @desc Get me
// @routes   GET /api/v1/auth/me
// @Access PRIVATE
exports.getMe = async (req, res, next) => {
	const user = await User.findById(req.user._id);

	res.status(200).json({
		success: true,
		user: user,
	});
};

// @desc Forgot password
// @routes   GET /api/v1/auth/forgotpassword
// @Access PUBLIC
exports.forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	// Check user email exist
	if (!user) {
		return next(new ErrorResponse(`There is no user with that email`, 404));
	}

	// GET getForgotPasswordToken
	const resetToken = await user.getForgotPasswordToken();

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetPassword/${resetToken}`;

	const message = `You are receiving this email because or (someone else) has requested to reset password. Please make a PUT request to : \n\n ${resetUrl}`;

	try {

    await user.save({ validateBeforeSave: false });

		await sendEmail({
			email: user.email,
			subject: "Password reset token",
			message: message,
		});


		res.status(200).json({
			succes: true,
			data: "Email sent!",
      user : user
		});
	} catch (error) {

		console.log(error);
		user.resetpasswordToken = undefined;
		user.resetpasswordExp = undefined;

		return next(new ErrorResponse("Email could not be send", 500));
	}


};

// @desc Get me
// @routes   GET /api/v1/auth//resetPassword/:rresetToken
// @Access PUBLIC
exports.resetPassword = async (req, res, next) => {

	const resetpasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	const user = await User.findOne({
    resetpasswordToken
  });


  if(!user) {
    return next(
      new ErrorResponse('Invalid token' , 404)
    )
  }

  // set new password
  user.password = req.body.password;
  user.resetpasswordToken = undefined;
  user.resetpasswordExp = undefined;

  // save the user
  await user.save();

  // set token into cookie
	sendTokenIntoCookie(user, 200, res);
};



// @desc update the user details
// @routes   GET /api/v1/auth/updateDetails
// @Access PRIVATE

exports.updateDetails = async (req, res, next) => {
  const fieldsToUpdate = {
    name : req.body.name,
    email : req.body.email
  }
  // update the user details
	const user = await User.findByIdAndUpdate(req.params.id , fieldsToUpdate , {
    new : true,
    runValidators : true
  });

	res.status(200).json({
		success: true,
		user: user,
	});
};

// @desc update the user password
// @routes   GET /api/v1/auth/updatePassword
// @Access PRIVATE

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if(!await user.matchPassword(req.body.currentPassword)){
    return next(
      new ErrorResponse('Password is in correct' , 401)
    );
  }

  // se new password to database
  user.password = req.body.newPassword;
  await user.save();

  sendTokenIntoCookie(user , 200 , res);

};

// @desc user logout
// @routes   post /api/v1/auth/logout
// @Access PRIVATE
exports.logout = async (req, res, next) => {
	res.cookie('token' , 'none' , {
		expries : new Date(Date.now() + 10 * 1000),
		httpOnly : true
	})

	res.status(200).json({
		success: true,
		data: {},
	});
};
