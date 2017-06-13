var express = require('express');
var app  = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

/* NOTE: 
    I have made routes and controller to check if database and everything working fine. I will make
    API request using POSTMAN. For our purpose we don't need actually. We directly call service in order 
    read, write, update database.
    
    I could make api request and not directly call service to talk to database, using Axios library.
    It would be more sophisticated way to talk to database and we call handle all error in controller.
*/

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const connect = require('./db');
const routes = require('./db/routes');
connect();

const crawl = require('./crawl');
setTimeout(() => crawl(), 3000);

app.use('/api', routes);

http.listen(3000, function(){
  console.log('Server running on port 3000');
});