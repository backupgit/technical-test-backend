'use strict';

const models = require('../models');
const Boom = require('boom');
const City = models.City;

module.exports = {
    all: (req, reply) => {

        const query = [
            { $sort: { ts: -1 } },
            {
                $project: {
                    _id: 0,
                    city: '$city',
                    ts: '$ts',
                    population: '$population'
                }
            }
        ];

        City.aggregate(query, (err, res) => {
            if (err) {
                return reply(err);
            }

            reply(res);
        });
    },
    add: (req, reply) => {
        const city = req.payload.city;
        const population = JSON.parse(req.payload.population);
        const ts = req.payload.ts;
        City.create(city, ts, population, (err, res) => {
            if (err) {
                return reply(err);
            }

            reply();
        });
    },
    populationByCity: (req, reply) => {
        const city = encodeURIComponent(req.params.city);

        const query = [
            { $match: { city: city } },
            { $sort: { ts: -1 } },
            { $unwind: '$population' },
            {
                $project: {
                    _id: 0,
                    city: '$city',
                    populationRecords: {
                        age: '$population.age',
                        count: '$population.count',
                        ts: '$ts'
                    }
                }
            },
            {
                $group: {
                    _id: { city: '$city', age: '$populationRecords.age' },
                    populationRecords: { $first: '$populationRecords' }
                }
            },
            { $sort: { 'populationRecords.age': 1 } },
            {
                $group: {
                    _id: '$_id.city',
                    populationRecords: { $push: '$populationRecords' }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: '$_id',
                    populationRecords: '$populationRecords'
                }
            }
        ];

        City.aggregate(query, (err, res) => {
            if (err) {
                return reply(err);
            }

            if (!res.length) {
                return reply(Boom.notFound('Document not found.'));
            }

            reply(res);
        });
    },
    populationByAllAges: (req, reply) => {
        const query = [
            { $unwind: '$population' },
            {
                $project: {
                    _id: 0,
                    city: '$city',
                    age: '$population.age',
                    count: '$population.count',
                    ts: '$ts'
                }
            },
            { $sort: { city: 1, age: 1, ts: -1 } },
            {
                $group: {
                    _id: { city: '$city', age: '$age' },
                    ts: { $first: '$ts' },
                    count: { $first: '$count' }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: '$_id.city',
                    age: '$_id.age',
                    ts: '$ts',
                    count: '$count'
                }
            },
            {
                $group: {
                    _id: '$age',
                    max: { $max: '$count' },
                    min: { $min: '$count' },
                    sum: { $sum: '$count' },
                    mean: { $avg: '$count' }
                }
            }
        ];

        City.aggregate(query, (err, res) => {
            if (err) {
                return reply(err);
            }
            reply(res);
        });
    },
    populationByCities: (req, reply) => {
        const query = [
            { $unwind: '$population' },
            {
                $project: {
                    _id: 0,
                    city: '$city',
                    count: '$population.count'
                }
            },
            {
                $group: {
                    _id: '$city',
                    sum: { $sum: '$count' },
                    mean: { $avg: '$count' },
                    max: { $max: '$count' },
                    min: { $min: '$count' }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: '$_id',
                    historicalPopulation: {
                        sum: '$sum',
                        mean: '$mean',
                        max: '$max',
                        min: '$min'
                    }
                }
            }
        ];

        City.aggregate(query, (err, res) => {
            if (err) {
                return reply(err);
            }

            reply(res);
        });
    }

};