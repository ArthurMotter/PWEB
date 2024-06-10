var express = require('express');

var consign = require('consign');

var app = express();
 
app.set('view engine','ejs') //mecanismo engine
app.set('views','./app/views'); //diretorio

consign().include('app/routes').into(app)

consign({cwd:'app'})
 .include('routes')
 .then('config/dbConnection.js')
 .into(app)

module.exports = app;