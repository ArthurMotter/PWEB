var express = require('express');

var consign = require('consign');

var bodyParser = require('body-parser');

var app = express();
 
app.set('view engine','ejs') //mecanismo engine
app.set('views','./app/views'); //diretorio

app.use(bodyParser.urlencoded({extended: true}));

consign().include('app/routes').into(app)

consign({cwd:'app'})
 .include('routes')
 .then('config/dbConnection.js')
 .then('models')
 .into(app)

module.exports = app;