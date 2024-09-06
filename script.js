const questionElement = document.querySelector('.question');
const option1 = document.querySelector('#option1');
const option2 = document.querySelector('#option2');
const option3 = document.querySelector('#option3');
const option4 = document.querySelector('#option4');
const submitButton = document.querySelector('#submit');
const answers = document.querySelectorAll('.answer');
const showScore = document.querySelector('#showScore');
const timerDisplay = document.querySelector('#timer');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timer;
let timeLeft = 15; // 15 seconds for each question

// Fetch questions from the API
const fetchQuestions = async () => {
    try {
        const res = await fetch('https://opentdb.com/api.php?amount=50&category=18&difficulty=medium');
        const data = await res.json();
        questions = data.results.map((questionData) => {
            const correctAnswer = questionData.correct_answer;
            const incorrectAnswers = questionData.incorrect_answers;
            const allAnswers = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);
            return {
                question: questionData.question,
                answers: allAnswers,
                correctAnswer: correctAnswer
            };
        });
        loadQuestion();
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
    }
};

// Load a question from the API
const loadQuestion = () => {
    clearInterval(timer);
    timeLeft = 15;
    startTimer();

    const questionData = questions[currentQuestionIndex];
    questionElement.innerHTML = questionData.question;
    option1.innerHTML = questionData.answers[0];
    option2.innerHTML = questionData.answers[1];
    option3.innerHTML = questionData.answers[2];
    option4.innerHTML = questionData.answers[3];
};

// Start the countdown timer
const startTimer = () => {
    timerDisplay.innerText = `Time left: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            moveToNextQuestion(); // Move to the next question if time runs out
        }
    }, 1000);
};

// Get the selected answer
const getCheckedAnswer = () => {
    let answer;
    answers.forEach((curAnsElem) => {
        if (curAnsElem.checked) {
            answer = curAnsElem.nextElementSibling.innerText;
        }
    });
    return answer;
};

// Deselect all the answers
const deselectAll = () => {
    answers.forEach((curAnsElem) => (curAnsElem.checked = false));
};

// Move to the next question
const moveToNextQuestion = () => {
    const checkedAnswer = getCheckedAnswer();
    if (checkedAnswer === questions[currentQuestionIndex].correctAnswer) {
        score++;
    }
    currentQuestionIndex++;
    deselectAll();
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showScore.innerHTML = `
            <h3>You scored ${score}/${questions.length}</h3>
            <button class="btn" onclick="location.reload()">Play Again</button>
        `;
        showScore.classList.remove('scoreArea');
    }
};

// Event listener for submit button
submitButton.addEventListener('click', () => {
    clearInterval(timer); // Stop the timer when the user submits an answer
    moveToNextQuestion();
});

// Fetch questions when the app loads
fetchQuestions();
