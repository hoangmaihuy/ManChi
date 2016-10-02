var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;
var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/dist'));
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log(res);
  next();
})
app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/`);
});
