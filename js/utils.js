// =====================================================
// utils.js
// Funções pequenas usadas em vários arquivos.
// =====================================================

// Atalho para pegar um elemento pelo id
const $ = id => document.getElementById(id);

// Tira o acento e deixa maiúscula. Ex: "ação" -> "ACAO", "ç" -> "C"
// NFD separa a letra do acento; o replace remove os acentos soltos.
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
}

// true se for uma única letra de A a Z
function ehLetra(caractere) {
  return /^[A-Z]$/.test(caractere);
}
