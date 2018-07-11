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

UserSchema.methods.toJSON = function() {
	let user = this;
	//takes a mongoose variable converting to an object
	let userObject = user.toObject();

	return _.pick(userObject, ['_id', 'email']);
};

//an object that allows you to add on instance methods
UserSchema.methods.generateAuthToken = function() {
	//instance methods get called with the document as this binding
	let user = this;
	let access = 'auth';
	let token = jwt.sign({_id: user._id, access}, 'abc123');

	//user.tokens = user.tokens.concat([{access, token}]);
	user.tokens.push({access, token});

	//return allows a promise to be chained on in server.js
	return user.save().then(() => {
		return token;
	});
};

//statics creates a model method
UserSchema.statics.findByToken = function(token) {
	//model methods get called as the model with this binding
	let User = this;
	let decoded;

	//need to run in a try/catch because jwt.verify returns an error if not a match
	try {
		decoded = jwt.verify(token, 'abc123')
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		'_id': decoded._id,
		//wrap in quotes for nested variables
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

let User = mongoose.model('User', UserSchema);

module.exports = {User};
