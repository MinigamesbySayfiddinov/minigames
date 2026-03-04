let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const resultEl = document.getElementById('result');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');

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

  gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}

async function loadQuestions() {
  const res = await fetch('questions.json');
  questions = await res.json();
  showQuestion();
}

function showQuestion() {
  answered = false;
  resultEl.textContent = '';
  optionsEl.innerHTML = '';

  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  progressEl.textContent = `Вопрос ${currentIndex + 1} / ${questions.length}`;
  scoreEl.textContent = `Счёт: ${score}`;

  q.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<b>${String.fromCharCode(65 + index)}.</b> ${option}`;
    btn.addEventListener('click', () => handleAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const optionButtons = document.querySelectorAll('.option-btn');

  optionButtons.forEach((btn, index) => {
    btn.classList.add('disabled');
    btn.disabled = true;

    if (index === q.answer) {
      btn.classList.add('correct');
    }
    if (index === selectedIndex && index !== q.answer) {
      btn.classList.add('wrong');
    }
  });

  if (selectedIndex === q.answer) {
    score++;
    resultEl.textContent = 'Верно! ✅';
    playBeep(760, 160);
  } else {
    resultEl.textContent = 'Неверно! ❌';
    playBeep(280, 180);
  }

  scoreEl.textContent = `Счёт: ${score}`;
}

nextBtn.addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    finishQuiz();
  }
});

function finishQuiz() {
  questionEl.textContent = `Викторина окончена! Результат: ${score} из ${questions.length}`;
  optionsEl.innerHTML = '';
  resultEl.textContent = 'Можешь вернуться в главное меню.';
  progressEl.textContent = 'Конец викторины';
  nextBtn.style.display = 'none';
}

loadQuestions();
