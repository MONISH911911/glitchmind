// ================== SETUP ==================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================== GAME STATE ==================
let gameRunning = false;
let gameOver = false;
let score = 0;
let combo = 0;
let highScore = localStorage.getItem("highScore") || 0;

let enemies = [];
let particles = [];

let shake = 0;
let bgOffset = 0;
let difficulty = 1;

// ================== PLAYER ==================
let player = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  health: 100,
  punching: false,
  punchFrame: 0,
  rage: false
};

// ================== INPUT ==================
canvas.addEventListener("mousemove", e => {
  player.x = Math.max(50, Math.min(canvas.width - 50, e.clientX));
});

canvas.addEventListener("click", attack);
canvas.addEventListener("touchstart", attack);

window.addEventListener("keydown", e => {
  if (e.code === "Space") dash();
});

function attack() {
  player.punching = true;
  player.punchFrame = 10;
}

function dash() {
  player.x += (Math.random() > 0.5 ? 1 : -1) * 120;
  shake = 20;
}

// ================== RESET ==================
function resetGame() {
  score = 0;
  combo = 0;
  difficulty = 1;

  player.health = 100;

  enemies = [];
  particles = [];

  gameOver = false;
}

// ================== START ==================
startBtn.onclick = () => {
  resetGame();
  gameRunning = true;
  startBtn.style.display = "none";

  spawnEnemy();
  update();
};

// ================== ENEMY ==================
function spawnEnemy() {
  if (!gameRunning) return;

  let isBoss = Math.random() < 0.1;

  enemies.push({
    x: Math.random() * canvas.width,
    y: -50,
    health: isBoss ? 150 : 30,
    speed: (2 + Math.random() * 2) * difficulty,
    boss: isBoss
  });

  setTimeout(spawnEnemy, 1000 / difficulty);
}

// ================== PARTICLES ==================
function createParticles(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      life: 30
    });
  }
}

// ================== DRAW PLAYER ==================
function drawPlayer() {
  ctx.shadowBlur = 20;
  ctx.shadowColor = player.rage ? "red" : "cyan";

  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.arc(player.x, player.y - 30, 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(player.x, player.y - 20);
  ctx.lineTo(player.x, player.y + 10);
  ctx.stroke();

  // punch arm
  ctx.beginPath();
  if (player.punching) {
    ctx.moveTo(player.x, player.y - 10);
    ctx.lineTo(player.x + 40, player.y - 10);
  } else {
    ctx.moveTo(player.x, player.y - 10);
    ctx.lineTo(player.x + 15, player.y);
  }
  ctx.stroke();

  ctx.shadowBlur = 0;
}

// ================== DRAW ENEMIES ==================
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];

    e.x += (player.x - e.x) * 0.02;
    e.y += e.speed;

    ctx.strokeStyle = e.boss ? "red" : "cyan";
    ctx.lineWidth = e.boss ? 5 : 2;

    ctx.beginPath();
    ctx.arc(e.x, e.y - 20, e.boss ? 15 : 8, 0, Math.PI * 2);
    ctx.stroke();

    // collision
    if (player.punching &&
        Math.abs(player.x - e.x) < 50 &&
        Math.abs(player.y - e.y) < 60) {

      e.health -= player.rage ? 30 : 10;

      createParticles(e.x, e.y);
      shake = 15;
      combo++;

      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // enemy hit
    if (Math.abs(player.x - e.x) < 30 &&
        Math.abs(player.y - e.y) < 50) {
      player.health -= e.boss ? 1 : 0.5;
      combo = 0;
    }

    if (e.health <= 0) {
      enemies.splice(i, 1);
      score += e.boss ? 300 : 100;
    }

    if (e.y > canvas.height) enemies.splice(i, 1);
  }
}

// ================== PARTICLES ==================
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.fillStyle = "white";
    ctx.fillRect(p.x, p.y, 3, 3);

    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ================== BACKGROUND ==================
function drawBackground() {
  bgOffset += 2;

  for (let i = 0; i < canvas.height; i += 40) {
    ctx.strokeStyle = "rgba(0,255,255,0.1)";
    ctx.beginPath();
    ctx.moveTo(0, i + (bgOffset % 40));
    ctx.lineTo(canvas.width, i + (bgOffset % 40));
    ctx.stroke();
  }
}

// ================== EFFECTS ==================
function applyShake() {
  if (shake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake
    );
    shake *= 0.9;
  }
}

// ================== UPDATE ==================
function update() {
  if (!gameRunning) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  applyShake();
  drawBackground();

  difficulty += 0.0005;

  player.rage = player.health < 30;

  drawPlayer();

  if (player.punchFrame > 0) player.punchFrame--;
  else player.punching = false;

  updateEnemies();
  updateParticles();

  // death
  if (player.health <= 0) {
    gameRunning = false;
    startBtn.innerText = "RESTART";
    startBtn.style.display = "block";
  }

  score++;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  scoreEl.innerText =
    "Score: " + score +
    " | High: " + highScore +
    " | HP: " + Math.floor(player.health) +
    " | Combo: " + combo;

  requestAnimationFrame(update);
  }
