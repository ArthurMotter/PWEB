var idade, sexo, opniao;
var qtdeP = 0;
var mediaIdades = 0, idadeMV = 0, idadeMN = 0, resPess = 0, resOtBm = 0, qtdMul = 0, qtdHom = 0;

while(qtdeP < 45){
    alert("bem vindo a pesquisa do filme, participante " + (qtdeP +1));
    idade = parseInt(prompt("digite sua idade: "));
    if (idade == 0){
        break;
    }
    sexo = prompt("sexo: f/m" + "\ndigite seu sexo: ");
    opniao = parseInt(prompt("ótimo = 4" + 
                            "\nBom = 3" +
                            "\nRuim = 2" +
                            "\nPéssimo = 1" +
                            "\ndigite sua opnião (de 1 a 4): "));

    mediaIdades = mediaIdades + idade;

    //calculos das variaveis de Idade e afins
    if(idade > idadeMV){
        idadeMV = idade;
    }
    if( idade < idadeMN){
        idadeMN = idade;
    }
    else{
        if(idadeMN == 0){
            idadeMN = idade;
        }
    }
    

    //calculos das variaveis de Opniao e afins
    if(opniao == 1){
        resPess++;
    }
    else{
        if(opniao == 4 || opniao == 3){
            resOtBm++;
        }
    }
    

    //calculos das variaveis de sexo e afins
    if(sexo == 'f' || sexo == 'F'){
        qtdMul++;
    }
    else{
        qtdHom++;
    }
    

    qtdeP++;
    alert("obrigado por participar da pesquisa");
}

//resultados
if(qtdeP == 0){
    alert("Não foi possível realizar a pesquisa");
}
else{
    alert("Média das idades: " + (mediaIdades / qtdeP).toFixed(2));
    alert("Idade da pessoa mais velha: " + idadeMV);
    alert("Idade da pessoa mais nova: " + idadeMN);
    alert("Quantidade de respostas de péssimo: " + resPess);
    alert("Porcentagem de respostas de ótimo ou bom: " +
     (((resOtBm) / qtdeP) * 100) + "%");
    alert("Quantidade de respostas de mulheres: " + qtdMul);
    alert("Quantidade de respostas de homens: " + qtdHom);
}
