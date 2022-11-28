const http = require('http');

const server = http.createServer();

server.on('connection', (socket) => {
    console.log("New Connection...");
});

server.listen(5500);

console.log("Listening on port 5500...");