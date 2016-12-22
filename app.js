var express = require('express');
var fs = require('fs');
var app = express();
var redis = require('redis');
var redisClient = redis.createClient();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

function emitMessage(client, message) {
  client.emit('message', message);
}

io.on('connection', function (client) {
  console.log("Client connected");
  client.on('join', function (name) {
    client.name = name || "Guest";
    console.log(name + ' joined');
    redisClient.lrange('messages', 0, -1, function (err, data) {
      data.reverse().forEach(function (message) {
        emitMessage(client, message);
      });
    });
  });

  client.on('message', function (message) {
    var fullMessage = client.name + ": " + message;
    client.broadcast.emit('message', fullMessage);
    emitMessage(client, fullMessage);
    redisClient.lpush('messages', fullMessage)
  });
});

app.get('/', function(req, res) {
  res.render('index.ejs');
});

server.listen(8082, function () {
  console.log('Listening on port 8082')
});