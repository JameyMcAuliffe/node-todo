const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
	//return prevents success log from printing, same thing as putting success in an else
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	console.log('Connected to MongoDB server');

	const db = client.db('ToDoApp');

	//findOneAndUpdate(filter, update, options, callback)
	//returns promise if no callback
	//mongodb update operators
	// db.collection('Todos').findOneAndUpdate({
	// 	_id: ObjectID("5b33fc0696d708bde9f27fe7")
	// }, {
	// 	$set: {
	// 		text: 'Still so many things to do'
	// 	}
	// }, {
	// 	//returns updated doc, defaults to true
	// 	returnOriginal: false
	// }).then((doc) => {
	// 	console.log(doc);
	// });

	db.collection('Users').findOneAndUpdate({
		_id: ObjectID("5b3400c4143d6dbe5f99edd2")
	}, {
		$set: {
			name: 'James'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((doc) => {
		console.log(doc);
	});

	//client.close();
});
