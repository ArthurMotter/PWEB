var dbConnection = require('../config/dbConnection')
 
module.exports = function (app) {
    app.get('/informacao/professores', async function (req, res) {
        async function getProfessores() {
            try {
                const pool = await dbConnection();
                const results = await pool.request().query('SELECT * from PROFESSORES');
                //res.send(results.recordset);
                res.render("informacao/professores",{profs: results.recordset});
            } catch (err) {
                console.log(err);
            }
        }
 
        getProfessores();
    });
   
};