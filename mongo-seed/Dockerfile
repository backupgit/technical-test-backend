FROM mongo

COPY mongo-seed.json /mongo-seed.json
CMD mongoimport --host=mongo --port=27017 --db city-population --collection cities --type json --file mongo-seed.json --jsonArray