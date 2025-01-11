// Initialize variables
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
let userScores = [];
let isWaiting = false;

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await response.json();
        questions = data.results;
        // Initialize arrays to store user answers and scores
        userAnswers = new Array(questions.length).fill(null);
        userScores = new Array(questions.length).fill(0);
        displayQuestion();
    } catch (error) {
        console.log("Error fetching questions", error);
    }
}

// Display the current question and its choices
function displayQuestion() {
    // Get DOM elements
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const resultElement = document.getElementById("result");
    const gifElement = document.getElementById("feedback-gif");
    const questionCounterElement = document.getElementById("question-counter");
    const backButton = document.getElementById("back-btn");
    const nextButton = document.getElementById("next-btn");

    // Clear previous result and GIF
    resultElement.textContent = "";
    gifElement.innerHTML = "";

    // Get current question
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    choicesElement.innerHTML = "";

    // Update question counter
    questionCounterElement.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;

    // Combine and shuffle choices
    const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allChoices.sort(() => Math.random() - 0.5);

    // Create choice buttons
    allChoices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = choice;
        choiceButton.classList.add("choice-btn");
        
        // If question hasn't been answered, enable button; otherwise, show previous state
        if (userAnswers[currentQuestionIndex] === null) {
            choiceButton.onclick = () => checkAnswer(choice);
        } else {
            choiceButton.disabled = true;
            if (choice === currentQuestion.correct_answer) {
                choiceButton.style.backgroundColor = "green";
                choiceButton.style.color = "white";
            } else if (choice === userAnswers[currentQuestionIndex]) {
                choiceButton.style.backgroundColor = "red";
                choiceButton.style.color = "white";
            }
        }
        
        choicesElement.appendChild(choiceButton);
    });

    // Update navigation buttons
    backButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;

    // Show waiting GIF if question hasn't been answered, otherwise show result
    if (userAnswers[currentQuestionIndex] === null) {
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/mRh4cLIYhrs9G/giphy.gif" alt="Finals Week GIF">`;
        isWaiting = true;
    } else {
        showResult();
    }
}

// Check the selected answer
function checkAnswer(choice) {
    if (!isWaiting) return;

    const currentQuestion = questions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = choice;

    // Update score if answer is correct
    if (choice === currentQuestion.correct_answer) {
        userScores[currentQuestionIndex] = 1;
    }

    showResult();
}

// Show the result of the current question
function showResult() {
    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    const gifElement = document.getElementById("feedback-gif");
    const currentQuestion = questions[currentQuestionIndex];
    const userChoice = userAnswers[currentQuestionIndex];

    isWaiting = false;

    // Highlight correct and user's answers
    const choiceButtons = document.querySelectorAll(".choice-btn");
    choiceButtons.forEach(button => {
        button.disabled = true;
        if (button.textContent === currentQuestion.correct_answer) {
            button.style.backgroundColor = "green";
            button.style.color = "white";
        }
        if (button.textContent === userChoice && userChoice !== currentQuestion.correct_answer) {
            button.style.backgroundColor = "red";
            button.style.color = "white";
        }
    });

    // Show result message and GIF
    if (userChoice === currentQuestion.correct_answer) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" alt="Happy GIF">`;
    } else {
        resultElement.textContent = "Incorrect!";
        resultElement.style.color = "red";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" alt="Sad GIF">`;
    }

    // Update total score
    const totalScore = userScores.reduce((sum, score) => sum + score, 0);
    scoreElement.textContent = `Score: ${totalScore}`;

    // Check if it's the last question
    if (currentQuestionIndex === questions.length - 1) {
        showFinalResult();
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
    currentQuestionIndex = 0;
    userAnswers = new Array(questions.length).fill(null);
    userScores = new Array(questions.length).fill(0);
    document.getElementById("score").textContent = "Score: 0";
    displayQuestion();
}

// Show the final result of the quiz
function showFinalResult() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const resultElement = document.getElementById("result");
    const gifElement = document.getElementById("feedback-gif");
    const scoreElement = document.getElementById("score");

    // Clear question and choices
    questionElement.innerHTML = "";
    choicesElement.innerHTML = "";
    
    // Calculate total score
    const totalScore = userScores.reduce((sum, score) => sum + score, 0);
    
    // Show final result message and GIF based on score
    if (totalScore >= 6) {
        resultElement.textContent = `Congratulations! You won the game with a score of ${totalScore} out of 10!`;
        resultElement.style.color = "green";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/3o6fIUZTTDl0IDjbZS/giphy.gif" alt="Congratulations GIF">`;
    } else {
        resultElement.textContent = `Game over. Your score is ${totalScore} out of 10. Try again!`;
        resultElement.style.color = "red";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif" alt="Try Again GIF">`;
    }

    // Update final score display
    scoreElement.textContent = `Final Score: ${totalScore} / 10`;

    // Disable navigation buttons
    document.getElementById("next-btn").disabled = true;
    document.getElementById("back-btn").disabled = true;
}

// Add event listeners for navigation and restart buttons
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("back-btn").addEventListener("click", backQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Fetch and display questions on page load
fetchQuestions();
