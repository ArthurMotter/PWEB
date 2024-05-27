var aluno1 = new Object();
aluno1.ra = "0001234";
aluno1.nome = "Leonardo";
alert("ra=" + aluno1.ra + " nome=" + aluno1.nome);
alert(`ra=${aluno1.ra} nome=${aluno1.nome}`);

//usando {}
var aluno2 = {};
aluno2.ra = "1234";
aluno2["nome"] = "Carina";
alert("\tra=" + aluno2.ra + " nome=" + aluno2.nome);
alert(`ra=${aluno2.ra} nome=${aluno2.nome}`);
aluno2["email do aluno"] = "carina@gmail.com";

//literal
var aluno3 = {
    ra: "1234567",
    nome: "Felipe"
};

alert("ra=" + aluno3.ra + " nome=" + aluno3.nome);
alert(`ra=${aluno3.ra} nome=${aluno3.nome}`);

//usando função construtora
function Aluno(ra, nome) {
    this.ra = ra;
    this.nome = nome;
    this.MostrarDados = function () {
        return "ra=" + this.ra + " nome=" + this.nome;
    }
}
var aluno4 = new Aluno("123", "Rute");
alert(aluno4.MostrarDados());
alert(aluno4.nome);

var aluno5 = {};
var nome_propriedade = "ra";
aluno5[nome_propriedade] = "123";
aluno5['nome'] = "Edson";
alert(aluno5.ra + " " + aluno5.nome);

//usando função construtora sem parâmetros
function Aluno2(){
    var RA;
    var Nome;

    this.setRa = function (value) {
        this.RA = value;
    }
    this.getRa = function () {
        return this.RA;
    }

    this.setNome = function (value) {
        this.Nome = value;
    }
    this.getNome = function () {
        return this.Nome;
    }
}
    
    var aluno6 = new Aluno2();
    aluno6.setNome("Lucas");
    aluno6.setRa("234");
    alert("ra=" + aluno6.getRa() + " nome=" + aluno6.getNome());


//herança
function AlunoADS() {
    var numLab;
    this.setNumLab = function (value) {
        this.numLab = value;
    }
    this.getNumLab = function () {
        return this.numLab;
    }
}

AlunoADS.prototype = new Aluno2();
    var aluno7 = new AlunoADS();
    aluno7.setNome("Gustavo");
    aluno7.setRa("123");
    aluno7.setNumLab(5);
    alert(aluno7.getNome() + " " + aluno7.getNumLab());

//a partir do ES10
const arr = [['código', 1], ['nome', "joão"], ['idade', 23]];
const obj = Object.fromEntries(arr);
alert(JSON.stringify(obj));

class Aluno1 {
    constructor (){
        this._ra;
        this._nome;
    }

    setNome(value){
        this._nome = value;
    }
    getNome(){
        return this._nome;
    }
    setRa(value){
        this._ra = value;
    }
    getRa(){
        return this._ra;
    }
}

var ObjAluno = new Aluno1();
ObjAluno.setNome("Livia");
ObjAluno.setRa('123');
alert(`nome=${ObjAluno.getNome()}
        ra=${ObjAluno.getRa()}`);

class AlunoADS1 extends Aluno1{
    construtor() {
        this._numLab;
    }
    setNumLab(value){
        this._numLab = value;
    }
    getNumLab(){
        return this._numLab;
    }
}

var ObjAlunoADS = new AlunoADS1();
ObjAlunoADS.setNome("Lauri");
ObjAlunoADS.setRa('123');
alert(`nome=${ObjAlunoADS.getNome()}
        ra=${ObjAlunoADS.getRa()}
        numlab=${ObjAlunoADS.getNumLab()}`);

//cópia de objetos
var obj1 = new Object();
var obj2 = obj1;
obj1.nome = "Nicole";
alert(obj2.nome);