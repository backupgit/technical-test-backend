'use strict';

const config = {
    development: {
        mongo: 'mongodb://127.0.0.1:27017/city-population',
        server: {
            host: 'localhost',
            port: '8000'
        }
    },
    test: {
        mongo: 'mongodb://127.0.0.1:27017/city-population-test',
        server: {
            host: 'localhost',
            port: '3010'
        }
    },
    production: {
        mongo: 'mongodb://mongo:27017/city-population',
        server: {
            host: '0.0.0.0',
            port: '8000'
        }
    }
};

module.exports = config;