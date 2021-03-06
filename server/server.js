require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

//store express application
let app = express();
const port = process.env.PORT;

/********** Middlewares **********/

//returns as a function, allowing you to send json to server 
//takes string body and turns into js object
app.use(bodyParser.json());

/********** Routes **********/

//Post new todo to db
app.post('/todos', authenticate, (req, res) => {
	let todo = new Todo({
		//body object comes from bodyParser middleware
		text: req.body.text,
		_creator: req.user._id
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

//

//Get all todos from db
app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

//Get todo by ID from db
app.get('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send()
	});
});

//Remove todo by ID from db
app.delete('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

//Update todo by ID
app.patch('/todos/:id', authenticate, (req, res) => {
	let id = req.params.id;
	//pick takes an object then an array of properties to pull off
	let body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, {$set: body}, {new: true}).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}

		res.send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

//Add new user
app.post('/users', (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);
	//body is returned as an object
	let user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		//res.header lets you set a header with key value
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});	
});

//private route taking x-auth returning user
//also takes custom middleware authenticate function
app.get('/users/me', authenticate, (req, res) => {
	//req.user available from authenticate middleware
	res.send(req.user);
});

app.post('/users/login', (req, res) => {
	let body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.delete('/users/me/token', authenticate, (req, res) => {
	let token = req.token;

	req.user.removeToken(token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});


app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};

