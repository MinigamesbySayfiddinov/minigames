let terms = [];
let currentIndex = 0;

const progressEl = document.getElementById('progress');
const definitionTextEl = document.getElementById('definitionText');
const answerBoxEl = document.getElementById('termAnswerBox');
const showTermBtn = document.getElementById('showTermBtn');
const nextTermBtn = document.getElementById('nextTermBtn');

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

async function loadTerms() {
  const res = await fetch('terms.json');
  terms = await res.json();
  showTerm();
}

function showTerm() {
  const current = terms[currentIndex];
  progressEl.textContent = `Термин ${currentIndex + 1} / ${terms.length}`;
  definitionTextEl.textContent = current.definition;
  answerBoxEl.textContent = current.term;
  answerBoxEl.classList.add('hidden');
  showTermBtn.style.display = 'inline-block';
}

showTermBtn.addEventListener('click', () => {
  answerBoxEl.classList.remove('hidden');
  playBeep(730, 150);
});

nextTermBtn.addEventListener('click', () => {
  if (currentIndex < terms.length - 1) {
    currentIndex++;
    playBeep(500, 110);
    showTerm();
  } else {
    definitionTextEl.textContent = 'Термины закончились!';
    answerBoxEl.classList.add('hidden');
    showTermBtn.style.display = 'none';
    nextTermBtn.style.display = 'none';
    progressEl.textContent = 'Конец игры';
  }
});

loadTerms();
