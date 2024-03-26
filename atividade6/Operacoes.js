//arquivo javascript para operacoes

var num1, num2;

num1 = parseFloat(prompt("digite o primeiro numero: "));
num2 = parseFloat(prompt("digite o segundo numero: "));

//soma
alert("Soma dos numeros: "+ (num1 + num2) );

//subtracao do 1o pelo 2o
alert("Subtracao dos numeros: "+ (num1 - num2) );

//produto dos dois
alert("Produto dos numeros: "+ (num1 * num2) );

//divisao do 1o pelo 2o
alert("Divisao dos numeros: "+ (num1 / num2) );

//resto da divisao do 1o pelo 2o
alert("Resto da divisao dos numeros: "+ (num1 % num2) );

var decisao = confirm("O calculo das operacoes foi correto?");
if (decisao) {
alert("Obrigado por confirmar!");
} else {
alert("Você esta errado!");
}