var height = parseFloat(prompt("Digite a sua altura: "));
var Weight = parseFloat(prompt("Digite seu peso: "));
var result = calcIMC(height, Weight);

function calcIMC(height, Weight) {
    var imc = Weight / (Math.pow(height, 2));

    if (imc < 18.5) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está abaixo do peso.`;
    } else if (imc < 25) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está no peso normal.`;
    } else if (imc < 30) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com sobrepeso, grau I.`;
    } else if (imc < 40) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com obesidade, grau II.`;
    } else {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com obesidade grave, grau III.`;
    }
}

alert(result);