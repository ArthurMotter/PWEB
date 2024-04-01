var escolhaH, escolhaBot, t=1;
do{
    escolhaH = prompt("digite sua escolha: ");

    //fazendo bot escolher
    escolhaBot = Math.random();
    
    if(escolhaBot < 0.33){
        escolhaBot = "pedra";
    }
    else if(escolhaBot < 0.66){
        escolhaBot = "papel";
    }
    else{
        escolhaBot = "tesoura";
    }
    
    alert("escolha do bot: " + escolhaBot);
    
    //jogador humano ganha
    if(escolhaBot == "pedra" && escolhaH == "papel"){
        alert("humano venceu");
    }
    else if(escolhaBot == "papel" && escolhaH == "tesoura"){
        alert("humano venceu");
    }
    else if(escolhaBot == "tesoura" && escolhaH == "pedra"){
        alert("humano venceu");
    }
    //jogador bot ganha
    else if(escolhaH == "pedra" && escolhaBot == "papel"){
        alert("robo venceu");
    }
    else if(escolhaH == "papel" && escolhaBot == "tesoura"){
        alert("robo venceu");
    }
    else if(escolhaH == "tesoura" && escolhaBot == "pedra"){
        alert("robo venceu");
    }
    //jogador nenhum ganha
    else{
        alert("ninguem venceu, empate");
    }
} while(t!=0)