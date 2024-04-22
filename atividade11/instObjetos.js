//obs: utilizar cosntantes diferentes para funcionar
//1-por função
function Aluno(RA, nome) {
    this.RA = RA;
    this.nome = nome;
  }
  
  const aluno1 = new Aluno("12345", "João Silva");
  
  alert(`RA: ${aluno1.RA} Nome: ${aluno1.nome}`);


  
  //2-por literal
  const aluno2 = {
    RA: "45",
    nome: "Marcos Lima"
  };
  
  alert(`RA: ${aluno2.RA} Nome: ${aluno2.nome}`);

 
  //3-por protóipo
  const alunoPrototipo = {
    falar: function() {
        alert(`Olá, meu nome é ${this.nome}.
        meu RA é ${this.RA}.`);
    }
  };
  

  const aluno3 = Object.create(alunoPrototipo, {
    RA: {
      value: "123456",
    },
    nome: {
      value: "Maria da Silva",
    }
  });
  
  aluno3.falar();
  