
function converterMaiusculas() {
    const texto = document.getElementById('texto').value;
    if (document.getElementById('maiusculas').checked) {
        document.getElementById('texto').value = texto.toUpperCase();
    } else {
        document.getElementById('texto').value = "";
    }
}

function converterMinusculas() {
    const texto = document.getElementById('texto').value;
    if (document.getElementById('minusculas').checked) {
        document.getElementById('texto').value = texto.toLowerCase();
    } else {
        document.getElementById('texto').value = "";
    }
}