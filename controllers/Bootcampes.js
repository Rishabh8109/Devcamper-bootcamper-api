// @desc get All bootcamps
// @routes   GET /api/v1/bootcamps
// @Access PUBLIC
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		message: "Show All bootcamps",
	});
}

// @desc get bootcamp
// @routes   GET /api/v1/bootcamps/:id
// @Access PUBLIC
exports.getBootcamp = (req, res, next) =>{
	res.status(200).json({
		success: true,
		message: `show bootcamp ${req.params.id}`,
	});
}

// @desc create bootcamps
// @routes   POST /api/v1/bootcamps
// @Access Private
exports.createBootcamps = (req, res, next) => {
	res.status(200).json({
		success: true,
		message: `show new bootcamp`,
	});
}

// @desc update bootcamp
// @routes   PUT /api/v1/bootcamps/:id
// @Access Private
exports.updateBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		message: `Show updated bootcamps ${req.params.id}`,
	});
}

// @desc delete bootcamps
// @routes   DELETE /api/v1/bootcamp/:id
// @Access PUBLIC
exports.deleteBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		message: `Deleted boocapms ${req.params.id}`,
	});
}
