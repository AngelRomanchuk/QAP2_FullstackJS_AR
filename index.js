const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static('public')); // To serve static files (e.g., CSS)



let currentQuestion = {};
let streak = 0;
let leaderboard = [];

// Function to generate a new question
function generateQuestion() {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    currentQuestion.question = `${num1} ${operator} ${num2}`;
    currentQuestion.answer = eval(currentQuestion.question); // Note: use cautiously in production
}

// Home Page
app.get('/', (req, res) => {
    res.render('index', { streak: streak > 0 ? streak : 'No streak recorded.' });
});

// Quiz Page
app.get('/quiz', (req, res) => {
    generateQuestion();
    res.render('quiz', { question: currentQuestion.question });
});

// Quiz Completion Page
app.get('/completion', (req, res) => {
    res.render('completion', { streak });
});

// Leaderboards Page
app.get('/leaderboards', (req, res) => {
    leaderboard.sort((a, b) => b.streak - a.streak);
    res.render('leaderboard', { leaderboard: leaderboard.slice(0, 10) });
});

// Handles quiz submissions
app.post('/quiz', (req, res) => {
    const { answer } = req.body;
    if (parseInt(answer) === currentQuestion.answer) {
        streak++;
    } else {
        streak = 0; // Reset streak on wrong answer
    }
    leaderboard.push({ streak, timestamp: new Date().toLocaleString() });
    res.redirect('/completion');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});