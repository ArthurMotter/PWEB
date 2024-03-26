//arquivo javascript para medias

//calcular media aritmetica
var nome, nota1, nota2, nota3, media;

nome = prompt("digite o nome do aluno: ");
nota1 = prompt("digite a primeira nota: ");
nota2 = prompt("digite a segunda nota: ");
nota3 = prompt("digite a terceira nota: ");

media = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3)) / 3;

alert("Média do aluno: " + media);