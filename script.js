const grid = document.querySelector('.grid');
const timerElement = document.querySelector('.timer');
const victoryModal = document.getElementById('vitoria-modal');

const characters = ['nami', 'luffy', 'brook', 'franky', 'chopper', 'zoro', 'usopp', 'sanji', 'jinbe', 'robin'];

let firstCard = null;
let secondCard = null;
let timer = 0;
let timerInterval = null;
let difficulty = ''; // Variável para armazenar a dificuldade selecionada

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.setAttribute('data-character', character)
  card.addEventListener('click', revealCard);

  return card;
}

const loadGame = () => {
  grid.innerHTML = ''; // Limpa o conteúdo anterior

  const numberOfCards = getNumberOfCards();

  const duplicateCharacters = characters.slice(0, numberOfCards / 2);
  const shuffledArray = [...duplicateCharacters, ...duplicateCharacters].sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {
  const interval = 1000; // Intervalo de 1 segundo

  // Sempre usa o intervalo de 1 segundo, independentemente da dificuldade selecionada
  timerInterval = setInterval(() => {
    timer++; // Incrementa o temporizador em 1 segundo
    updateTimerDisplay(); // Atualiza a exibição do temporizador
  }, interval);
}

const getAdjustedInterval = () => {
  return 0; // Retorna sempre 1000 milissegundos (1 segundo)
}
const updateTimerDisplay = () => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerElement.textContent = `${padTime(minutes)}:${padTime(seconds)}`;
}
const padTime = (value) => {
  return value < 10 ? `0${value}` : value;
}

const stopTimer = () => {
  clearInterval(timerInterval);
}

const revealCard = (event) => {
  const clickedCard = event.currentTarget;

  // Verifica se a carta já está virada, desabilitada ou se já foram viradas duas cartas
  if (clickedCard.classList.contains('reveal-card') || clickedCard.querySelector('.front').classList.contains('disabled-card') || firstCard !== null && secondCard !== null) {
    return;
  }

  // Adiciona a classe 'reveal-card' para virar a carta
  clickedCard.classList.add('reveal-card');

  // Verifica se é a primeira ou a segunda carta virada
  if (firstCard === null) {
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    checkCards();
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    // Cartas iguais
    firstCard.querySelector('.front').classList.add('disabled-card');
    secondCard.querySelector('.front').classList.add('disabled-card');
    firstCard = null;
    secondCard = null;
    checkEndGame();
  } else {
    // Cartas diferentes, aguarda 500ms e então esconde as cartas novamente
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');
      firstCard = null;
      secondCard = null;
    }, 500);
  }
}

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  const numberOfCards = getNumberOfCards();
  
  if (disabledCards.length === numberOfCards) {
    stopTimer();
    showVictoryMessage();
  }
}

const showVictoryMessage = () => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const timeString = `${padTime(minutes)}:${padTime(seconds)}`;
  document.querySelector('.time-victory').textContent = timeString;
  victoryModal.style.display = 'block';
}

const resetGame = () => {
  // Esconde a mensagem de vitória
  victoryModal.style.display = 'none';
  // Limpa o tabuleiro
  grid.innerHTML = '';
  // Reinicia o temporizador
  timer = 0;
  updateTimerDisplay();
  // Carrega um novo jogo
  loadGame();
  // Inicia o temporizador novamente
  startTimer();
}

const getNumberOfCardsPerRow = () => {
  switch (difficulty) {
    case 'facil':
      return 4;
    case 'medio':
      return 7;
    case 'dificil':
      return 8;
    default:
      return 8; // Padrão para o caso de uma seleção inválida
  }
}

const getNumberOfCards = () => {
  switch (difficulty) {
    case 'facil':
      return 8;
    case 'medio':
      return 14;
    case 'dificil':
      return 20;
    default:
      return 20; // Padrão para o caso de uma seleção inválida
  }
}

window.onload = () => {
  document.getElementById('iniciarJogo').addEventListener('click', function() {
    // Esconde o elemento de seleção de dificuldade
    document.getElementById('dificuldade').style.display = 'none';

    // Obtém a dificuldade selecionada
    difficulty = document.getElementById('nivel').value;

    // Reinicia o temporizador
    timer = 0;

    // Atualiza a exibição do temporizador
    updateTimerDisplay();

    // Carrega o jogo com base na dificuldade selecionada
    loadGame();

    // Inicia o temporizador
    startTimer();
  });

  // Adiciona evento de clique no botão de fechar (X) na mensagem de vitória
  document.querySelector('.close').addEventListener('click', function() {
    resetGame();
  });
}
