var express = require('express');
var app = express();
app.get('/historia',function(req,res){
    res.send("<html><body>História da Fatec Sorocaba</body></html>");
});
app.get('/cursos',function(req,res){
    res.send("<html><body>Cursos da Fatec Sorocaba</body></html>");
});
app.get('/professores',function(req,res){
    res.send("<html><body>Professores da Fatec Sorocaba</body></html>");
});
app.listen(3000,function(){
    console.log("servidor com express foi carregado");
});