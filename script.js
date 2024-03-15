const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timerElement = document.querySelector('.timer');

const characters = ['nami', 'luffy', 'brook', 'franky', 'chopper', 'zoro', 'usopp', 'sanji', 'jinbe', 'robin'];

let firstCard = null;
let secondCard = null;
let timer = 0;
let timerInterval = null;

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
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {
  timerInterval = setInterval(() => {
    timer++;
    updateTimerDisplay();
  }, 1000);
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
  if (disabledCards.length === 20) {
    stopTimer();
    alert(`Parabéns, ${spanPlayer.textContent}! Seu tempo foi de: ${timerElement.textContent}`);
  }
}

window.onload = () => {
  startTimer();
  loadGame();
}

