let balanceCases = [];
let currentIndex = 0;
let answered = false;

const progressEl = document.getElementById('progress');
const situationEl = document.getElementById('balanceSituation');
const resultEl = document.getElementById('balanceResult');
const riskBtn = document.getElementById('riskBtn');
const safeBtn = document.getElementById('safeBtn');
const showAnswerBtn = document.getElementById('showBalanceAnswerBtn');
const nextBtn = document.getElementById('nextBalanceBtn');

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

async function loadCases() {
  const res = await fetch('balance.json');
  balanceCases = await res.json();
  showCase();
}

function resetButtons() {
  [riskBtn, safeBtn].forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong', 'disabled');
  });
}

function showCase() {
  const current = balanceCases[currentIndex];
  answered = false;
  progressEl.textContent = `Ситуация ${currentIndex + 1} / ${balanceCases.length}`;
  situationEl.textContent = current.situation;
  resultEl.textContent = '';
  resultEl.className = 'result';
  resetButtons();
  showAnswerBtn.style.display = 'inline-block';
}

function handleChoice(choice) {
  if (answered) return;
  answered = true;

  const correct = balanceCases[currentIndex].answer;
  const isCorrect = choice === correct;

  if (correct === 'Рискованно') {
    riskBtn.classList.add('correct');
    safeBtn.classList.add(isCorrect ? '' : 'wrong');
  } else {
    safeBtn.classList.add('correct');
    riskBtn.classList.add(isCorrect ? '' : 'wrong');
  }

  [riskBtn, safeBtn].forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });

  if (isCorrect) {
    resultEl.textContent = 'Верно! ✅';
    resultEl.classList.add('correct');
    playBeep(760, 160);
  } else {
    resultEl.textContent = `Неверно! Правильный ответ: ${correct}`;
    resultEl.classList.add('wrong');
    playBeep(280, 180);
  }
}

riskBtn.addEventListener('click', () => handleChoice('Рискованно'));
safeBtn.addEventListener('click', () => handleChoice('Безопасно'));

showAnswerBtn.addEventListener('click', () => {
  if (answered) return;

  const correct = balanceCases[currentIndex].answer;
  if (correct === 'Рискованно') {
    riskBtn.classList.add('correct');
  } else {
    safeBtn.classList.add('correct');
  }

  [riskBtn, safeBtn].forEach(btn => {
    btn.disabled = true;
    btn.classList.add('disabled');
  });

  resultEl.textContent = `Ответ: ${correct}`;
  playBeep(700, 150);
  answered = true;
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < balanceCases.length - 1) {
    currentIndex++;
    playBeep(500, 110);
    showCase();
  } else {
    situationEl.textContent = 'Ситуации закончились!';
    resultEl.textContent = 'Можешь вернуться в главное меню.';
    resultEl.className = 'result';
    progressEl.textContent = 'Конец игры';
    riskBtn.style.display = 'none';
    safeBtn.style.display = 'none';
    showAnswerBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
});

loadCases();
