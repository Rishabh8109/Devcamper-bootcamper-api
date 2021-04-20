const mongoose = require("mongoose");
const Bootcamp = require('./bootcamps');

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, "Please add a title"],
		trim: true,
		maxLength: 100,
	},
	text: {
		type: String,
		required: [true, "Please add a some text"],
	},
	rating: {
		type: Number,
		min: 1,
		max: 10,
		required: [true, "Please add a rating between and 10"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bootcamps",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

// Static method to get ava cost of tuition
ReviewSchema.statics.getAvarageRating = async function(bootcampId) {
  console.log('Calculating the ratings.....'.blue);

  const obj =  await this.aggregate([
    {
      $match : {bootcamp : bootcampId}
    },
    {
      $group : {
         _id : '$bootcamp',
         averageRating : { $avg : '$rating'}
      }
    }
  ]);

  console.log(bootcampId);
  console.log(obj);

  try {
   await Bootcamp.findByIdAndUpdate(bootcampId , {
     averageRating : obj[0].averageRating
   });

  } catch (error) {
    console.log(error);
  }
}

// / Ge avarage cost after saving the course
ReviewSchema.post('save' , function(){
   this.constructor.getAvarageRating(this.bootcamp);
});

// / Ge avarage cost before deleing the course
ReviewSchema.pre('remove' , function(){
  this.constructor.getAvarageRating(this.bootcamp);
});

// Prevent from user submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

const ReviewModel = mongoose.model("Reviews", ReviewSchema);
module.exports = ReviewModel;
