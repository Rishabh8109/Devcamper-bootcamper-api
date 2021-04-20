const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../modals/reviews");
const {
	getReviews,
	getReview,
	addReviews,
	updateReview,
	deleteReview,
} = require("../controllers/reviews");
const advanceResult = require("../middleware/advanceResult");
const { protect } = require("../middleware/auth");
const { roleAuthorization } = require("../middleware/authorize");

router.route("/")
	.get(
		advanceResult(Review, {
			path: "bootcamp",
			select: "name description",
		}),
		getReviews
	)
	.post(protect, roleAuthorization("user", "admin"), addReviews);

router.route("/:id")
	.get(getReview)
	.put(protect, roleAuthorization("user", "admin"), updateReview)
	.delete(protect, roleAuthorization("user", "admin"), deleteReview);

module.exports = router;
