const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
	id: 10
};

//takes an object and secret returning hashed value
let token = jwt.sign(data, '123abc');
console.log(token);

//returns error if token has been altered
let decoded = jwt.verify(token, '123abc');
console.log(decoded);


// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// let data = {
// 	id: 4
// };

// let token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
// 	console.log('Data was not changed');
// } else {
// 	console.log('Data was changed');
// }
