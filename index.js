const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static('public')); // To serve static files (e.g., CSS)
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

let currentQuestion = {};
let streak = 0;
let leaderboard = [];


// Functions to generate the question and it answer
function calculateAnswer(num1, num2, operator) {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num2 !== 0 ? (num1 / num2) : 'undefined'; // Division by 0 can not be valid
        default:
            throw new Error('Invalid operator');
    }
}
function generateQuestion() {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    currentQuestion.question = `${num1} ${operator} ${num2}`;
    currentQuestion.answer = calculateAnswer(num1, num2, operator);
}


// Home Page
app.get('/', (req, res) => {
    res.render('index', { streak: streak > 0 ? streak : 'No streak recorded.' });
});

// Quiz Page
app.get('/quiz', (req, res) => {
    // Initialize streak in session if it doesn't exist
    if (!req.session.streak) {
        req.session.streak = 0;
    }
    generateQuestion();
    res.render('quiz', { question: currentQuestion.question, streak: req.session.streak });
});

// Quiz Completion Page
app.get('/completion', (req, res) => {
    const totalCorrect = req.session.bestResult;
    const currentStreak = req.session.streak;

    res.render('completion', {
        totalCorrect,
        bestResult: totalCorrect,
        isBest: currentStreak > totalCorrect // Check if this is the best result
    });
});

// Leaderboards Page
app.get('/leaderboards', (req, res) => {
    const sortedLeaderboard = leaderboard.sort((a, b) => b.streak - a.streak);
    res.render('leaderboard', { leaderboard: sortedLeaderboard.slice(0, 10) });
});

// Handles quiz submissions
// This was a hard thing to figure out, so did a lot of
// research and wrote some coments to know what I am doing
// Add more stuff while working on a logic of a quiz
app.post('/quiz', (req, res) => {
    const userAnswer = req.body.answer;

    // Check if the user's answer is a valid number
    if (!userAnswer || isNaN(userAnswer)) {
        return res.redirect('/quiz');
    }

    const userAnswerNumber = parseInt(userAnswer);
    if (userAnswerNumber === currentQuestion.answer) {
        req.session.streak++;
        res.redirect('/quiz'); // Continue quiz
    } else {
        // Wrong answer, save current streak and show completion page
        const totalCorrect = req.session.streak;
        const timestamp = new Date().toLocaleString(); // Record the current date and time

        leaderboard.push({ streak: totalCorrect, timestamp }); // Add result to leaderboard
        req.session.bestResult = Math.max(totalCorrect, req.session.bestResult || 0); // Update best result if needed
        req.session.streak = 0; // Reset streak for next quiz
        res.redirect('/completion');
    }
});





// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});