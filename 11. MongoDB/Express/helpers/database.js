const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect("")
    .then(client => {
        console.log('Connected!');
        _db = client.db('shop');
        callback(client)
    })
    .catch(err => {
        console.log(err)
        throw err;
    })
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'Not database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;