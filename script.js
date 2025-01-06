let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// Fetch questions from the external API
async function fetchQuestions() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await response.json();
        questions = data.results;
        displayQuestion();
    } catch (error) {
        console.log("Error fetching questions", error);
    }
}

// Display the current question and its choices
function displayQuestion() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const resultElement = document.getElementById("result");
    const backButton = document.getElementById("back-btn");
    const nextButton = document.getElementById("next-btn");

    // Display question text
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    choicesElement.innerHTML = "";
    resultElement.textContent = "";

    // Combine and shuffle choices
    const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allChoices.sort(() => Math.random() - 0.5);

    // Create choice buttons
    allChoices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = choice;
        choiceButton.classList.add("choice-btn");
        choiceButton.onclick = () => checkAnswer(choice);
        choicesElement.appendChild(choiceButton);
    });

    // Update navigation buttons
    backButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

// Check the selected answer
function checkAnswer(choice) {
    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    const currentQuestion = questions[currentQuestionIndex];

    if (choice === currentQuestion.correct_answer) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";

        // Increment score if the answer is correct
        score++;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        resultElement.textContent = "Incorrect!";
        resultElement.style.color = "red";
    }
}

// Move to the next question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Move to the previous question
function backQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// Restart the quiz
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById("score").textContent = "Score: 0";
    fetchQuestions();
}

// Add event listeners for navigation and restart buttons
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("back-btn").addEventListener("click", backQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Fetch and display questions on page load
fetchQuestions();
