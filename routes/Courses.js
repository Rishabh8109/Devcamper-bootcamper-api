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

// role Authorization middleware
const {roleAuthorization} = require('../middleware/authorize');
const {protect} = require('../middleware/auth');

router
	.route("/")
	.get(
		advanceResult(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		getCourses
	)
	.post(protect,roleAuthorization('publisher' , 'admin') , createCourses);

router
	.route("/:id")
	.get(getSingleCourses)
	.put(protect,roleAuthorization('publisher' , 'admin'),updateCourse)
	.delete(protect,roleAuthorization('publisher' , 'admin'),deleteCourse);

module.exports = router;
