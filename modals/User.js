const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
	},
	email: {
		type: String,
		required: [true, "Please add a email"],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please use a valid email address",
		],
	},
	role: {
		type: String,
		enum: ["user", "publisher"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please add a password"],
		minLength: [6 ,'Password length must be 6'],
		select: false,
	},
	resetpasswordToken: String,
	resetpasswordExp: Date,
	createAt: {
		type: String,
		default: Date.now,
	},
});

// @Encrtype password using hash
UserSchema.pre('save' , async function(next){
	if(!this.isModified('password')){
		next();
	}
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next();
});

// Sign in & token generate
UserSchema.methods.getSignedJwtToken =  function(){
   return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
     expiresIn: process.env.JWT_EXPIRES
   });
}

// Generate & Hash token genrate
UserSchema.methods.getForgotPasswordToken = async function(){

	// @Generate Token
	const resetToken = crypto.randomBytes(20).toString('hex');

	// @Hash token and set it to resetPasswordToken
	this.resetpasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

	// Token expiration
	this.resetpasswordExp = new Date() + 10 * 60 * 1000;

	return resetToken;
}

// Math user provided password to databse
UserSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword , this.password);
}

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
