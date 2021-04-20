const Slugify = require('slugify');
const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const bootcampSchema = new mongoose.Schema({
   name : {
     type : String,
     required : [true , 'Please add a name'],
     unique : true,
     trim : true,
     maxLength : [50 , 'Name can not be longer than 50 charachters']
   },
   slug : String,
   description : {
     type : String,
     required : [true , 'Please add a description'],
     trim : true,
     maxLength :[500 , 'Description can not be longer than 500 charachters']
   },
   website : {
     type : String,
     match : [
       /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
       'Please use a valid URL for HTTP or HTTPS'
     ]
   },
   phone  : {
     type : String,
     maxLength : [20, 'Phone number can not be longer than 20 charachters']
   },
   email : {
     type : String,
     match : [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid email address'
     ]
   },
   address : {
     type : String,
     required : [true , 'Pleace add a address']
   },
   location : {
     // GeoJson point
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        // required: true
      },
      coordinates: {
        type: [Number],
        // required: true,
        index : '2dsphare'
      },
      formattedAddress : String,
      street : String,
      city : String,
      state : String,
      zipcode : String,
      country : String,
   },
   careers : {
     type : [String],
     required : true,
     enum : [
       'Web Development',
       'Mobile Development',
       'UI/UX',
       'Data Science',
       'Machine Learning',
       'Business',
       'Ohter'
     ]
   },
   averageRating : {
     type : Number,
     min : [1 , 'Rating must at least 1'],
     max : [10 , 'Rating must not be more than 10']
   },
   averageCost : Number,
   photo : {
     type : String,
     default : 'no-photo.jpg'
   },
   housing : {
     type : Boolean,
     default : false
   },
   jobAssitance : {
     type : Boolean,
     default : false
   },
   jobGuarantee : {
     type : Boolean,
     default : false
   },
   acceptGi : {
     type : Boolean,
     default : false
   },
   user : {
     type : mongoose.Schema.Types.ObjectId,
     ref : 'User',
     required : true
   },
   createdAt : {
     type : Date,
     default : Date.now
   }

}, {
  toJSON : {virtuals : true},
  toObject : {virtuals : true}
});

// slug value
bootcampSchema.pre('save' , function(next) {
  this.slug = Slugify(this.name , {lower : true})
  next();
});


// Geocode & create location field
bootcampSchema.pre('save' , async function(next){
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type : 'Point',
    coordinates : [loc[0].latitude , loc[0].longitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    state : loc[0].stateCode,
    country : loc[0].country,
    city : loc[0].city,
    zipcode : loc[0].zipcode,
  }

  this.address = undefined;
  next();
});

// Revers populating with virtuals
bootcampSchema.virtual('courses' , {
  ref: 'Course', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'bootcamp', // is equal to `foreignField`,
  justOne: false,
});


const Bootcamp = mongoose.model('Bootcamps' , bootcampSchema);
module.exports = Bootcamp;