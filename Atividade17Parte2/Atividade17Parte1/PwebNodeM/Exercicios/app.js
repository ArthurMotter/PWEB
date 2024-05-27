var app = require('./app/config/server'); //carregando modulo server
//declaracao de rotas
var rotaAdicionaUsuario = require('./app/routes/adicionar_usuario')
var rotaCursos = require('./app/routes/cursos')
var rotaHome = require('./app/routes/home')
var rotaHistoria = require('./app/routes/historia')
var rotaProfessores = require('./app/routes/professores')

//uso de rotas
rotaAdicionaUsuario(app);
rotaCursos(app);
rotaHistoria(app);
rotaHome(app);
rotaProfessores(app);

app.listen(3000,function(){
    console.log('servidor iniciado');
});