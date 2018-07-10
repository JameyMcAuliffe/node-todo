const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

//schema allows you to tack on custom methods
let UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail, //takes value and returns boolean
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	//tokens only available with mongoose
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	let user = this;
	//takes a mongoose variable converting to an object
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

//an object that allows you to add on instance methods
UserSchema.methods.generateAuthToken = function () {
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

	user.tokens = user.tokens.concat([{access, token}]);

	//return allows a promise to be chained on in server.js
	return user.save().then(() => {
		return token;
	});
};

let User = mongoose.model('User', UserSchema);

module.exports = {User};
