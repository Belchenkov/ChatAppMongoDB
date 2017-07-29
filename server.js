const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect To MongoDB
mongo.connect('mongodb://belchenkov:mongomaster88@ds127783.mlab.com:27783/chat-app-mongodb', function(err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected ...');
});