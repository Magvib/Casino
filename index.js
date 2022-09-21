// include express
const express = require('express');
const app = express();

// include socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// include body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// include express-session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// use public folder
app.use(express.static('public'));

// include all routes in routes folder
const fs = require('fs');
fs.readdirSync('./routes').forEach(file => {
    const route = require('./routes/' + file);
    app.use('/' + file.split('.')[0], route);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});