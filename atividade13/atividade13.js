// Função para mostrar a imagem da janela aberta
function abrirJanela() {
    document.getElementById("imagemJanela").src = "janelaAberta.jpg";
    document.querySelector("h1").textContent = "Janela Aberta";
  }
  
  // Função para mostrar a imagem da janela fechada
  function fecharJanela() {
    document.getElementById("imagemJanela").src = "janelaFechada.jpg";
    document.querySelector("h1").textContent = "Janela Fechada";
  }
  
  // Função para mostrar a imagem da janela quebrada
  function quebrarJanela() {
    document.getElementById("imagemJanela").src = "janelaQuebrada.jpg";
    document.querySelector("h1").textContent = "Janela Quebrada";
  }
  
  // Evento de mousemove sobre a imagem da janela
  document.getElementById("imagemJanela").addEventListener("mousemove", abrirJanela);
  
  // Evento de mouseout da imagem da janela
  document.getElementById("imagemJanela").addEventListener("mouseout", fecharJanela);
  
  // Evento de click na imagem da janela
  document.getElementById("imagemJanela").addEventListener("click", quebrarJanela);
  