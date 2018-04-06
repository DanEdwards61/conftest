// Setup basic express server
import express = require('express');
import path = require('path');
import { FreeSWITCH } from './freeswitch';

var app = express();
var server = require('http').createServer(app);
var io; 
var port = process.env.PORT || 3000;

// FS connect data
const ESL_PWD = '0SMz7TFZnWfDXf5IYJoM';
const ESL_HOST = '18.222.61.84';
const ESL_PORT = 8021;


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'node_modules')));

var numUsers = 0;
var esl_conn = new FreeSWITCH.FSConnection( ESL_HOST, ESL_PORT, ESL_PWD );

esl_conn.on('connected', () => {
  console.log('FS connection established.');

  if (!io) {
    io = require('socket.io')(server);

    io.on('connection', function (socket) {
      console.log(`Processing socket connection from ${socket.id}`);

      esl_conn.conference_list()
        .then( c_list => {
          socket.emit('conference list', c_list);
        })

      socket.on('join conference', function (dn) {
        console.log(`User wants to join conference ${dn}`);
      });

      socket.on('leave conference', function (dn) {
          console.log(`User leaving conference ${dn}`)
      });

      socket.on('disconnect', function () {
          console.log(`disconnect: ${socket.id}`);
      });
    });
  }
});


