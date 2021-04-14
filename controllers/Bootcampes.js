// import modals here
const Bootcamps = require("../modals/bootcamps");
const geocoder = require("../utils/geocoder");
const ErrorResponse = require("../utils/ErrorResponse");
const path = require("path");

// @desc get All bootcamps
// @routes   GET /api/v1/bootcamps
// @Access PUBLIC
exports.getBootcamps = async (req, res, next) => {
   try {
     res.status(200).json(res.advanceResult);
	 } catch (error) {
      next(error);
	 }
};

// @desc get bootcamp
// @routes   GET /api/v1/bootcamps/:id
// @Access PUBLIC
exports.getBootcamp = (req, res, next) => {
	Bootcamps.findById(req.params.id)
		.then((bootcamp) => {
			res.status(201).json({
				success: true,
				data: bootcamp,
			});
		})
		.catch((err) => {
			next(err);
		});
};

// @desc get bootcamp in radius
// @routes   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @Access PUBLIC
exports.getBootcampInRadius = async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// get lan / lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// @calculate radius using radian
	// Divide dist by radius of earth
	// Earth radius 3,963 mi / 6,378
	const radius = distance / 3963.2;

	Bootcamps.find({
		location: {
			$geoWithin: { $centerSphere: [[lat, lng], radius] },
		},
	})
		.then((bootcamp) => {
			res.status(201).json({
				success: true,
				count: bootcamp.length,
				data: bootcamp,
			});
		})
		.catch((err) => {
			console.log(err.message);
			next(err);
		});
};

// @desc create bootcamps
// @routes   POST /api/v1/bootcamps
// @Access Private
exports.createBootcamps = (req, res, next) => {
	const bootcamps = new Bootcamps(req.body);
	bootcamps
		.save()
		.then((bootcamp) => {
			res.status(201).json({
				success: true,
				data: bootcamp,
			});
		})
		.catch((err) => {
			next(err);
		});
};

// @desc update bootcamp
// @routes   PUT /api/v1/bootcamps/:id
// @Access Private
exports.updateBootcamp = (req, res, next) => {
	Bootcamps.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
		.then((bootcamp) => {
			res.status(200).json({
				success: true,
				data: bootcamp,
			});
		})
		.catch((err) => {
			next(err);
		});
};

// @desc delete bootcamps
// @routes   DELETE /api/v1/bootcamp/:id
// @Access PUBLIC
exports.deleteBootcamp = (req, res, next) => {
	Bootcamps.findByIdAndDelete(req.params.id, req.body)
		.then((bootcamp) => {
			res.status(200).json({
				success: true,
				data: {},
			});
		})
		.catch((err) => {
			next(err);
		});
};



// @desc Upload photo
// @routes   PUT /api/v1/bootcamps/:id/photo
// @Access Private
exports.uploadPhoto = (req, res, next) => {
	if (!req.files) {
		next(new ErrorResponse("Please upload a photo", 404));
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith("image")) {
		next(new Error("Please upload a photo", 404));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_SIZE) {
		next(new ErrorResponse("Please upload a file  less than 100000", 404));
	}

	// coustom file name
	file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

	// Use the mv() method to place the file somewhere on your server
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
		if (err) {
			next(new ErrorResponse("Problem with file uplaod", 500));
		}

		// Update bootcamp
		Bootcamps.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		})
			.then(() => {
				res.status(200).json({
					success: true,
					data: file.name,
				});
			})
			.catch((err) => {
				next(err);
			});
	});
};
