'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require('../app');
const MongoClient = require('mongodb').MongoClient;
const config = require('../config').test;

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

const citiesCollection = [
    'city=Valencia&ts=1100&population=[{"age": 20,"count": 1000}, {"age": 30,"count": 800}]',
    'city=Valencia&ts=1110&population=[{"age": 20,"count": 1300}, {"age": 30,"count": 900}]',
    'city=Valencia&ts=1000&population=[{"age": 20,"count": 1500}, {"age": 30,"count": 700}]',
    'city=Madrid&ts=1200&population=[{"age": 30,"count": 900}, {"age": 55,"count": 400}]',
    'city=Madrid&ts=1000&population=[{"age": 19,"count": 1500}, {"age": 55,"count": 500}]',
    'city=NY&ts=1000&population=[{"age": 20,"count": 1500}, {"age": 30,"count": 1100}]'
];

describe('Basic API Tests', () => {
    before((done) => {
        MongoClient.connect(config.mongo, (err, db) => {
            if (err) {
                console.log('Error');
            }
            db.collection('cities').drop(() => {
                db.close();
                done();
            });
        });
    });

    after((done) => {
        done();
    });

    it('should return empty array', (done) => {
        const options = {
            method: 'GET',
            url: '/cities'
        };

        server.inject(options, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result).to.equal([]);
            done();
        });
    });

    citiesCollection.forEach((v) => {
        it('should add city', (done) => {
            const options = {
                method: 'POST',
                url: '/cities',
                payload: v,
                headers
            };

            server.inject(options, (response) => {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    it('should return cities collection', (done) => {
        const options = {
            method: 'GET',
            url: '/cities'
        };

        server.inject(options, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.length).to.equal(citiesCollection.length);
            done();
        });
    });

    it('should return population by city', (done) => {
        const options = {
            method: 'GET',
            url: '/cities/population/Valencia'
        };

        server.inject(options, (response) => {
            const result = response.result[0];
            expect(result.city).to.equal('Valencia');
            expect(result.populationRecords.length).to.equal(2);
            expect(result.populationRecords[0].count).to.equal(1300);
            done();
        });
    });

    it('should return population by cities', (done) => {
        const options = {
            method: 'GET',
            url: '/cities/population'
        };

        server.inject(options, (response) => {
            const result = response.result;
            expect(result.length).to.equal(3);
            expect(result[1].city).to.equal('Madrid');
            expect(result[1].historicalPopulation.max).to.equal(1500);
            expect(result[1].historicalPopulation.sum).to.equal(3300);
            expect(result[1].historicalPopulation.mean).to.equal(825);
            done();
        });
    });

    it('should return population by all ages', (done) => {
        const options = {
            method: 'GET',
            url: '/cities/population/ages'
        };

        server.inject(options, (response) => {
            const result = response.result;
            result.forEach((v) => {
                if (v._id === 30) {
                    expect(v.max).to.equal(1100);
                    expect(v.min).to.equal(900);
                    expect(v.sum).to.equal(2900);
                }
            });
            done();
        });
    });

});