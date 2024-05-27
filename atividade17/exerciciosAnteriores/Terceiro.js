var soma = 0;
for(var i = 2; i <= process.argv.lengh; i++){
    soma = soma + Number(process.argv(i));
}
console.log("soma ="+soma)