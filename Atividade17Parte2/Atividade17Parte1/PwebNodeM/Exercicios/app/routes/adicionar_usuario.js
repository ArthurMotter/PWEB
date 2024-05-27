module.exports = function(app){
    app.get('/adicionar_usuario',function(req,res){
        res.render("admin/adicionar_usuario");
    });
}