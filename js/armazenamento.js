// =====================================================
// armazenamento.js
// Salva e carrega o progresso usando a API Web Storage (localStorage).
// Assim, se a página for atualizada (F5) ou fechada, o jogo volta
// exatamente de onde parou: mesma tela, mesma palavra, mesmas letras.
//
// O localStorage só guarda texto, então o estado é convertido
// para JSON (JSON.stringify) ao salvar e de volta (JSON.parse) ao carregar.
// =====================================================

const CHAVE_STORAGE = "jogo-da-forca:estado";

function salvarEstado(dados) {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
  } catch (erro) {
    // Navegador bloqueou o armazenamento (ex: modo anônimo com storage desativado).
    // O jogo continua funcionando, só não salva o progresso.
  }
}

// Retorna o estado salvo, ou null se não existir ou estiver inválido
function carregarEstado() {
  try {
    const texto = localStorage.getItem(CHAVE_STORAGE);
    if (!texto) return null;
    const dados = JSON.parse(texto);
    return estadoEhValido(dados) ? dados : null;
  } catch (erro) {
    return null;   // JSON corrompido: ignora e começa do zero
  }
}

function apagarEstado() {
  try {
    localStorage.removeItem(CHAVE_STORAGE);
  } catch (erro) { /* nada a fazer */ }
}

// -----------------------------------------------------
// Validação: qualquer pessoa pode editar o localStorage pelo
// DevTools (F12). Antes de usar os dados, conferimos tudo.
// Se algo estiver errado, o jogo ignora e começa do zero
// em vez de quebrar.
// -----------------------------------------------------
function estadoEhValido(d) {
  const ehContagem = n => Number.isInteger(n) && n >= 0;
  const ehListaDeLetras = lista =>
    Array.isArray(lista) && lista.every(x => typeof x === "string" && /^[A-Z]+$/.test(x));

  if (!d || typeof d !== "object" || d.versao !== VERSAO_ESTADO) return false;
  if (!["telaMenu", "telaSegredo", "telaJogo"].includes(d.tela)) return false;
  if (d.modo !== 1 && d.modo !== 2) return false;
  if (d.temaMenu !== "todos" && !TEMAS[d.temaMenu]) return false;
  if (!["1", "2", "alternar"].includes(d.quemEscolhe)) return false;
  if (d.escolhedor !== 1 && d.escolhedor !== 2) return false;
  if (!d.nomes || typeof d.nomes[1] !== "string" || typeof d.nomes[2] !== "string") return false;
  if (d.nomes[1].length > 15 || d.nomes[2].length > 15) return false;
  if (typeof d.ultimaPalavra !== "string") return false;

  const p = d.placar;
  if (!p || ![p.vitorias, p.derrotas, p.sequencia].every(ehContagem)) return false;
  if (!p.pontos || !ehContagem(p.pontos[1]) || !ehContagem(p.pontos[2])) return false;

  // Na tela do jogo precisa existir uma rodada válida
  if (d.tela === "telaJogo") {
    const r = d.rodada;
    if (!r || typeof r !== "object") return false;
    if (typeof r.palavra !== "string" || validarPalavraSecreta(r.palavra).erro) return false;
    if (typeof r.tema !== "string" || typeof r.dica !== "string") return false;
    if (typeof r.acabou !== "boolean") return false;
    if (!ehListaDeLetras(r.letrasCertas) || !ehListaDeLetras(r.letrasErradas) ||
        !ehListaDeLetras(r.chutesErrados)) return false;
    if (r.letrasErradas.length + r.chutesErrados.length > MAX_ERROS) return false;
    if (r.acabou) {
      const res = r.resultado;
      if (!res || !["emoji", "titulo", "texto"].every(k => typeof res[k] === "string")) return false;
    }
  }
  return true;
}
