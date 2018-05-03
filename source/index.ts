// Setup basic express server
import express = require('express');
import path = require('path');
import util = require('util');
//import { FreeSWITCH } from './freeswitch';

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

