'use strict';

const controllers = require('./controllers');

module.exports = [
    {
        method: 'GET',
        path: '/cities',
        config: {
            description: 'Population by city (its last record) and age',
            handler: controllers.cities.all
        }
    },
    {
        method: 'POST',
        path: '/cities',
        config: {
            description: 'Insert population data',
            handler: controllers.cities.add
        }
    },
    {
        method: 'GET',
        path: '/cities/population/{city}',
        config: {
            description: 'Population by city',
            handler: controllers.cities.populationByCity
        }
    },
    {
        method: 'GET',
        path: '/cities/population/ages',
        config: {
            description: 'Population by all ages',
            handler: controllers.cities.populationByAllAges
        }
    },
    {
        method: 'GET',
        path: '/cities/population',
        config: {
            description: 'Population by cities (of all time)',
            handler: controllers.cities.populationByCities
        }
    }
];