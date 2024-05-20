
function exibaMensagemNaOrdem(mensagem, callback){
    console.log(mensagem);
    callback();
}
//executando
exibaMensagemNaOrdem('Essa e a primeira mensagem exibida na ordem',
 function(){
    console.log('Essa e a segunda mensagem exibida na ordem');
});