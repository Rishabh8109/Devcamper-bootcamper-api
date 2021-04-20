
const mongoose = require('mongoose');
const Bootcamp = require('./bootcamps');

const CourseSchema = new mongoose.Schema({
  title : {
    type : String,
    required : [true , 'Please add a name'],
    trim : true,
  },
  description : {
    type : String,
    required : [true , 'Please add a description'],
    trim : true,
  },
  weeks : {
    type : String,
    required : [true , 'Please add number of weeks'],

  },
   tuition : {
    type : Number,
    required : [true , 'Please add a tuition cost'],

   },
   minimumSkill : {
    type : String,
    required : [true , 'Please add a minmum skill'],
    enum : ['beginner' , 'intermediate' , 'advance']
  },
  scholarhipsAvailable : {
    type : Boolean,
    default : false
  },
  createdAt : {
    type : Date,
    default : Date.now
  },
  bootcamp :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Bootcamps',
    required : true
  },
   user :{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
});

// Static method to get ava cost of tuition
CourseSchema.statics.getAvarageCost = async function(bootcampId) {
  console.log('Calculating the cost.....'.blue);

  const obj =  await this.aggregate([
    {
      $match : {bootcamp : bootcampId}
    },
    {
      $group : {
         _id : '$bootcamp',
         averageCost : { $avg : '$tuition'}
      }
    }
  ]);

  try {
   await Bootcamp.findByIdAndUpdate(bootcampId , {
     averageCost : Math.ceil(obj[0].averageCost / 10) * 10
   });

  } catch (error) {
    console.log(error);
  }
}

// / Ge avarage cost after saving the course
CourseSchema.post('save' , function(){
   this.constructor.getAvarageCost(this.bootcamp);
});

// / Ge avarage cost before deleing the course
CourseSchema.pre('remove' , function(){
  this.constructor.getAvarageCost(this.bootcamp);
});

const Course = mongoose.model('Course' , CourseSchema);

module.exports = Course;