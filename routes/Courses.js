const express = require("express");
const {
	getCourses,
	getSingleCourses,
	createCourses,
	updateCourse,
	deleteCourse,
} = require("../controllers/Courses");
const router = express.Router({ mergeParams: true });

// advence result middleware
const advanceResult = require("../middleware/advanceResult");
const Course = require("../modals/courses");

router
	.route("/")
	.get(
		advanceResult(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(createCourses);

router
	.route("/:id")
	.get(getSingleCourses)
	.put(updateCourse)
	.delete(deleteCourse);

module.exports = router;
