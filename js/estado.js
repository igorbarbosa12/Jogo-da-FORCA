// =====================================================
// estado.js
// TODO o estado do jogo fica neste único objeto.
// Isso facilita salvar no localStorage: é só salvar o objeto inteiro.
// =====================================================

const MAX_ERROS = 6;        // 6 partes do boneco
const VERSAO_ESTADO = 1;    // se a estrutura mudar no futuro, dados antigos são descartados

function criarEstadoInicial() {
  return {
    versao: VERSAO_ESTADO,
    tela: "telaMenu",         // "telaMenu" | "telaSegredo" | "telaJogo"

    // Configurações do menu
    modo: 1,                  // 1 = um jogador | 2 = dois jogadores
    temaMenu: "todos",        // tema do modo 1
    quemEscolhe: "1",         // modo 2: "1", "2" ou "alternar"
    escolhedor: 1,            // modo 2: quem escolhe a palavra NESTA rodada
    nomes: { 1: "", 2: "" },

    placar: {
      vitorias: 0, derrotas: 0, sequencia: 0,   // modo 1
      pontos: { 1: 0, 2: 0 }                    // modo 2
    },

    ultimaPalavra: "",        // evita sortear a mesma palavra duas vezes seguidas

    // Rodada atual (null quando não tem jogo acontecendo)
    rodada: null
    /* Formato da rodada:
       {
         palavra: "MAÇÃ",          // como aparece na tela
         tema: "🍎 Frutas",
         dica: "",
         letrasCertas: ["A"],
         letrasErradas: ["Z"],
         chutesErrados: ["PERA"],  // palavras inteiras chutadas erradas
         acabou: false,
         resultado: null           // { emoji, titulo, texto } quando acaba
       } */
  };
}

let estado = criarEstadoInicial();

// Salva o estado atual no navegador (ver armazenamento.js)
function salvar() {
  salvarEstado(estado);
}

// Nome digitado do jogador, ou "Jogador 1" / "Jogador 2" se ficou vazio
function nome(n) {
  return estado.nomes[n].trim() || "Jogador " + n;
}

// No modo 2, quem adivinha é sempre o outro jogador
function adivinhador() {
  return estado.escolhedor === 1 ? 2 : 1;
}

// Letras da palavra como aparecem. Ex: ["M","A","Ç","Ã"]
function letrasOriginais() {
  return [...estado.rodada.palavra];
}

// Letras sem acento, usadas para comparar. Ex: ["M","A","C","A"]
function letrasBase() {
  return letrasOriginais().map(normalizar);
}

// Total de erros = letras erradas + chutes de palavra errados
function totalErros() {
  const r = estado.rodada;
  return r ? r.letrasErradas.length + r.chutesErrados.length : 0;
}
