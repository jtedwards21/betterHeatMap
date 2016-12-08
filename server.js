var express = require('express')
var routes = require('./app/routes/index.js')
var pug = require('pug')

var app = express()
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

routes(app)


app.listen(process.env.PORT || 5000);
