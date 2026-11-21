// =====================================================
// palavras.js
// Banco de palavras do modo 1 jogador, separado por tema.
// As palavras podem ter acento, espaço e hífen: o jogo trata sozinho.
// Para adicionar uma palavra, é só colocar na lista do tema.
// =====================================================

const TEMAS = {
  animais: {
    nome: "Animais", icone: "🐾",
    palavras: ["CACHORRO", "GATO", "ELEFANTE", "GIRAFA", "JACARÉ", "TARTARUGA", "PAPAGAIO",
               "BOTO", "ONÇA", "PREGUIÇA", "TUBARÃO", "CAMALEÃO", "PINGUIM", "CAPIVARA"]
  },
  comidas: {
    nome: "Comidas", icone: "🍔",
    palavras: ["LASANHA", "FEIJOADA", "TACACÁ", "PIZZA", "HAMBÚRGUER", "BRIGADEIRO", "COXINHA",
               "PASTEL", "MANIÇOBA", "MACARRÃO", "CHURRASCO", "PÃO DE QUEIJO", "TAPIOCA", "ESTROGONOFE"]
  },
  frutas: {
    nome: "Frutas", icone: "🍎",
    palavras: ["MAÇÃ", "BANANA", "ABACAXI", "MELANCIA", "AÇAÍ", "CUPUAÇU", "MARACUJÁ",
               "GOIABA", "LIMÃO", "MAMÃO", "MORANGO", "BACURI", "JABUTICABA", "TUCUMÃ"]
  },
  paises: {
    nome: "Países", icone: "🌎",
    palavras: ["BRASIL", "ARGENTINA", "JAPÃO", "ALEMANHA", "CANADÁ", "MÉXICO", "PORTUGAL",
               "ITÁLIA", "AUSTRÁLIA", "EGITO", "CHINA", "ESTADOS UNIDOS", "COLÔMBIA", "ÁFRICA DO SUL"]
  },
  filmes: {
    nome: "Filmes", icone: "🎬",
    palavras: ["TITANIC", "AVATAR", "CORINGA", "MATRIX", "GLADIADOR", "INTERESTELAR", "O REI LEÃO",
               "TROPA DE ELITE", "CIDADE DE DEUS", "DIVERTIDA MENTE", "PROCURANDO NEMO",
               "DE VOLTA PARA O FUTURO", "O AUTO DA COMPADECIDA", "HOMEM-ARANHA"]
  },
  objetos: {
    nome: "Objetos", icone: "📦",
    palavras: ["CADEIRA", "RELÓGIO", "ESPELHO", "GUARDA-CHUVA", "TRAVESSEIRO", "CANETA", "MOCHILA",
               "ÓCULOS", "CELULAR", "LÁPIS", "GARRAFA", "CHAVEIRO", "TELEVISÃO", "CARTEIRA"]
  },
  utilitarios: {
    nome: "Utilitários", icone: "🛠️",
    palavras: ["VASSOURA", "BALDE", "MARTELO", "CHAVE DE FENDA", "TESOURA", "LANTERNA", "ALICATE",
               "ESCADA", "PANELA", "FERRO DE PASSAR", "LIQUIDIFICADOR", "GELADEIRA", "ABRIDOR DE LATA", "RODO"]
  },
  profissoes: {
    nome: "Profissões", icone: "👷",
    palavras: ["MÉDICO", "PROFESSOR", "ENGENHEIRO", "PROGRAMADOR", "BOMBEIRO", "ENFERMEIRA", "ADVOGADO",
               "PEDREIRO", "MOTORISTA", "COZINHEIRO", "DENTISTA", "JORNALISTA", "ELETRICISTA", "VETERINÁRIO"]
  },
  esportes: {
    nome: "Esportes", icone: "⚽",
    palavras: ["FUTEBOL", "VÔLEI", "BASQUETE", "NATAÇÃO", "TÊNIS", "JUDÔ", "SKATE",
               "SURFE", "CICLISMO", "BOXE", "HANDEBOL", "XADREZ", "ATLETISMO", "CAPOEIRA"]
  },
  cores: {
    nome: "Cores", icone: "🎨",
    palavras: ["AMARELO", "VERMELHO", "AZUL", "VERDE", "ROXO", "LARANJA", "ROSA",
               "MARROM", "CINZA", "BRANCO", "PRETO", "VIOLETA", "BEGE", "DOURADO"]
  }
};

// Lista no formato usado pelos botões de tema: [{ id, nome, icone }, ...]
const LISTA_TEMAS = Object.keys(TEMAS).map(id => ({
  id: id,
  nome: TEMAS[id].nome,
  icone: TEMAS[id].icone
}));
