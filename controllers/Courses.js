const Course = require('../modals/courses');
const ErrorRespose = require('../utils/ErrorResponse');

// @desc  Get Courses
// @route /api/v1/courses
// @route /api/v1/bootcamps/:bootcampId/courses
// @access PUBLIC

exports.getCourses = async (req,res,next) => {

  if(req.params.bootcampId){
   const  courses = await Course.find({bootcamp : req.params.bootcampId});
    res.status(201).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advanceResult);
  }
}

// @desc  Get single Courses
// @route /api/v1/courses/:id
// @access PUBLIC
exports.getSingleCourses = (req,res,next) => {
    Course
   .findById(req.params.id)
   .then((course) => {
    res.status(200).json({
      success: true,
      count: course.length,
      data: course,
    });
  })
  .catch((err) => {
    next(new ErrorRespose(`Course not found with this id ${req.params.id}` , 404));
  });

}

// @desc create courses for with bootcamp
// @routes   POST /api/v1/bootcamps/:bootcampId/courses
// @Access Private
exports.createCourses = (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

	const Courses = new Course(req.body);

     Courses
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
// @routes   PUT /api/v1/course/:id
// @Access Private
exports.updateCourse = (req, res, next) => {

	Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	})
		.then((course) => {
			res.status(200).json({
				success: true,
				data: course,
			});
		})
		.catch((err) => {
			next(new ErrorRespose('Provided id not found!' , 404));
		});
};


// @desc delete bootcamps
// @routes   DELETE /api/v1/course/:id
// @Access PUBLIC
exports.deleteCourse = (req, res, next) => {
	Course.findByIdAndDelete(req.params.id, req.body)
		.then((course) => {
			res.status(200).json({
				success: true,
				data: {},
			});
		})
		.catch((err) => {
			next(err);
		});
};
