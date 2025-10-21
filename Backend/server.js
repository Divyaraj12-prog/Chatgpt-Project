require('dotenv').config()
const ConnectToDb = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.server');
// use the configured express app where routes/cors/cookie-parser are already set
const app = require('./src/app');

// ensure DB is connected first
ConnectToDb();

// create http server from configured app and attach socket server
const http = require('http').createServer(app);
initSocketServer(http);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server listening on Port', PORT));