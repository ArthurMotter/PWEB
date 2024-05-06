
function validar() {
    // Variáveis para os campos do formulário
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var comentario = document.getElementById('comentario').value;
    var pesquisa = document.querySelector('input[name="pesquisa"]:checked').value;

    // Validação do nome
    if (nome.length < 10) {
        alert('O nome deve ter pelo menos 10 caracteres.');
        return false;
    }

    // Validação do email
    if (!/@|\./.test(email)) {
        alert('O email deve conter "@" e ".".');
        return false;
    }

    // Validação do comentário
    if (comentario.length < 20) {
        alert('O comentário deve ter pelo menos 20 caracteres.');
        return false;
    }

    // Mensagem de pesquisa
    if (pesquisa === 'SIM') {
        alert('Que bom que você voltou a visitar esta página!');
    } else {
        alert('Volte sempre à está página!');
    }

    // Retornar true para enviar o formulário
    return true;
}
