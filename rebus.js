let rebuses = [];
let currentIndex = 0;

const progressEl = document.getElementById('progress');
const rebusTitleEl = document.getElementById('rebusTitle');
const answerBoxEl = document.getElementById('answerBox');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const nextRebusBtn = document.getElementById('nextRebusBtn');

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

async function loadRebuses() {
  const res = await fetch('rebuses.json');
  rebuses = await res.json();
  showRebus();
}

function showRebus() {
  const current = rebuses[currentIndex];
  progressEl.textContent = `Ребус ${currentIndex + 1} / ${rebuses.length}`;
  rebusTitleEl.textContent = current.rebus;
  answerBoxEl.textContent = current.answer;
  answerBoxEl.classList.add('hidden');
  showAnswerBtn.style.display = 'inline-block';
}

showAnswerBtn.addEventListener('click', () => {
  answerBoxEl.classList.remove('hidden');
  playBeep(720, 150);
});

nextRebusBtn.addEventListener('click', () => {
  if (currentIndex < rebuses.length - 1) {
    currentIndex++;
    playBeep(500, 110);
    showRebus();
  } else {
    rebusTitleEl.textContent = 'Ребусы закончились!';
    answerBoxEl.classList.add('hidden');
    showAnswerBtn.style.display = 'none';
    nextRebusBtn.style.display = 'none';
    progressEl.textContent = 'Конец игры';
  }
});

loadRebuses();
