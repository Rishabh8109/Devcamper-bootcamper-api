const mongoose = require('mongoose');

const bootcampSchema = new mongoose.Schema({
   name : {
     type : String,
     required : [true , 'Please add a name'],
     unique : true,
     trim : true,
     maxLength : [50 , 'Name can not be longer than 50 charachters']
   },
   slug : true,
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
        required: true
      },
      coordinates: {
        type: [Number],
        required: true,
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
       'Web development',
       'Mobile development',
       'UI/UX',
       'Data Science',
       'Machine Learning',
       'Business',
       'Ohter'
     ]
   },
   avarageRating : {
     type : Number,
     min : [1 , 'Rating must at least 1'],
     max : [10 , 'Rating must not be more than 10']
   },
   avarageCost : String,
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
   createdAt : {
     type : Date,
     default : Date.now
   }

})