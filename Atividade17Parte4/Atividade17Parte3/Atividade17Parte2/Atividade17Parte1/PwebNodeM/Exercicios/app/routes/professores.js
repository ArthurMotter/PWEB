module.exports = function (app) {
    app.get('/informacao/professores', function (req, res) {
        async function getProf() {
            try {
                var connection = app.config.dbConnection;
                const pool = await connection();

                var professoresModel = app.models.professormodel;// variável que recupera a função exporta

                //executar a função 
                // tem passar a conexao e o callback 
                professoresModel.getProfessores(pool, function (error, results) {
                    res.render('informacao/professores', { profs: results.recordset });
                });
            } catch (err) {
                console.log(err)
            }
        }
        getProf();
    });
}