const static = require('node-static');
const server = new static.Server('./public');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        server.serve(request, response);
    }).resume();
}).listen(8080);