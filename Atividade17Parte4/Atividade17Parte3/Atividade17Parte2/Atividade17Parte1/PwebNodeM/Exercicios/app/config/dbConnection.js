var sql = require('mssql'); // Importação correta do módulo

var connSQLServer = function () {

    const sqlConfig = {
        user: 'BD2221013', //'LOGON',

        password: 'Rth$0915', //'SENHA',

        database: 'BD', //'site_fatec',

        server: 'APOLO', //'NOME_DO_SERVIDOR',
        options: {
            encrypt: false,
            trustServerCertificate: true // se você não tiver um certificado de servidor configurado
        }
    }
    return sql.connect(sqlConfig);

}
module.exports = function(){
    console.log("O autoload carregou o modulo de conexao com o bd");
    return connSQLServer;
}