var express = require('express');
var app = express();
 
app.set('view engine','ejs') //mecanismo engine
app.set('views','./app/views'); //diretorio

module.exports = app;