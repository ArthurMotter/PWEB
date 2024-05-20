const prompt = require('prompt-sync')();
//instalar npm prompt-sync
function saudacao(nome){
    console.log('Oi ' + nome);
}

function entradaNome(callback){
    var nome = prompt('Digite seu nome: ');
    callback(nome) //chamando a funcao callback(saudacao)
}

entradaNome(saudacao);