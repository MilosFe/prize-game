/**** Index.Js
 @ Node Node server
 *****/

/* Loading required dependencies:
 ** @express framework for node 
 ** @body-parser for json decode of headers
 ** @logger for console logging for showing params
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var http = require('http');
var nodemailer = require("nodemailer");




/* app uses port 5000 or environments port, in our case 
   our production server will be on Heroku, but local server is on 5000
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/app'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.set('app', __dirname + '/app');


app.get('/', function(request, response) {
    response.render('index');
});





app.listen(app.get('port'), function() {
    console.log('Node app is running on', app.get('port'));
});