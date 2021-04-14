const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	createBootcamps,
	updateBootcamp,
	deleteBootcamp,
      getBootcampInRadius,
      uploadPhoto,
} = require("../controllers/Bootcampes");

const router = express.Router();

// Include courses router
const courseRouter = require('./Courses');

//Re-Route into other resourse route
router.use('/:bootcampId/courses' , courseRouter);

// advence result middleware
const advanceResult = require('../middleware/advanceResult');
const Bootcamp = require("../modals/bootcamps");

 router
.route('/radius/:zipcode/:distance')
.get(getBootcampInRadius)



router.route('/')
      .get(advanceResult(Bootcamp , 'courses') ,getBootcamps)
      .post(createBootcamps)

router.route('/:id')
     .get(getBootcamp)
     .put(updateBootcamp)
     .delete(deleteBootcamp)

router.route('/:id/photo')
       .put(uploadPhoto)

module.exports = router;
