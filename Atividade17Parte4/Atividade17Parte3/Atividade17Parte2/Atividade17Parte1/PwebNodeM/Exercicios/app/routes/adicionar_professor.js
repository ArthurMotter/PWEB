module.exports = function (application) {
    application.get('/admin/adicionar_professor', function (req, res) {
        res.render('admin/adicionar_professor');
    });
    application.post('/professor/salvar', function (req, res) {

        async function getAdcProfessor() {
            try {
                var professor = req.body;

                var connection = application.config.dbConnection;
                const pool = await connection();

                var professoresModel = application.models.professormodel;

                //usando uma funcao de callback e informar quem devemos salvar, no caso professor

                professoresModel.salvarProfessor(professor, pool, (error, results) => {
                    // após inserir redireciona o navegador para outra página
                    // se der erro na inclusao criar um erro 500 --> nao sabe o que significa

                    if (error) {
                        console.log('Erro ao inserir no banco:' + error);
                        res.status(500).send(error);
                    } else {
                        console.log('professor criado!!!');
                        res.redirect('/informacao/professores');
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        getAdcProfessor();
    });
}