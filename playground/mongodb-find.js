const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
	//return prevents success log from printing, same thing as putting success in an else
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	console.log('Connected to MongoDB server');

	const db = client.db('ToDoApp');
	//find returns mongodb cursor with methods, can pass in arg to query by value
	//toArray returns promise
	// db.collection('Todos').find({
	// 	_id: new ObjectID('5b33fc0696d708bde9f27fe7')
	// }).toArray().then((docs) => {
	// 	console.log('Todos:');
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch todos: ', err);
	// });

	db.collection('Todos').find().count().then((count) => {
		console.log('Todos: ' + count);
	}, (err) => {
		console.log('Unable to fetch todos: ', err);
	});

	//client.close();
});
