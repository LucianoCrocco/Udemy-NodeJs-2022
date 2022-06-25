const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect("mongodb+srv://LucianoCrocco:guL5uFVZOKG17kq3@udemy-nodejs-cluster.8fshwnq.mongodb.net/?retryWrites=true&w=majority")
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