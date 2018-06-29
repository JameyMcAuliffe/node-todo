const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

//Delete multiple records
//Run with empty object as arg to remove all
// Todo.remove({}).then((result) => {
// 	console.log(result);
// });

//Returns removed doc
// Todo.findOneAndRemove({id: '5b35814f790326cd704649b7'}).then((todo) => {
// 	console.log(todo);
// })

Todo.findByIdAndRemove('5b35814f790326cd704649b7').then((todo) => {
	console.log(todo);
});

