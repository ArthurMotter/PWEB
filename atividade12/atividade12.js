//problema 1
function Retangulo(base, altura) {
    this.base = base;
    this.altura = altura;
  
    this.calcularArea = function() {
      return this.base * this.altura;
    };
  }
  
  // Criando um objeto Retângulo
  const retangulo1 = new Retangulo(5, 3);
  
  // Calculando e exibindo a área do retângulo
  const areaRetangulo1 = retangulo1.calcularArea();
  alert("Área do retângulo 1: " + areaRetangulo1);

//problema 2
class Conta {
  constructor(nomeCorrentista, banco, numeroConta, saldo) {
    this.nomeCorrentista = nomeCorrentista;
    this.banco = banco;
    this.numeroConta = numeroConta;
    this.saldo = saldo;
  }

  // Getters para todas as propriedades
  get nomeCorrentista() {
    return this._nomeCorrentista;
  }

  set nomeCorrentista(nome) {
    this._nomeCorrentista = nome;
  }

  get banco() {
    return this._banco;
  }

  set banco(banco) {
    this._banco = banco;
  }

  get numeroConta() {
    return this._numeroConta;
  }

  set numeroConta(numeroConta) {
    this._numeroConta = numeroConta;
  }

  get saldo() {
    return this._saldo;
  }

  set saldo(saldo) {
    this._saldo = saldo;
  }
}

class Corrente extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, limiteSaldoEspecial) {
      super(nomeCorrentista, banco, numeroConta, saldo);
      this.limiteSaldoEspecial = limiteSaldoEspecial;
    }
  
    // Getters e Setters específicos para Corrente
    get limiteSaldoEspecial() {
      return this._limiteSaldoEspecial;
    }
  
    set limiteSaldoEspecial(limite) {
      this._limiteSaldoEspecial = limite;
    }
  
    // Métodos específicos para Corrente (por exemplo, sacarComSaldoEspecial)
}
  

class Poupanca extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, dataVencimentoJuros) {
      super(nomeCorrentista, banco, numeroConta, saldo);
      this.dataVencimentoJuros = dataVencimentoJuros;
    }
  
    // Getters e Setters específicos para Poupanca
    get dataVencimentoJuros() {
      return this._dataVencimentoJuros;
    }
  
    set dataVencimentoJuros(data) {
      this._dataVencimentoJuros = data;
    }
  
    // Métodos específicos para Poupanca (por exemplo, adicionarJuros)
}



// Conta Corrente
const contaCorrente = new Corrente(
    "João Silva",
    "Banco do Brasil",
    "12345-6",
    1000,
    500
);
  
  alert("Conta Corrente: " +
  `\nNome: ${contaCorrente.nomeCorrentista}` +
  `\nBanco: ${contaCorrente.banco}` +
  `\nNúmero da Conta: ${contaCorrente.numeroConta}` +
  `\nSaldo: ${contaCorrente.saldo}` +
  `\nLimite de Saldo Especial: ${contaCorrente.limiteSaldoEspecial}`);
  
// Conta Poupança
  const contaPoupanca = new Poupanca(
    "Maria Oliveira",
    "Itaú Unibanco",
    "65432-1",
    2000,
    new Date("2024-05-10")
);
  
  alert("\nConta Poupança:" +
  `\nNome: ${contaPoupanca.nomeCorrentista}` +
  `\nBanco: ${contaPoupanca.banco}` +
  `\nNúmero da Conta: ${contaPoupanca.numeroConta}` +
  `\nSaldo: ${contaPoupanca.saldo}` +
  `\nData de Vencimento dos Juros: ${contaPoupanca.dataVencimentoJuros}`);  