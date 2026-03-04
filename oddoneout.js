let oddRounds = [];
let currentIndex = 0;
let answered = false;

const progressEl = document.getElementById('progress');
const optionsEl = document.getElementById('oddOptions');
const resultEl = document.getElementById('oddResult');
const explanationEl = document.getElementById('oddExplanation');
const showAnswerBtn = document.getElementById('showOddAnswerBtn');
const nextBtn = document.getElementById('nextOddBtn');

function playBeep(frequency = 600, duration = 140) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}

async function loadRounds() {
  const res = await fetch('oddoneout.json');
  oddRounds = await res.json();
  showRound();
}

function showRound() {
  answered = false;
  const current = oddRounds[currentIndex];
  progressEl.textContent = `Раунд ${currentIndex + 1} / ${oddRounds.length}`;
  resultEl.textContent = '';
  resultEl.className = 'result';
  explanationEl.textContent = '';
  optionsEl.innerHTML = '';

  current.items.forEach((item, index) => {
    const btn = document.createElement('button');
    btn.className = 'odd-btn';
    btn.textContent = item;
    btn.addEventListener('click', () => handleChoice(index));
    optionsEl.appendChild(btn);
  });

  showAnswerBtn.style.display = 'inline-block';
}

function lockButtons() {
  document.querySelectorAll('.odd-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });
}

function markButtons(selectedIndex = null) {
  const current = oddRounds[currentIndex];
  const buttons = document.querySelectorAll('.odd-btn');

  buttons.forEach((btn, index) => {
    if (index === current.answer) {
      btn.classList.add('correct');
    }
    if (selectedIndex !== null && index === selectedIndex && index !== current.answer) {
      btn.classList.add('wrong');
    }
  });
}

function handleChoice(index) {
  if (answered) return;
  answered = true;

  const current = oddRounds[currentIndex];
  const isCorrect = index === current.answer;

  lockButtons();
  markButtons(index);

  if (isCorrect) {
    resultEl.textContent = 'Верно! ✅';
    resultEl.classList.add('correct');
    playBeep(760, 160);
  } else {
    resultEl.textContent = 'Неверно! ❌';
    resultEl.classList.add('wrong');
    playBeep(280, 180);
  }

  explanationEl.textContent = current.explanation;
}

showAnswerBtn.addEventListener('click', () => {
  if (answered) return;
  answered = true;

  lockButtons();
  markButtons();
  resultEl.textContent = 'Ответ показан';
  explanationEl.textContent = oddRounds[currentIndex].explanation;
  playBeep(700, 150);
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < oddRounds.length - 1) {
    currentIndex++;
    playBeep(500, 110);
    showRound();
  } else {
    optionsEl.innerHTML = '';
    resultEl.textContent = 'Игра закончилась!';
    resultEl.className = 'result';
    explanationEl.textContent = 'Можешь вернуться в главное меню.';
    progressEl.textContent = 'Конец игры';
    showAnswerBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
});

loadRounds();
