# 🪢 Jogo da Forca

Jogo da forca para navegador, feito com **HTML, CSS e JavaScript puro** (sem frameworks).
O progresso é salvo automaticamente com a **API Web Storage (`localStorage`)**: se a página for atualizada ou fechada, o jogo continua de onde parou.

## 👥 Dupla

- Igor Medeiros Barbosa
- Carlos Lohan dos Anjos Belém

**Professor:** Augusto Baía
**Data de entrega:** 20/11/2026

## ▶️ Como executar

1. Baixe o repositório (**Code → Download ZIP**) ou clone:
   ```bash
   git clone <link-do-repositório>
   ```
2. Abra o arquivo `index.html` no navegador (Chrome, Edge ou Firefox).

Não precisa instalar nada nem rodar servidor.

## 🎮 Funcionalidades

- **Modo 1 jogador:** o computador sorteia uma palavra do tema escolhido.
- **Modo 2 jogadores:** um jogador digita a palavra secreta (escondida, tipo senha) e o outro adivinha.
  - Dá pra escolher quem define a palavra: Jogador 1, Jogador 2 ou alternar a cada rodada.
  - Quem escolhe também define o tema e uma dica opcional.
  - Placar por jogador, com os nomes digitados.
- **10 temas:** Animais, Comidas, Frutas, Países, Filmes, Objetos, Utilitários, Profissões, Esportes e Cores (140 palavras).
- **Chutar a palavra inteira** a qualquer momento.
- **Progresso salvo:** atualizar a página (F5) não perde a rodada, as letras, o boneco nem o placar.
- Teclado na tela e teclado físico.
- Boneco animado com expressões (normal, com medo, enforcado e feliz).
- Layout responsivo (computador e celular).

## 📏 Regras

1. Cada tracinho representa uma letra da palavra secreta.
2. Chute uma letra por vez. Se ela existir, aparece em **todas** as posições.
3. Cada letra errada desenha uma parte do boneco. Com **6 erros**, ele é enforcado e você perde.
4. Acentos e Ç não importam: a letra **A** revela Á, Ã e Â; a letra **C** revela Ç.
5. Repetir uma letra não conta como erro.
6. Pode chutar a palavra inteira a qualquer momento. Se errar, conta como 1 erro.
7. **2 jogadores:** quem adivinha ganha 1 ponto se acertar. Se o boneco for enforcado, o ponto é de quem escolheu a palavra.

## 📁 Estrutura do projeto

```
jogo-da-forca/
├── index.html            # Estrutura das 3 telas (menu, palavra secreta e jogo)
├── css/
│   └── style.css         # Visual, animações e layout para celular
├── js/
│   ├── palavras.js       # Banco de palavras por tema
│   ├── utils.js          # Funções auxiliares (normalizar acentos, etc.)
│   ├── armazenamento.js  # Salvar/carregar no localStorage + validação dos dados
│   ├── estado.js         # Objeto "estado" com todos os dados do jogo
│   ├── regras.js         # Regras: chutar letra, chutar palavra, fim de jogo, placar
│   ├── interface.js      # Desenha o estado na tela (letras, teclado, boneco, placar)
│   └── main.js           # Eventos (cliques/teclado) e inicialização
└── README.md
```

### Como as partes conversam

```
 clique/tecla ──▶ main.js ──▶ regras.js (altera o estado)
                     │
                     ├──▶ interface.js (redesenha a tela a partir do estado)
                     │
                     └──▶ armazenamento.js (salva o estado no localStorage)

 abrir/atualizar a página ──▶ armazenamento.js carrega e valida ──▶ interface.js redesenha
```

- **`regras.js` não mexe no HTML**: só altera o objeto `estado` e devolve o que aconteceu (`"certa"`, `"errada"`, ...).
- **`interface.js` não decide regras**: só lê o `estado` e desenha.
- Assim, a mesma função que desenha uma jogada também reconstrói a tela depois de um F5.

## 💾 Salvamento (API Web Storage)

- Todo o jogo fica em um único objeto `estado` (tela atual, modo, nomes, placar e rodada).
- Depois de cada ação, o objeto é convertido em texto com `JSON.stringify` e gravado com `localStorage.setItem`.
- Ao abrir a página, `localStorage.getItem` + `JSON.parse` recuperam o estado.
- Os dados carregados são **validados** antes do uso: se estiverem corrompidos ou forem editados manualmente pelo DevTools, o jogo descarta e começa do zero em vez de quebrar.
- A palavra secreta digitada no modo 2 só é salva **depois** de confirmada.
- Se o navegador bloquear o armazenamento, o jogo continua funcionando normalmente, só sem salvar.
