const http = require('http');
/* Http package import */
const app = require('./app');
/* App.js import */

const port = process.env.PORT || 3000;
/* Port for where the project will run */

const server = http.createServer(app);
/* Create server and store in constant */

server.listen(port);
/* Listener */