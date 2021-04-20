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
const reviewRouter = require('./reviews');

//Re-Route into other resourse route
router.use('/:bootcampId/courses' , courseRouter);
router.use('/:bootcampId/reviews' , reviewRouter);

// advence result middleware
const advanceResult = require('../middleware/advanceResult');
const Bootcamp = require("../modals/bootcamps");

// Router protect middleware
const {protect} = require('../middleware/auth');
const {roleAuthorization} = require('../middleware/authorize');


 router
.route('/radius/:zipcode/:distance')
.get(getBootcampInRadius)



router.route('/')
      .get(protect , advanceResult(Bootcamp , 'courses') ,getBootcamps)
      .post(protect, roleAuthorization('publisher' , 'admin') , createBootcamps)

router.route('/:id')
     .get(protect, getBootcamp)
     .put(protect ,roleAuthorization('publisher' , 'admin'), updateBootcamp)
     .delete(protect,roleAuthorization('publisher' , 'admin'),deleteBootcamp)

router.route('/:id/photo')
       .put(uploadPhoto)

module.exports = router;
