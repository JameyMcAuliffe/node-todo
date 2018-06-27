const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, client) => {
	//return prevents success log from printing, same thing as putting success in an else
	if(err) {
		return console.log('Unable to connect to MongoDB server');
	} 
	console.log('Connected to MongoDB server');

	const db = client.db('ToDoApp');

	//Deletes every document that fits criteria
	// db.collection('Todos').deleteMany({
	// 	text: 'Make some grub'
	// }).then((result) => {
	// 	console.log(result);
	// });

	//Deletes first document that fits criteria
	// db.collection('Todos').deleteOne({
	// 	text: 'Make some grub'
	// }).then((result) => {
	// 	console.log(result);
	// });

	//Deletes first doc that fits criteria and returns data
	// db.collection('Todos').findOneAndDelete({
	// 	completed: false
	// }).then((doc) => {
	// 	console.log(doc);
	// })

	// db.collection('Users').deleteMany({
	// 	name: 'Jamey'
	// }).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').findOneAndDelete({
		_id: ObjectID('5b3400c4143d6dbe5f99edd1')
	}).then((doc) => {
		console.log(doc);
	});

	//client.close();
});
