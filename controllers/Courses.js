const Course = require("../modals/courses");
const Bootcamps = require("../modals/bootcamps");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc  Get Courses
// @route /api/v1/courses
// @route /api/v1/bootcamps/:bootcampId/courses
// @access PUBLIC

exports.getCourses = async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res.status(201).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advanceResult);
	}
};

// @desc  Get single Courses
// @route /api/v1/courses/:id
// @access PUBLIC
exports.getSingleCourses = (req, res, next) => {
	// Check Id if provided or not
	if (!req.params.id) {
		return next(new ErrorResponse(`Id not found!`, 404));
	} else {
		Course.findById(req.params.id)
			.then((course) => {
				res.status(200).json({
					success: true,
					count: course.length,
					data: course,
				});
			})
			.catch((err) => {
				next(
					new ErrorResponse(
						`Course not found with this id ${req.params.id}`,
						404
					)
				);
			});
	}
};

// @desc create courses for with bootcamp
// @routes   POST /api/v1/bootcamps/:bootcampId/courses
// @Access Private
exports.createCourses = async (req, res, next) => {
  	req.body.bootcamp = req.params.bootcampId;
	  req.body.user = req.user.id;

		// find bootcamp
		let bootcamp = await	Bootcamps.findById(req.params.bootcampId);

		// if bootcamp not found
		if(!bootcamp){
			return next(
				new ErrorResponse(`Bootcamp not found with this ${req.params.id} ID` , 404)
			)
		}

	// 	// Make sure user is bootcamp owner
		if(bootcamp.user.toString() !== req.user.id && req.user.role !== "admin"){
			return next(new ErrorResponse(`User ${req.user._id} Id is not authorized for create to bootcamp ${req.params.bootcampId}` ,  401));
		}

   // Create course with bootcamp ID
	  const course = await  Course.create(req.body);

		// Send JSON Body respose
		res.status(201).json({
			success: true,
			data: course,
		});
};

// @desc update bootcamp
// @routes   PUT /api/v1/course/:id
// @Access Private
exports.updateCourse = async (req, res, next) => {
	// find bootcamp
  let course = await	Course.findById(req.params.id);

	// if course not found
	if(!course){
		return next(
			new ErrorResponse(`course not found with this ${req.params.id} ID` , 404)
		)
	}

	// Make sure user is course owner
	if(course.user.toString() !== req.user.id && req.user.role !== "admin"){
		return next(new ErrorResponse(`User ${req.user._id} Id is not authorized for update this courses` ,  401));
	}

	// update course
  course = await Course.findOneAndUpdate(req.params.id , req.body , {
		new : true,
		runValidators : true
	});

	// Send JSON Body respose
	res.status(200).json({
		success: true,
		data: course,
	});
};

// @desc delete bootcamps
// @routes   DELETE /api/v1/course/:id
// @Access PUBLIC
exports.deleteCourse = async (req, res, next) => {
	// find bootcamp
  let course = await	Course.findById(req.params.id);

	// if course not found
	if(!course){
		return next(
			new ErrorResponse(`course not found with this ${req.params.id} ID` , 404)
		)
	}

	// Make sure user is course owner
	if(course.user.toString() !== req.user.id && req.user.role !== "admin"){
		return next(new ErrorResponse(`User ${req.user._id} Id is not authorized for update this courses` ,  401));
	}

	// update course
  course = await Course.findByIdAndDelete(req.params.id);

	// Send JSON Body respose
	res.status(200).json({
		success: true,
		data: {},
	});

};
