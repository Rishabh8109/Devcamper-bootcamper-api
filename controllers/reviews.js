const Review = require("../modals/reviews");
const Bootcamps = require("../modals/bootcamps");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc  Get Reviews
// @route /api/v1/bootcamps/:bootcampId/reviews
// @access PUBLIC
exports.getReviews = async (req, res, next) => {
	if (req.params.bootcampId) {
		const reviews = await Review.find({
			bootcamp: req.params.bootcampId,
		}).populate({ path: "bootcamp", select: "name description" });
		res.status(201).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advanceResult);
	}
};

// @desc  Get single review
// @route GET /api/v1/reviwes/:reviewId
// @access PUBLIC

exports.getReview = async (req, res, next) => {
	try {
		const review = await Review.findById(req.params.id).populate({
			path: "bootcamp",
			select: "name description",
		});

		if (!review) {
			return next(
				new ErrorResponse(`No review found with this ID ${req.params.id}`, 404)
			);
		}

		res.status(200).json({
			success: true,
			data: review,
		});
	} catch (error) {
		next(error);
	}
};

// @desc Add reviews for with bootcamp
// @routes   POST /api/v1/bootcamps/:bootcampId/reviews
// @Access Private
exports.addReviews = async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	// find bootcamp
	let bootcamp = await Bootcamps.findById(req.params.bootcampId);

	// if bootcamp not found
	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with this ${req.params.id} ID`, 404)
		);
	}


	try {
		// Create course with bootcamp ID
		const review = await Review.create(req.body);

		// Send JSON Body respose
		res.status(201).json({
			success: true,
			data: review,
		});
	} catch (error) {
		next(error);
	}
};

// @desc update reviews
// @routes   PUT /api/v1/reviews/:id
// @Access Private
exports.updateReview = async (req, res, next) => {
	// find bootcamp
  let review = await	Review.findById(req.params.id);

	// if review not found
	if(!review){
		return next(
			new ErrorResponse(`review not found with this ${req.params.id} ID` , 404)
		)
	}

	// Make sure user is review owner
	if(review.user.toString() !== req.user.id && req.user.role !== "admin"){
		return next(new ErrorResponse(`User ${req.user._id} Id is not authorized for update this reviews` ,  401));
	}

	// update review
  review = await Review.findOneAndUpdate(req.params.id , req.body , {
		new : true,
		runValidators : true
	});

	// Send JSON Body respose
	res.status(200).json({
		success: true,
		data: review,
	});
};

// @desc delte reviews
// @routes   DELETE /api/v1/reviews/:id
// @Access Private
exports.deleteReview = async (req, res, next) => {
	// find bootcamp
  let review = await	Review.findById(req.params.id);

	// if review not found
	if(!review){
		return next(
			new ErrorResponse(`review not found with this ${req.params.id} ID` , 404)
		)
	}

	// Make sure user is review owner
	if(review.user.toString() !== req.user.id && req.user.role !== "admin"){
		return next(new ErrorResponse(`User ${req.user._id} Id is not authorized for delete this reviews` ,  401));
	}

	// delete review
  await review.remove();

	// Send JSON Body respose
	res.status(200).json({
		success: true,
		data: {},
	});
};
