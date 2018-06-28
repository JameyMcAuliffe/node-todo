const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

//store express application
let app = express();

/********** Middlewares **********/

//returns as a function, allowing you to send json to server 
//takes string body and turns into js object
app.use(bodyParser.json());

/********** Routes **********/

app.post('/todos', (req, res) => {
	let todo = new Todo({
		//body object comes from bodyParser middleware
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});



app.listen(3000, () => {
	console.log('Listening on port 3000');
});

module.exports = {app};

