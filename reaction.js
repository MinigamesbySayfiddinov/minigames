let reactionQuestions = [];
let currentIndex = 0;

const progressEl = document.getElementById('progress');
const questionEl = document.getElementById('reactionQuestion');
const answerBoxEl = document.getElementById('reactionAnswerBox');
const showAnswerBtn = document.getElementById('showReactionAnswerBtn');
const nextBtn = document.getElementById('nextReactionBtn');

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

async function loadReactionQuestions() {
  const res = await fetch('reaction.json');
  reactionQuestions = await res.json();
  showQuestion();
}

function showQuestion() {
  const current = reactionQuestions[currentIndex];
  progressEl.textContent = `Вопрос ${currentIndex + 1} / ${reactionQuestions.length}`;
  questionEl.textContent = current.question;
  answerBoxEl.textContent = current.answer;
  answerBoxEl.classList.add('hidden');
  showAnswerBtn.style.display = 'inline-block';
}

showAnswerBtn.addEventListener('click', () => {
  answerBoxEl.classList.remove('hidden');
  playBeep(720, 150);
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < reactionQuestions.length - 1) {
    currentIndex++;
    playBeep(500, 110);
    showQuestion();
  } else {
    questionEl.textContent = 'Вопросы закончились!';
    answerBoxEl.classList.add('hidden');
    showAnswerBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    progressEl.textContent = 'Конец игры';
  }
});

loadReactionQuestions();
