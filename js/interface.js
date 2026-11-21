// =====================================================
// interface.js
// Tudo que DESENHA na tela. Lê o objeto "estado" e atualiza o HTML.
// Não decide regra nenhuma (isso é do regras.js).
// =====================================================

// ---------- Telas ----------
function mostrarTela(id) {
  ["telaMenu", "telaSegredo", "telaJogo"].forEach(t => {
    $(t).classList.toggle("escondido", t !== id);
  });
}

// Cria os botões de tema (chips) e marca o selecionado
function montarChips(container, opcoes, selecionado, aoEscolher) {
  container.innerHTML = "";
  opcoes.forEach(op => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chip" + (op.id === selecionado ? " ativo" : "");
    botao.textContent = op.icone + " " + op.nome;
    botao.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach(c => c.classList.remove("ativo"));
      botao.classList.add("ativo");
      aoEscolher(op.id);
    });
    container.appendChild(botao);
  });
}

// ---------- Menu ----------
function atualizarMenu() {
  $("opcoes1").classList.toggle("escondido", estado.modo !== 1);
  $("opcoes2").classList.toggle("escondido", estado.modo !== 2);

  document.querySelectorAll("#escolhaModo button").forEach(b => {
    b.classList.toggle("ativo", Number(b.dataset.modo) === estado.modo);
  });

  // Os botões de "quem escolhe" mostram o nome digitado
  document.querySelectorAll("#escolhaQuem button").forEach(b => {
    b.classList.toggle("ativo", b.dataset.quem === estado.quemEscolhe);
    if (b.dataset.quem !== "alternar") b.textContent = nome(Number(b.dataset.quem));
  });
}

// ---------- Tela da palavra secreta (modo 2) ----------
function prepararTelaSegredo(aoEscolherTema) {
  $("nomeEscolhe").textContent = nome(estado.escolhedor);
  $("nomeAdivinha").textContent = nome(adivinhador());
  $("inputPalavra").value = "";
  $("inputPalavra").type = "password";
  $("inputDica").value = "";
  $("erroSegredo").textContent = "";
  montarChips($("temasSegredo"), [{ id: "livre", nome: "Livre", icone: "✨" }, ...LISTA_TEMAS],
              "livre", aoEscolherTema);
}

// ---------- Tela do jogo ----------
// Monta a rodada do zero (tracinhos e teclado) e depois desenha o estado.
// Funciona tanto para rodada nova quanto para rodada restaurada após F5.
function montarRodada(aoClicarLetra) {
  const r = estado.rodada;

  $("badgeTema").textContent = r.tema;
  $("dica").textContent = r.dica ? "💡 " + r.dica : "";
  $("dica").classList.toggle("escondido", !r.dica);
  $("vez").textContent = estado.modo === 2 ? "🎯 Vez de " + nome(adivinhador()) + " adivinhar" : "";
  $("vez").classList.toggle("escondido", estado.modo !== 2);

  $("inputChute").value = "";
  $("msgChute").textContent = "Errar o chute conta como 1 erro.";
  $("resultado").classList.add("escondido");

  montarTracinhos();
  montarTeclado(aoClicarLetra);
  atualizarRodada();
  ajustarTamanhoLetras();
}

// Cria um tracinho por letra. Cada palavra fica num grupo
// para a quebra de linha acontecer entre palavras.
function montarTracinhos() {
  const area = $("palavra");
  const originais = letrasOriginais();
  const base = letrasBase();
  area.innerHTML = "";
  let grupo = null;

  originais.forEach((letra, i) => {
    if (letra === " ") { grupo = null; return; }   // espaço: fecha a palavra atual
    if (!grupo) {
      grupo = document.createElement("div");
      grupo.className = "grupo";
      area.appendChild(grupo);
    }
    const caixa = document.createElement("div");
    caixa.className = "letra";
    caixa.dataset.i = i;
    if (!ehLetra(base[i])) {          // hífen já aparece de cara
      caixa.textContent = letra;
      caixa.classList.add("simbolo");
    }
    grupo.appendChild(caixa);
  });
}

// Teclado no formato QWERTY
function montarTeclado(aoClicarLetra) {
  const teclado = $("teclado");
  teclado.innerHTML = "";
  ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].forEach(linha => {
    const fileira = document.createElement("div");
    fileira.className = "fileira";
    for (const letra of linha) {
      const botao = document.createElement("button");
      botao.className = "tecla";
      botao.textContent = letra;
      botao.id = "tecla-" + letra;
      botao.addEventListener("click", () => aoClicarLetra(letra));
      fileira.appendChild(botao);
    }
    teclado.appendChild(fileira);
  });
}

// Atualiza tudo a partir do estado: letras, teclado, boneco, corações e placar
function atualizarRodada() {
  const r = estado.rodada;
  const originais = letrasOriginais();
  const base = letrasBase();
  const erros = totalErros();
  const perdeu = erros >= MAX_ERROS;

  // Letras: revela as acertadas (ou todas, em vermelho, se perdeu)
  document.querySelectorAll("#palavra .letra").forEach(caixa => {
    if (caixa.textContent) return;                 // já revelada
    const i = Number(caixa.dataset.i);
    if (r.letrasCertas.includes(base[i])) {
      caixa.textContent = originais[i];
      caixa.classList.add("revelada");
    } else if (perdeu) {
      caixa.textContent = originais[i];
      caixa.classList.add("faltou");
    }
  });

  // Teclado: pinta as letras usadas e trava tudo se acabou
  document.querySelectorAll("#teclado .tecla").forEach(botao => {
    const letra = botao.textContent;
    const certa = r.letrasCertas.includes(letra);
    const errada = r.letrasErradas.includes(letra);
    botao.classList.toggle("certa", certa);
    botao.classList.toggle("errada", errada);
    botao.disabled = certa || errada || r.acabou;
  });

  // Boneco: mostra uma parte por erro
  for (let n = 1; n <= MAX_ERROS; n++) {
    $("parte" + n).classList.toggle("visivel", n <= erros);
  }

  // Rosto: feliz se ganhou, morto se perdeu, com medo a partir do 4º erro
  let rosto = "normal";
  if (r.acabou) rosto = perdeu ? "morto" : "feliz";
  else if (erros >= 4) rosto = "medo";
  $("forca").dataset.estado = rosto;
  $("boneco").classList.toggle("balancando", r.acabou && perdeu);

  // Campo de chutar a palavra trava no fim
  $("inputChute").disabled = r.acabou;
  $("btnChute").disabled = r.acabou;

  // Letras e chutes errados
  let textoErradas = r.letrasErradas.join("  ");
  if (r.chutesErrados.length > 0) {
    textoErradas += (textoErradas ? "   •   " : "") + "✗ " + r.chutesErrados.join(", ");
  }
  $("erradas").textContent = textoErradas;

  // Corações = chances restantes
  let coracoes = "";
  for (let i = 0; i < MAX_ERROS; i++) {
    const perdida = i >= MAX_ERROS - erros;
    coracoes += '<span class="coracao' + (perdida ? " perdida" : "") + '">❤️</span>';
  }
  $("vidas").innerHTML = coracoes;

  atualizarPlacar();
}

function atualizarPlacar() {
  const p = estado.placar;
  const itens = estado.modo === 1
    ? [["Vitórias", p.vitorias], ["Derrotas", p.derrotas], ["🔥 Seguidas", p.sequencia]]
    : [[nome(1), p.pontos[1]], [nome(2), p.pontos[2]]];

  const placar = $("placar");
  placar.innerHTML = "";
  itens.forEach(([rotulo, valor]) => {
    const item = document.createElement("div");
    item.className = "item";
    const span = document.createElement("span");
    span.textContent = rotulo;      // textContent: nome digitado nunca vira HTML
    const strong = document.createElement("strong");
    strong.textContent = valor;
    item.append(span, strong);
    placar.appendChild(item);
  });
}

// Diminui os tracinhos para a maior palavra caber na largura disponível
function ajustarTamanhoLetras() {
  if (!estado.rodada) return;
  const area = $("palavra");
  const largura = area.clientWidth;
  if (!largura) return;
  const maior = Math.max(...estado.rodada.palavra.split(" ").map(p => p.length));
  const espaco = 6;
  let tamanho = Math.floor((largura - (maior - 1) * espaco) / maior);
  tamanho = Math.max(16, Math.min(34, tamanho));   // entre 16px e 34px
  area.style.setProperty("--letra", tamanho + "px");
}

// Tremidinha quando erra
function tremer() {
  const area = $("areaPalavra");
  area.classList.remove("tremer");
  void area.offsetWidth;            // força o navegador a reiniciar a animação
  area.classList.add("tremer");
}

// Janela de fim de rodada
function mostrarResultado() {
  const res = estado.rodada.resultado;
  $("resEmoji").textContent = res.emoji;
  $("resTitulo").textContent = res.titulo;
  $("resPalavra").textContent = estado.rodada.palavra;
  $("resTexto").textContent = res.texto;
  $("resultado").classList.remove("escondido");
}

function resultadoAberto() {
  return !$("resultado").classList.contains("escondido");
}
