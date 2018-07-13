const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		let text = 'test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err) {
					return done(err)
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err) => {
				if(err) {
					return done(err)
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
			})
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return a 404 if todo not found', (done) =>{
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return a 404 for non-object ids', (done) => {
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	let hexId = todos[0]._id.toHexString();

	it('should remove a todo', (done) => {
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if(err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => {
					done(e);
				});
			});
	});

	it('should return a 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done);
	});

	it('should return a 404 for non-object ids', (done) => {
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done);
	});
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		let hexId = todos[0]._id.toHexString();
		let text = "new text";

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: true,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);	
	});

	it('should clear completedAt when todo is not completed', (done) => {
		let hexId = todos[1]._id.toHexString();
		let text = "more new text";

		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed:false,
				text
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toNotExist();
			})
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			//set header to grab x-auth
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		let email = 'example@example.com';
		let password = '1234567';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
				expect(res.body.email).toBe(email);
			})
			.end(done);
	});

	it('should return validation errors if request invalid', (done) => {
		let email = 'noemail'
		let password = '12345';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email in use', (done) => {
		let email = 'jmc@email.com';
		let password = '1234567';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(400)
			.end(done);
	});
});
