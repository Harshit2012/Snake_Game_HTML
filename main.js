const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

const snakeSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let direction = 'right';
let score = 0;
let lastscore = 0;
let isPaused = false;
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize));
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
}

function move() {
    let head = { ...snake[0] };
    if (direction === 'up') head.y -= snakeSize;
    else if (direction === 'down') head.y += snakeSize;
    else if (direction === 'left') head.x -= snakeSize;
    else if (direction === 'right') head.x += snakeSize;
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize
    };
    updateScore();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    document.getElementById('lastScoreLabel').innerText = `Last Score: ${score}`;
    resetGame();
}

function resetGame() {
    snake = [{ x: 100, y: 100 }];
    direction = 'right';
    score = 0;
    generateFood();
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function gameLoop() {
    move();
    checkCollision();
    draw();
}

function changeDirection(newDirection) {
    if (!(direction === 'up' && newDirection === 'down' ||
        direction === 'down' && newDirection === 'up' ||
        direction === 'left' && newDirection === 'right' ||
        direction === 'right' && newDirection === 'left')) {
        direction = newDirection;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
});

generateFood();
gameInterval = setInterval(gameLoop, 150);

function togglePause() {
    isPaused = !isPaused;

    const pauseButton = document.getElementById('pauseButton');
    pauseButton.innerText = isPaused ? 'Resume' : 'Pause';

    if (isPaused) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(gameLoop, 150);
    }
}