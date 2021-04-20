const User = require("../modals/User");
const ErrorResponse = require("../utils/ErrorResponse");

// @Get user
// @route /api/v1/users
// @access ADMIN
exports.getUsers = async (req, res, next) => {
	try {
		res.status(200).json(res.advanceResult);
	} catch (error) {
		return next(new ErrorResponse("Users Not found", 500));
	}
};

// @Get sinfle user
// @GET route /api/v1/users/:id
// @access ADMIN
exports.getSingleUser = async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorResponse(`User not found  with this ID ${req.params.id}`)
		);
	}

	// is user exits
	res.status(200).json({
		success: true,
		data: user,
	});
};

// @UPDATE user
// @PUT route /api/v1/users/:id
// @access ADMIN
exports.createUser = async (req, res, next) => {
	try {
		const user = await User.create(req.body);

		// Send JSON  responseBody
		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(new ErrorResponse(error, 500));
	}
};

// @UPDATE user
// @PUT route /api/v1/users/:id
// @access ADMIN
exports.updateUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			return next(
				new ErrorResponse(`User not updated with this id ${req.params.id}`)
			);
		}

		// Send JSON  responseBody
		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error) {
		next(new ErrorResponse(error, 500));
	}
};

// @Get user
// @route /api/v1/users
// @access ADMIN
exports.deleteUser = async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);
	if (!user) {
		return next(
			new ErrorResponse(`User not deleted with this id ${req.params.id}`)
		);
	}

	// Send JSON  responseBody
	res.status(200).json({
		success: true,
		users: {},
	});
};
