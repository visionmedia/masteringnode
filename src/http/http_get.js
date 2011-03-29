var http = require('http'),
	util = require('util');

var opt = {
	host: 'localhost',
	port: 9222,
	path: '/index.html'
};

http.get(opt, function(response) {
	console.log("http.get [Status]: %s", response.statusCode);
	console.log("http.get [method]: %s", response.client._httpMessage.method);
	console.log("http.get [path]: %s", response.client._httpMessage.path);
	console.log("http.get [method]:\n%s", response.client._httpMessage._header);
	// console.log("http.get [client]:\n%s", util.inspect(response.client));
}).on('error', function(err) {
	console.log("http.get [Error]: " + err.message);
});
