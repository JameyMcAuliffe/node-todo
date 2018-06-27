//MongoClient allows us to connect to and manipulate db
//const MongoClient = require('mongodb').MongoClient;
//es6 destructuring, pulls out MongoClient from mongodb require, same as above
const {MongoClient, ObjectID} = require('mongodb');

//connect to database
//1st arg is url where db lives
MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
	//return prevents success log from printing, same thing as putting success in an else
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	console.log('Connected to MongoDB server');

	//access database reference
	const db = client.db('ToDoApp');

	// db.collection('Todos').insertOne({
	// 	text: 'Something else to do',
	// 	completed: false
	// }, (err, res) => {
	// 	if(err) {
	// 		return console.log('Unable to insert todo: ', err);
	// 	}
	// 	//ops aobject contains all inserted data
	// 	console.log(JSON.stringify(res.ops, undefined, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Jamey',
	// 	age: 34,
	// 	location: 'Nashville'
	// }, (err, res) => {
	// 	if(err) {
	// 		return console.log('Unable to insert user');
	// 	}
	// 	console.log(JSON.stringify(res.ops, undefined, 2));
	// });

	//close connection to database
	client.close();
});
