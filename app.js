'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const Hapi = require('hapi');
var Blipp = require('blipp');
const routes = require('./routes');

const MongoModels = require('mongo-models');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: config.server.host,
    port: config.server.port
});

MongoModels.connect(config.mongo, {}, (err) => {
    if (err) {
        console.log('DB connection error');
        return;
    }

    console.log('Models are now connected to mongodb: ', config.mongo);
});

server.route(routes);

// Start the server
server.register({ register: Blipp, options: {} }, () => {
    server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});

module.exports = server;
