//if on test or production env will be NODE_ENV, otherwise development
let env = process.env.NODE_ENV || 'development';
console.log('env:', env);

if(env === 'development' || env === 'test') {
	//requiring json file automatically converts it to js object
	let config = require('./config.json');
	//using env variable to access property on config
	let envConfig = config[env];

	//gives same result as below, better security
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}

// if(env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp';
// } else if(env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest';
// }
