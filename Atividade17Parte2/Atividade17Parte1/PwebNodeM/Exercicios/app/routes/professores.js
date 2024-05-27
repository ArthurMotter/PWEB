module.exports = function(app){
    app.get('/professores',function(req,res){
        res.render("informacao/professores");
    });
}