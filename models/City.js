'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class City extends MongoModels {
    static create(city, ts, population, callback) {
        const document = {
            city,
            ts,
            population
        };

        this.insertOne(document, (err, docs) => {
            if (err) {
                callback();
                return;
            }

            callback(null, docs[0]);
        });
    }
}

City.collection = 'cities';

City.schema = Joi.object().keys({
    city: Joi.string().required(),
    ts: Joi.number().integer().required(),
    population: Joi.array()
});

module.exports = City;