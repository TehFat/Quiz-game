// Initialize variables
let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];
let userScores = [];
let isWaiting = false;

// Show intro screen with a "Let's Play a Game" text, GIF, and start button
function showIntro() {
    const questionElement = document.getElementById("question");
    const choicesElement = document.getElementById("choices");
    const gifElement = document.getElementById("feedback-gif");

    // Clear existing content
    questionElement.innerHTML = "Let's Play a Game";
    choicesElement.innerHTML = "";
    gifElement.innerHTML = `<img src="https://media.giphy.com/media/sz3HhMKNnzEDRy5VNX/giphy.gif" alt="Let's Play GIF">`;

    // Create start button
    const startButton = document.createElement("button");
    startButton.textContent = "Start";
    startButton.classList.add("start-btn");
    startButton.onclick = fetchQuestions;

    // Add the button to the page
    choicesElement.appendChild(startButton);

    // Hide other buttons
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("back-btn").style.display = "none";
    document.getElementById("restart-btn").style.display = "none";
    document.getElementById("score").style.display = "none";

}

// Fetch questions from the API
async function fetchQuestions() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await response.json();
        questions = data.results;
        userAnswers = new Array(questions.length).fill(null);
        userScores = new Array(questions.length).fill(0);
        
        // Show other buttons
        document.getElementById("next-btn").style.display = "inline-block";
        document.getElementById("back-btn").style.display = "inline-block";
        document.getElementById("restart-btn").style.display = "inline-block";
        
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
    const gifElement = document.getElementById("feedback-gif");
    const questionCounterElement = document.getElementById("question-counter");
    const backButton = document.getElementById("back-btn");
    const nextButton = document.getElementById("next-btn");

    resultElement.textContent = "";
    gifElement.innerHTML = "";

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;
    choicesElement.innerHTML = "";

    questionCounterElement.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;

    const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    allChoices.sort(() => Math.random() - 0.5);

    allChoices.forEach(choice => {
        const choiceButton = document.createElement("button");
        choiceButton.textContent = choice;
        choiceButton.classList.add("choice-btn");
        
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

    backButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === questions.length - 1;

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

    if (userChoice === currentQuestion.correct_answer) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif" alt="Happy GIF">`;
    } else {
        resultElement.textContent = "Incorrect!";
        resultElement.style.color = "red";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif" alt="Sad GIF">`;
    }

    const totalScore = userScores.reduce((sum, score) => sum + score, 0);
    scoreElement.textContent = `Score: ${totalScore}`;

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

    questionElement.innerHTML = "";
    choicesElement.innerHTML = "";
    
    const totalScore = userScores.reduce((sum, score) => sum + score, 0);
    
    if (totalScore >= 6) {
        resultElement.textContent = `Congratulations! You won the game with a score of ${totalScore} out of 10!`;
        resultElement.style.color = "green";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/3o6fIUZTTDl0IDjbZS/giphy.gif" alt="Congratulations GIF">`;
    } else {
        resultElement.textContent = `Game over. Your score is ${totalScore} out of 10. Try again!`;
        resultElement.style.color = "red";
        gifElement.innerHTML = `<img src="https://media.giphy.com/media/JER2en0ZRiGUE/giphy.gif" alt="Try Again GIF">`;
    }

    scoreElement.textContent = `Final Score: ${totalScore} / 10`;

    document.getElementById("next-btn").disabled = true;
    document.getElementById("back-btn").disabled = true;
}

// Add event listeners for navigation and restart buttons
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("back-btn").addEventListener("click", backQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

// Show intro screen on page load
showIntro();
