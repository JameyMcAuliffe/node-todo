const mongoose = require('mongoose');

//sets up mongoose to use promises, not needed for v5
mongoose.Promise = global.Promise;

//mongoose maintains connection over time, no callback needed
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp');
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
