var eventos = require('events');

//atrib de classes eventEmmiter em uma var
var EmissorEventos = eventos.EventEmitter;

//criação de uma instancia do EventEmitter variável:
var ee = new EmissorEventos();

//outra forma:
//var ee = new eventos.EventEmitter();

ee.on('dados', function(fecha){
    console.log(fecha);
});
setInterval(function(){
    ee.emit('dados', Date.now());
},500);
