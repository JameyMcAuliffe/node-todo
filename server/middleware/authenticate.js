const {User} = require('../models/user');

let authenticate = (req, res, next) => {
	//get header specifying key value
	let token = req.header('x-auth');

	User.findByToken(token).then((user) => {
		if(!user) {
			//automatically jumps to the catch error case
			return Promise.reject();
		}

		//modify request object for routes using authenticate midleware
		req.user = user;
		req.token = token;
		next();
	}).catch((e) => {
		res.status(401).send({});
	});
};

module.exports = {authenticate};
