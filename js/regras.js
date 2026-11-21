// =====================================================
// regras.js
// As REGRAS do jogo da forca. Este arquivo só altera o objeto
// "estado" e devolve o que aconteceu. Ele NÃO mexe na tela:
// quem desenha é o interface.js.
// =====================================================

// ---------- Modo 1 jogador: sorteia uma palavra ----------
function sortearPalavra() {
  let idTema = estado.temaMenu;
  if (idTema === "todos") {
    const ids = Object.keys(TEMAS);
    idTema = ids[Math.floor(Math.random() * ids.length)];
  }

  const lista = TEMAS[idTema].palavras;
  let palavra;
  do {
    palavra = lista[Math.floor(Math.random() * lista.length)];
  } while (palavra === estado.ultimaPalavra && lista.length > 1);   // não repete a anterior
  estado.ultimaPalavra = palavra;

  return { palavra: palavra, tema: TEMAS[idTema].icone + " " + TEMAS[idTema].nome };
}

// ---------- Modo 2 jogadores: confere a palavra digitada ----------
// Devolve { palavra } se estiver ok, ou { erro: "mensagem" }
function validarPalavraSecreta(textoDigitado) {
  const texto = textoDigitado.trim().replace(/\s+/g, " ").toUpperCase();
  const caracteres = [...texto];

  if (texto === "") {
    return { erro: "Digite a palavra secreta." };
  }
  if (caracteres.length > 25) {
    return { erro: "Use no máximo 25 caracteres." };
  }
  // Sem acento, cada caractere precisa ser letra A-Z, espaço ou hífen
  if (!caracteres.every(c => /^[A-Z \-]$/.test(normalizar(c)))) {
    return { erro: "Use só letras (pode ter acento, espaço e hífen)." };
  }
  if (caracteres.filter(c => ehLetra(normalizar(c))).length < 2) {
    return { erro: "A palavra precisa ter pelo menos 2 letras." };
  }
  return { palavra: texto };
}

// ---------- Começa uma rodada nova ----------
function novaRodada(palavra, tema, dica) {
  estado.rodada = {
    palavra: palavra,
    tema: tema,
    dica: dica,
    letrasCertas: [],
    letrasErradas: [],
    chutesErrados: [],
    acabou: false,
    resultado: null
  };
  estado.tela = "telaJogo";
}

// ---------- Chutar uma letra ----------
// Devolve: "certa", "errada", "repetida" ou "ignorada" (jogo já acabou)
function chutarLetra(letra) {
  const r = estado.rodada;
  if (!r || r.acabou) return "ignorada";
  if (r.letrasCertas.includes(letra) || r.letrasErradas.includes(letra)) return "repetida";

  if (letrasBase().includes(letra)) {
    r.letrasCertas.push(letra);
    return "certa";
  }
  r.letrasErradas.push(letra);
  return "errada";
}

// ---------- Chutar a palavra inteira ----------
// Regra clássica: pode chutar a qualquer momento.
// Acertou = ganha na hora. Errou = conta como 1 erro.
// Devolve: { tipo: "certa" | "errada" | "repetida" | "vazio" | "invalido" | "ignorada", texto }
function chutarPalavra(textoDigitado) {
  const r = estado.rodada;
  if (!r || r.acabou) return { tipo: "ignorada" };

  const texto = normalizar(textoDigitado.trim());
  if (texto === "") return { tipo: "vazio" };
  if (!/^[A-Z \-]+$/.test(texto)) return { tipo: "invalido" };

  // Compara só as letras: ignora acento, espaço e hífen
  const chute = texto.replace(/[^A-Z]/g, "");
  const correta = letrasBase().filter(ehLetra).join("");

  if (chute === correta) {
    letrasBase().filter(ehLetra).forEach(l => {
      if (!r.letrasCertas.includes(l)) r.letrasCertas.push(l);
    });
    return { tipo: "certa", texto: texto };
  }
  if (r.chutesErrados.includes(chute)) return { tipo: "repetida", texto: texto };   // não conta 2x

  r.chutesErrados.push(chute);
  return { tipo: "errada", texto: texto };
}

// ---------- Confere se a rodada acabou ----------
// Se acabou: marca a rodada como encerrada, atualiza o placar e
// guarda a mensagem do resultado. Devolve true só na hora em que acaba.
function verificarFimDeJogo() {
  const r = estado.rodada;
  if (!r || r.acabou) return false;

  // Ganhou se todas as letras (sem contar espaço e hífen) foram acertadas
  const ganhou = letrasBase().filter(ehLetra).every(c => r.letrasCertas.includes(c));
  const perdeu = totalErros() >= MAX_ERROS;
  if (!ganhou && !perdeu) return false;

  r.acabou = true;
  const placar = estado.placar;

  if (estado.modo === 1) {
    if (ganhou) { placar.vitorias++; placar.sequencia++; }
    else        { placar.derrotas++; placar.sequencia = 0; }

    r.resultado = {
      emoji: ganhou ? "🎉" : "💀",
      titulo: ganhou ? "Você acertou!" : "Você perdeu!",
      texto: ganhou ? "Sequência de " + placar.sequencia + " vitória(s)." : "Tente a próxima!"
    };
  } else {
    const a = adivinhador();
    const e = estado.escolhedor;
    // Quem adivinha ganha ponto se acertar; quem escolheu ganha se o outro for enforcado
    if (ganhou) placar.pontos[a]++; else placar.pontos[e]++;

    const proximo = estado.quemEscolhe === "alternar" ? a : e;
    r.resultado = {
      emoji: ganhou ? "🎉" : "😈",
      titulo: ganhou ? nome(a) + " acertou!" : nome(e) + " venceu a rodada!",
      texto: "+1 ponto para " + nome(ganhou ? a : e) + ". Próxima: " + nome(proximo) + " escolhe a palavra."
    };
  }
  return true;
}

// ---------- Zera o placar (ao clicar em Jogar no menu) ----------
function zerarPlacar() {
  estado.placar = { vitorias: 0, derrotas: 0, sequencia: 0, pontos: { 1: 0, 2: 0 } };
}

// ---------- Modo 2: define quem escolhe na próxima rodada ----------
function passarVez() {
  if (estado.quemEscolhe === "alternar") estado.escolhedor = adivinhador();
}
