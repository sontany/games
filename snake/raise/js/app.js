const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let velocity = { x: 0, y: 0 };
let score = 0;
let gameIntervalId;

// 게임 루프: 주어진 간격마다 업데이트 및 그리기 함수 실행
function gameLoop() {
    update();
    draw();
}

// 지렁이의 이동, 충돌 및 음식 섭취 처리
function update() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // 벽과 충돌 시 게임 리셋
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    // 자기 자신과의 충돌 검사
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            resetGame();
            return;
        }
    }

    snake.unshift(head);

    // 음식 섭취 시 처리
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = 'Score: ' + score;
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else {
        snake.pop();
    }
}

// 캔버스에 지렁이와 음식을 그리는 함수
function draw() {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 음식 그리기
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 지렁이(뱀) 그리기
    ctx.fillStyle = "green";
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }
}

// 게임 리셋 함수
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
}

// 키보드 입력 처리 (방향키)
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case "ArrowUp":
            if (velocity.y !== 1) velocity = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (velocity.y !== -1) velocity = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (velocity.x !== 1) velocity = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (velocity.x !== -1) velocity = { x: 1, y: 0 };
            break;
    }
});

// 난이도 조절에 따른 게임 속도 변경 함수
function startGameLoop() {
    const speed = parseInt(document.getElementById('difficulty').value, 10);
    if (gameIntervalId) clearInterval(gameIntervalId);
    gameIntervalId = setInterval(gameLoop, speed);
}

// 난이도 선택 변경 시 게임 속도 재설정
document.getElementById('difficulty').addEventListener('change', startGameLoop);

// 초기 게임 루프 시작
startGameLoop();
