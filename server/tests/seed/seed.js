const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
	_id: userOneId,
	email: 'jmc@email.com',
	password: 'password1',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]
}, {
	_id: userTwoId,
	email: 'jmc2@email.com',
	password: 'password2',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
	}]
}];

//dummy todos
const todos = [{
	text: 'Numba 1',
	_id: new ObjectID(),
	_creator: userOneId
}, {
	text: 'Numba 2',
	_id: new ObjectID(),
	completed: true,
	completedAt: 2343234,
	_creator: userTwoId
}];

//run some code before each test case
const populateTodos = (done) => {
	//empties db before every request so assumption will pass
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

//Can't use insertMany because it won't run the middleware used to hash/salt the password
const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		//Takes array of promises, then cb doesn't fire until all promises resolved
		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {populateTodos, todos, populateUsers, users};
