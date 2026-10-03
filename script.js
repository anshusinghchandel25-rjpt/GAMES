const player = document.getElementById("player");
const enemy1 = document.getElementById("enemy1");
const enemy2 = document.getElementById("enemy2");

const scoreText = document.getElementById("score");
const speedText = document.getElementById("speed");
const nitroBar = document.getElementById("nitro");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const nitroBtn = document.getElementById("nitroBtn");
const restartBtn = document.getElementById("restartBtn");

let playerPosition = 50;
let score = 0;
let speed = 0;
let nitro = 100;

let enemy1Position = -130;
let enemy2Position = -400;

let gameRunning = true;
let nitroActive = false;

function moveLeft() {
    if (!gameRunning) return;

    playerPosition -= 7;

    if (playerPosition < 15) {
        playerPosition = 15;
    }

    player.style.left = playerPosition + "%";
}

function moveRight() {
    if (!gameRunning) return;

    playerPosition += 7;

    if (playerPosition > 85) {
        playerPosition = 85;
    }

    player.style.left = playerPosition + "%";
}

function useNitro() {
    if (nitro > 0 && gameRunning) {
        nitroActive = true;
    }
}

function stopNitro() {
    nitroActive = false;
}

leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);

nitroBtn.addEventListener("pointerdown", useNitro);
nitroBtn.addEventListener("pointerup", stopNitro);
nitroBtn.addEventListener("pointerleave", stopNitro);

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {
        moveLeft();
    }

    if (event.key === "ArrowRight") {
        moveRight();
    }

    if (event.code === "Space") {
        useNitro();
    }
});

document.addEventListener("keyup", function(event) {

    if (event.code === "Space") {
        stopNitro();
    }

});

function resetEnemy(enemy, position) {

    enemy.style.top = position + "px";

    let randomLane = Math.floor(Math.random() * 3);

    if (randomLane === 0) {
        enemy.style.left = "25%";
    }

    if (randomLane === 1) {
        enemy.style.left = "50%";
    }

    if (randomLane === 2) {
        enemy.style.left = "75%";
    }
}

function checkCollision(enemy) {

    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    return !(
        playerRect.right < enemyRect.left ||
        playerRect.left > enemyRect.right ||
        playerRect.bottom < enemyRect.top ||
        playerRect.top > enemyRect.bottom
    );
}

function gameOver() {

    gameRunning = false;

    restartBtn.style.display = "inline-block";

    alert("💥 CRASH!\nYour Score: " + score);
}

function gameLoop() {

    if (!gameRunning) return;

    let currentSpeed = nitroActive ? 12 : 6;

    if (nitroActive && nitro > 0) {
        nitro -= 0.7;
    } else {
        nitroActive = false;

        if (nitro < 100) {
            nitro += 0.15;
        }
    }

    enemy1Position += currentSpeed;
    enemy2Position += currentSpeed;

    enemy1.style.top = enemy1Position + "px";
    enemy2.style.top = enemy2Position + "px";

    if (enemy1Position > 650) {
        enemy1Position = -150;
        resetEnemy(enemy1, enemy1Position);
        score += 10;
    }

    if (enemy2Position > 650) {
        enemy2Position = -350;
        resetEnemy(enemy2, enemy2Position);
        score += 10;
    }

    speed = Math.round(currentSpeed * 18);

    scoreText.textContent = score;
    speedText.textContent = speed;
    nitroBar.style.width = nitro + "%";

    if (checkCollision(enemy1) || checkCollision(enemy2)) {
        gameOver();
        return;
    }

    requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener("click", function() {

    score = 0;
    nitro = 100;
    playerPosition = 50;

    enemy1Position = -130;
    enemy2Position = -400;

    player.style.left = "50%";

    resetEnemy(enemy1, enemy1Position);
    resetEnemy(enemy2, enemy2Position);

    restartBtn.style.display = "none";

    gameRunning = true;

    gameLoop();

});

resetEnemy(enemy1, enemy1Position);
resetEnemy(enemy2, enemy2Position);

gameLoop();