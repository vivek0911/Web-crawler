var express = require('express');
var app  = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const connect = require('./db');
const routes = require('./db/routes');
connect();

app.use('/api', routes);

http.listen(3000, function(){
  console.log('Server running on port 3000');
});