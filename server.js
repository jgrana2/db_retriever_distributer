//Script to subscribe to change streams and distribute the data

//MongoDB driver
var mongo = require('mongodb');

//Web servers
const app = require('http').createServer(handler)
const io = require('socket.io')(app);

//File system
const fs = require('fs');

//Enable static web server
app.listen(9000);

console.log("Well, hello.");

//Socket.io connection event handler
io.on('connection', (socket) => {
  console.log("Client connected");
  socket.emit('Ok', { hello: 'world' });

  socket.on("Ok", (data) => {
    console.log("Client confirmed");
  });

  socket.on('disconnect', () => {
    io.emit('Client disconnected');
  });

  //Connect to database
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  MongoClient.connect(url,
    {useUnifiedTopology: true},
    function(err, db) {
      if (err) throw err;
      console.log("Connected to database");

      //Create change stream and filter by uuid
      const collection = db.db("devices").collection("device1");
      const pipeline = [
        {
          $match:{'fullDocument.uuid':'8175'}
        }
      ];

      //Receive change
      const changeStream = collection.watch(pipeline);
      console.log("Watching changes...");
      changeStream.on("change", next => {
        console.log(next);
        socket.emit('data', next.fullDocument.samples);
      });
    });

    //GET method
    socket.on('GET', (data) => {
      console.log(data);
      socket.emit('Ok', { response: 'Get example' });
    });
  });

  //Web server handler
  function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
    (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
  }
