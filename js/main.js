// =====================================================
// main.js
// Liga tudo: responde aos cliques e ao teclado, chama as regras
// (regras.js), redesenha a tela (interface.js) e salva o progresso
// (armazenamento.js) depois de cada ação.
// =====================================================

let temaSegredo = "livre";     // tema escolhido na tela da palavra secreta (modo 2)
let timerResultado = null;     // atraso para mostrar a janela de resultado

// ---------- Navegação ----------
function irPara(tela) {
  estado.tela = tela;
  mostrarTela(tela);
  salvar();
}

function jogar() {
  zerarPlacar();
  if (estado.modo === 1) {
    iniciarModo1();
  } else {
    estado.escolhedor = estado.quemEscolhe === "2" ? 2 : 1;   // "alternar" começa pelo jogador 1
    abrirTelaSegredo();
  }
}

function voltarMenu() {
  clearTimeout(timerResultado);
  estado.rodada = null;          // abandona a rodada atual
  atualizarMenu();
  irPara("telaMenu");
}

// ---------- Rodadas ----------
function iniciarModo1() {
  const sorteio = sortearPalavra();
  comecarRodada(sorteio.palavra, sorteio.tema, "");
}

function abrirTelaSegredo() {
  clearTimeout(timerResultado);
  estado.rodada = null;          // a palavra só é salva depois de confirmada
  temaSegredo = "livre";
  prepararTelaSegredo(id => temaSegredo = id);
  irPara("telaSegredo");
  $("inputPalavra").focus();
}

function confirmarPalavraSecreta() {
  const validacao = validarPalavraSecreta($("inputPalavra").value);
  if (validacao.erro) {
    $("erroSegredo").textContent = validacao.erro;
    return;
  }
  const tema = temaSegredo === "livre"
    ? "✨ Tema livre"
    : TEMAS[temaSegredo].icone + " " + TEMAS[temaSegredo].nome;
  comecarRodada(validacao.palavra, tema, $("inputDica").value.trim());
}

function comecarRodada(palavra, tema, dica) {
  clearTimeout(timerResultado);
  novaRodada(palavra, tema, dica);
  mostrarTela("telaJogo");       // precisa estar visível para medir a largura dos tracinhos
  montarRodada(aoChutarLetra);
  salvar();
}

function proximaRodada() {
  if (estado.modo === 1) {
    iniciarModo1();
  } else {
    passarVez();
    abrirTelaSegredo();
  }
}

// ---------- Jogadas ----------
function aoChutarLetra(letra) {
  const resultado = chutarLetra(letra);
  if (resultado === "ignorada" || resultado === "repetida") return;   // não conta
  if (resultado === "errada") tremer();
  depoisDaJogada();
}

function aoChutarPalavra() {
  const campo = $("inputChute");
  const msg = $("msgChute");
  const resultado = chutarPalavra(campo.value);

  switch (resultado.tipo) {
    case "ignorada": return;
    case "vazio":    msg.textContent = "Digite a palavra que você acha que é."; return;
    case "invalido": msg.textContent = "Use só letras."; return;
    case "repetida": msg.textContent = "Você já chutou essa palavra."; campo.value = ""; return;
    case "errada":
      msg.textContent = "\"" + resultado.texto + "\" não é a palavra. Contou 1 erro.";
      tremer();
      break;
    case "certa":
      msg.textContent = "";
      break;
  }
  campo.value = "";
  depoisDaJogada();
}

// Depois de cada jogada: confere o fim, redesenha e salva
function depoisDaJogada() {
  const acabouAgora = verificarFimDeJogo();
  atualizarRodada();
  salvar();
  if (acabouAgora) {
    // Espera um pouco para o jogador ver o boneco/palavra antes da janela
    timerResultado = setTimeout(mostrarResultado, 900);
  }
}

// ---------- Restaurar o progresso ao abrir/atualizar a página ----------
function restaurarJogo() {
  const salvo = carregarEstado();
  if (salvo) {
    estado = salvo;
  } else {
    apagarEstado();              // remove dados inválidos, se houver
  }

  $("nomeJ1").value = estado.nomes[1];
  $("nomeJ2").value = estado.nomes[2];
  montarChips($("temasMenu"), [{ id: "todos", nome: "Todos", icone: "🎲" }, ...LISTA_TEMAS],
              estado.temaMenu, id => { estado.temaMenu = id; salvar(); });
  atualizarMenu();

  if (estado.tela === "telaJogo") {
    mostrarTela("telaJogo");
    montarRodada(aoChutarLetra);
    if (estado.rodada.acabou) mostrarResultado();
  } else if (estado.tela === "telaSegredo") {
    abrirTelaSegredo();          // por segurança, a palavra digitada não fica salva
  } else {
    mostrarTela("telaMenu");
  }
}

// =====================================================
// EVENTOS
// =====================================================

// Menu
document.querySelectorAll("#escolhaModo button").forEach(b => {
  b.addEventListener("click", () => {
    estado.modo = Number(b.dataset.modo);
    atualizarMenu();
    salvar();
  });
});
document.querySelectorAll("#escolhaQuem button").forEach(b => {
  b.addEventListener("click", () => {
    estado.quemEscolhe = b.dataset.quem;
    atualizarMenu();
    salvar();
  });
});
[1, 2].forEach(n => {
  $("nomeJ" + n).addEventListener("input", evento => {
    estado.nomes[n] = evento.target.value;
    atualizarMenu();
    salvar();
  });
});
$("btnJogar").addEventListener("click", jogar);

// Tela da palavra secreta
$("btnComecar").addEventListener("click", confirmarPalavraSecreta);
$("btnVoltarSegredo").addEventListener("click", voltarMenu);
$("btnTrocar").addEventListener("click", () => {
  estado.escolhedor = adivinhador();
  abrirTelaSegredo();
});
$("btnOlho").addEventListener("click", () => {
  const campo = $("inputPalavra");
  campo.type = campo.type === "password" ? "text" : "password";
});

// Tela do jogo
$("btnMenu").addEventListener("click", voltarMenu);
$("btnResMenu").addEventListener("click", voltarMenu);
$("btnProxima").addEventListener("click", proximaRodada);
$("btnChute").addEventListener("click", aoChutarPalavra);

// Se a janela mudar de tamanho (ou o celular girar), reajusta os tracinhos
window.addEventListener("resize", () => {
  if (estado.tela === "telaJogo") ajustarTamanhoLetras();
});

// Teclado físico
document.addEventListener("keydown", evento => {
  if (evento.ctrlKey || evento.metaKey || evento.altKey) return;

  // Digitando em um campo: as letras NÃO viram chute no jogo
  if (evento.target.tagName === "INPUT") {
    if (evento.key === "Enter") {
      if (evento.target.id === "inputChute") aoChutarPalavra();
      else if (estado.tela === "telaSegredo") confirmarPalavraSecreta();
      else if (estado.tela === "telaMenu") jogar();
    }
    return;
  }

  // Botão com foco (navegando com Tab): Enter/Espaço já clicam nele.
  // Sem isso, a ação rodaria duas vezes.
  if (evento.target.tagName === "BUTTON" && (evento.key === "Enter" || evento.key === " ")) return;

  if (estado.tela !== "telaJogo") return;

  // Janela de resultado aberta: Enter vai para a próxima rodada
  if (resultadoAberto()) {
    if (evento.key === "Enter") proximaRodada();
    return;
  }

  if (evento.key.length === 1) {
    const letra = normalizar(evento.key);
    if (ehLetra(letra)) aoChutarLetra(letra);
  }
});

// Começa: volta de onde parou (ou abre o menu)
restaurarJogo();
