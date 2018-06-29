const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

let id = '5b35306084e3cad5cb924459';

if(!ObjectID.isValid(id)) {
	console.log('ID not valid');
}

//returns array
Todo.find({
	//mongoose converts string id to object
	_id: id
}).then((todos) => {
	console.log('Todos: ', JSON.stringify(todos, undefined, 2));
});

//returns object
Todo.findOne({
	_id: id 
}).then((todo) => {
	console.log('Todo: ', JSON.stringify(todo, undefined, 2));
});

Todo.findById(id).then((todo) => {
	//Error handling for valid ID not found
	if(!todo) {
		return console.log('Id not found');
	}
	console.log('Todo By Id: ', JSON.stringify(todo, undefined, 2));
}).catch((e) => console.log(e)); //error handling for invalid id

