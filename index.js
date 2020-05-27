//Script to subscribe to change streams and distribute the data

//MongoDB driver
var mongo = require('mongodb');

//Connect to database
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
MongoClient.connect(url,
  {useUnifiedTopology: true},
  function(err, db) {

    //Create change stream to filter by uuid
    const collection = db.db("devices").collection("device1");
    const pipeline = [
      {
        $match:{'fullDocument.uuid':'8173'}
      }
    ];

    //Receive change
    const changeStream = collection.watch(pipeline);
    changeStream.on("change", next => {
      console.log(next);
    });
  });
