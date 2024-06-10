module.exports = function () {

    this.getProfessores = function (connection, callback) {
        connection.query('select * from professores', callback);
    }

    this.getProfessor = function (connection, callback) {
        connection.query('select * from professores WHERE id_professor=1', callback);
    }

    this.salvarProfessor = function (professor, connection, callback) {
        connection.query("INSERT INTO professores (NOME_PROFESSOR,EMAIL_PROFESSOR) VALUES ('" + professor.nome_professor + "','" + professor.email_professor + "')", callback);
    }

    return this;

}