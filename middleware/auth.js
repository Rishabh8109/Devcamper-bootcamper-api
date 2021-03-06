const User = require("../modals/User");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");

exports.protect = async (req, res, next) => {
	let token;
	const AuthHeader = req.headers.authorization;

	// set token form Bearer token in header
	if(AuthHeader) {
		token = AuthHeader.split(" ")[1];
	}

	// set token from cookie
	if(req.cookies.token){
		token = req.cookies.token;
	}


	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// req.user
		req.user = await User.findById(decoded._id);
		console.log(req.user);
		next();
	} catch (error) {
		return next(
			new ErrorResponse("Not authorized to access to this route", 401)
		);
	}
};
