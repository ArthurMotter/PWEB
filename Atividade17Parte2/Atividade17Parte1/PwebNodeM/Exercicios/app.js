var express = require('express');
var app = express();
var texto = require("./modulo1");//n precisa carregar .js
 
app.set('view engine','ejs')
 
app.get('/',function(req,res){
    res.render("home/index");
});
app.get('/historia',function(req,res){
    res.render("informacao/historia");
});
app.get('/cursos',function(req,res){
    res.render("informacao/cursos");
});
app.get('/professores',function(req,res){
    res.render("informacao/professores");
});
app.get('/adicionar_usuario',function(req,res){
    res.render("admin/adicionar_usuario");
});
app.listen(3000,function(){
    console.log(texto);
});