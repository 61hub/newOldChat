var express = require('express');
var fs = require('fs');
var app = express();
var redis = require('redis');
var redisClient = redis.createClient();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 8082;

function emitMessage(client, message) {
  client.emit('message', message);
}

io.on('connection', function (client) {
  console.log("Client connected");
  client.on('join', function (name) {
    name = name || "Guest";
    client.name = name;
    console.log(name + ' joined');

    redisClient.lrange('messages', 0, -1, function (err, data) {
      data.reverse().forEach(function (message) {
        emitMessage(client, message);
      });
    });

    client.broadcast.emit('new member', name);
    redisClient.smembers('members', function(err, members) {
      members.forEach(function (member) {
        client.emit('new member', member);
      });
    });

    redisClient.sadd('members', name);
  });

  client.on('message', function (message) {
    var fullMessage = client.name + ": " + message;

    client.broadcast.emit('message', fullMessage);
    emitMessage(client, fullMessage);
    redisClient.lpush('messages', fullMessage)
  });

  client.on('disconnect', function (eventName) {
    var name = client.name;

    console.log('Member ' + name + " disconnected");
    redisClient.srem('members', name);
    client.broadcast.emit('remove member', name);
  });
});

app.get('/', function(req, res) {
  res.render('index.ejs');
});

server.listen(port, function () {
  console.log('Listening on port ' + port);
});