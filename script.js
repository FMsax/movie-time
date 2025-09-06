const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Responsive canvas size
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.95, 800);
  canvas.height = Math.min(window.innerHeight * 0.6, 400);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let gameRunning = true;
let score = 0;

// Blub (the player)
const blub = {
  x: 50,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.6,
  bounce: 12,
  color: "#3498db"
};

// Obstacles (brick walls)
let obstacles = [];
let frame = 0;
const obstacleWidth = 40;
const obstacleGap = 200; // distance between obstacles
const obstacleSpeed = 4;

// Controls (keyboard)
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && gameRunning) {
    blub.velocity = -blub.bounce;
  } else if (!gameRunning && e.code === "Space") {
    restartGame();
  }
});

// Controls (touch anywhere on screen)
document.addEventListener("touchstart", () => {
  if (gameRunning) {
    blub.velocity = -blub.bounce;
  } else {
    restartGame();
  }
});

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update blub
  blub.velocity += blub.gravity;
  blub.y += blub.velocity;

  // Ground collision
  if (blub.y + blub.radius > canvas.height) {
    blub.y = canvas.height - blub.radius;
    blub.velocity = 0;
  }

  // Draw blub
  ctx.beginPath();
  ctx.arc(blub.x, blub.y, blub.radius, 0, Math.PI * 2);
  ctx.fillStyle = blub.color;
  ctx.fill();

  // Generate obstacles
  if (frame % obstacleGap === 0) {
    const height = Math.floor(Math.random() * (canvas.height - 100)) + 50;
    obstacles.push({
      x: canvas.width,
      y: canvas.height - height,
      width: obstacleWidth,
      height: height
    });
  }

  // Update obstacles
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= obstacleSpeed;

    // Draw brick wall
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // Collision detection
    if (
      blub.x + blub.radius > obstacle.x &&
      blub.x - blub.radius < obstacle.x + obstacle.width &&
      blub.y + blub.radius > obstacle.y
    ) {
      gameOver();
    }

    // Remove passed obstacles & increment score
    if (obstacle.x + obstacle.width < 0) {
      obstacles.splice(index, 1);
      score++;
    }
  });

  // Draw score
  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);

  frame++;
  requestAnimationFrame(gameLoop);
}

// Game over → redirect to invitation page
function gameOver() {
  gameRunning = false;

  // Redirect with score after short delay
  setTimeout(() => {
    window.location.href = "gameover.html?score=" + score;
  }, 1000);
}

// Restart game
function restartGame() {
  gameRunning = true;
  score = 0;
  blub.y = canvas.height / 2;
  blub.velocity = 0;
  obstacles = [];
  frame = 0;
  gameLoop();
}

// Start game
gameLoop();
