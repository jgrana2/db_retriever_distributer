$(function(){
  //Connect to socket.io server
	var socket = io.connect('http://127.0.0.1:9000')

  //Confirm connection
  socket.on("Ok", (data) => {
    console.log(data);
    socket.emit('Ok', {Ok: 'got it'});
  });

  //Receive data
  socket.on("data", (data) => {
    console.log(data);
  });
});
