const startButton = document.getElementById('start-btn');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const startContainer = document.getElementById('welcome-container');
const categorySelect = document.getElementById('category-select');
const quizContainer = document.getElementById('quiz');
const progressBar = document.getElementById('progress');
const timerElement = document.getElementById('time');

let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timer;
let timeLeft = 15;

const questions = {
  general: [
    {
      question: "What is the capital of India?",
      answers: [
        { text: "Delhi", correct: true },
        { text: "Mumbai", correct: false },
        { text: "Chennai", correct: false },
        { text: "Kolkata", correct: false }
      ]
    },
    {
      question: "Who developed the theory of relativity?",
      answers: [
        { text: "Isaac Newton", correct: false },
        { text: "Albert Einstein", correct: true },
        { text: "Galileo Galilei", correct: false },
        { text: "Nikola Tesla", correct: false }
      ]
    }
  ],
  science: [
    {
      question: "What planet is known as the Red Planet?",
      answers: [
        { text: "Mars", correct: true },
        { text: "Venus", correct: false },
        { text: "Jupiter", correct: false },
        { text: "Saturn", correct: false }
      ]
    },
    {
      question: "Water boils at what temperature (Celsius)?",
      answers: [
        { text: "100°C", correct: true },
        { text: "90°C", correct: false },
        { text: "110°C", correct: false },
        { text: "80°C", correct: false }
      ]
    }
  ],
  indian_history: [
    {
      question: "Who was the first Prime Minister of independent India?",
      answers: [
        { text: "Jawaharlal Nehru", correct: true },
        { text: "Mahatma Gandhi", correct: false },
        { text: "Sardar Patel", correct: false },
        { text: "Lal Bahadur Shastri", correct: false }
      ]
    },
    {
      question: "In which year did India gain independence from British rule?",
      answers: [
        { text: "1947", correct: true },
        { text: "1950", correct: false },
        { text: "1935", correct: false },
        { text: "1942", correct: false }
      ]
    },
    {
      question: "What was the main objective of the Non-Cooperation Movement led by Mahatma Gandhi?",
      answers: [
        { text: "To resist British rule through non-violent means", correct: true },
        { text: "To start a violent uprising", correct: false },
        { text: "To promote industrial development", correct: false },
        { text: "To form a new political party", correct: false }
      ]
    },
    {
      question: "Which ancient Indian university was famous for education and attracted students from all over Asia?",
      answers: [
        { text: "Nalanda University", correct: true },
        { text: "Takshashila University", correct: false },
        { text: "Vikramshila University", correct: false },
        { text: "Banaras Hindu University", correct: false }
      ]
    },
    {
      question: "Who was the last Governor-General of independent India?",
      answers: [
        { text: "C. Rajagopalachari", correct: true },
        { text: "Lord Mountbatten", correct: false },
        { text: "Rajendra Prasad", correct: false },
        { text: "Jawaharlal Nehru", correct: false }
      ]
    },
    {
      question: "Which movement is associated with the slogan ‘Do or Die’?",
      answers: [
        { text: "Quit India Movement", correct: true },
        { text: "Civil Disobedience Movement", correct: false },
        { text: "Swadeshi Movement", correct: false },
        { text: "Non-Cooperation Movement", correct: false }
      ]
    },
    {
      question: "The Indian Constitution came into effect on which date?",
      answers: [
        { text: "26 January 1950", correct: true },
        { text: "15 August 1947", correct: false },
        { text: "26 November 1949", correct: false },
        { text: "2 October 1950", correct: false }
      ]
    },
    {
      question: "Who was known as the 'Iron Man of India'?",
      answers: [
        { text: "Sardar Vallabhbhai Patel", correct: true },
        { text: "Mahatma Gandhi", correct: false },
        { text: "Bhagat Singh", correct: false },
        { text: "Subhas Chandra Bose", correct: false }
      ]
    },
    {
      question: "The Jallianwala Bagh massacre took place in which city?",
      answers: [
        { text: "Amritsar", correct: true },
        { text: "Lahore", correct: false },
        { text: "Delhi", correct: false },
        { text: "Chennai", correct: false }
      ]
    },
    {
      question: "Who was the founder of the Mughal Empire in India?",
      answers: [
        { text: "Babur", correct: true },
        { text: "Akbar", correct: false },
        { text: "Aurangzeb", correct: false },
        { text: "Shah Jahan", correct: false }
      ]
    }
  ]
};

startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

window.addEventListener('load', () => {
  showWelcomeMessage();
});

function showWelcomeMessage() {
  const welcomeMsg = document.getElementById('welcome-msg');
  welcomeMsg.innerText = `Welcome! Today is ${moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}`;
}

function startQuiz() {
  startContainer.classList.add('hide');
  resultContainer.classList.add('hide');
  quizContainer.classList.remove('hide');
  
  const category = categorySelect.value;
  shuffledQuestions = questions[category].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;

  updateProgressBar();
  setNextQuestion();
}

function restartQuiz() {
  startContainer.classList.remove('hide');
  resultContainer.classList.add('hide');
  quizContainer.classList.add('hide');
}

function setNextQuestion() {
  resetState();
  startTimer();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
  updateProgressBar();
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  clearInterval(timer);
  timeLeft = 15;
  timerElement.innerText = timeLeft;
}

function selectAnswer(e) {
  clearInterval(timer);
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";

  if (correct) {
    score++;
  }

  Array.from(answerButtons.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true;
  });

  setTimeout(() => {
    nextOrFinish();
  }, 1500);
}

function nextOrFinish() {
  if (currentQuestionIndex < shuffledQuestions.length - 1) {
    currentQuestionIndex++;
    setNextQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.classList.add('hide');
  resultContainer.classList.remove('hide');
  scoreElement.innerText = `${score} / ${shuffledQuestions.length}`;
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
  element.disabled = false;
}

function updateProgressBar() {
  const progressPercent = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

// Timer Functions
function startTimer() {
  timerElement.innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      disableAnswers();
      setTimeout(() => {
        nextOrFinish();
      }, 1500);
    }
  }, 1000);
}

function disableAnswers() {
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
    // Show correct answer if time runs out
    if (button.dataset.correct === "true") {
      setStatusClass(button, true);
    } else {
      setStatusClass(button, false);
    }
  });
}
