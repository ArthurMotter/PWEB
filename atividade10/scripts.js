var number = new Array(3);

for(let i=0; i<=2; i++) {
    number[i] = parseInt(prompt("Digite o " + (i+1) + "o número: "));
}
alert("Maior número: " + GreaterNumber(number));
alert("Ordenado: " + ordenation(number));


var text;
text = prompt("Digite uma frase: ");


if(palindrome(text) == true) {
    alert("É palíndromo");
}
else {
    alert("Não é palíndromo");
}


var Triangle = Triangle(number);
alert("Resultado: " + Triangle);


//funções
function GreaterNumber(number) {
    alert("1a");
    return Math.max(...number);
}

function ordenation(number) {
    alert("2a");
    number.sort((a, b) => a - b);
    return number;
}

function palindrome(text) {
    const textUpperCase = text.toUpperCase().replace(/\s+/g, "");
    const reverso = textUpperCase.split("").reverse().join("");
    return textUpperCase === reverso;
}

function Triangle(number) {
    if((number[0] + number[1]) >= number[2] && (number[0] + number[2]) >= number[1] && (number[1] + number[2]) > number[0]) {
        if(number[0] === number[1] && number[1] === number[2]) {
            return "É um triângulo equilátero";
        } else if(number[0] === number[1] || number[1] === number[2] || number[0] === number[2]) {
            return "É um triângulo isósceles";
        } else {
            return "É um triângulo escaleno";
        }
    }
    else {
        return "Não é um Triângulo";
    }
}