 const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🧍 Player
let player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  health: 100,
  punching: false,
  punchFrame: 0
};

// 🤖 Enemies
let enemies = [];
let particles = [];
let score = 0;
let gameOver = false;
let shake = 0;

// 🎯 Controls
canvas.addEventListener("mousemove", e => {
  player.x = e.clientX;
});

canvas.addEventListener("click", () => {
  player.punching = true;
  player.punchFrame = 10;
});

// 📱 Touch
canvas.addEventListener("touchmove", e => {
  player.x = e.touches[0].clientX;
});

canvas.addEventListener("touchstart", () => {
  player.punching = true;
  player.punchFrame = 10;
});

// 🔥 Spawn enemy
function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: -50,
    health: 30,
    speed: 2 + Math.random() * 2
  });
}
setInterval(spawnEnemy, 1200);

// 💥 Particles
function createParticles(x, y) {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 6,
      dy: (Math.random() - 0.5) * 6,
      life: 20
    });
  }
}

// 🧍 Draw stickman
function drawStickman(x, y, punching) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;

  // Head
  ctx.beginPath();
  ctx.arc(x, y - 40, 10, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  if (punching) {
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 30, y - 20); // punch forward
  } else {
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 15, y - 10);
  }
  ctx.stroke();

  // Other arm
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x - 15, y - 10);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 10, y + 20);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y + 20);
  ctx.stroke();
}

// 🤖 Draw enemies
function drawEnemies() {
  enemies.forEach((e, i) => {
    e.y += e.speed;

    drawStickman(e.x, e.y, false);

    // 💀 Collision with punch
    if (player.punching) {
      let dist = Math.abs(player.x - e.x);
      if (dist < 40 && Math.abs(player.y - e.y) < 50) {
        e.health -= 10;
        createParticles(e.x, e.y);
        shake = 10;
      }
    }

    // Enemy hits player
    if (Math.abs(player.x - e.x) < 20 && Math.abs(player.y - e.y) < 40) {
      player.health -= 0.5;
      shake = 5;
    }

    // Dead enemy
    if (e.health <= 0) {
      enemies.splice(i, 1);
      score += 50;
    }

    if (e.y > canvas.height) enemies.splice(i, 1);
  });
}

// 💥 Particles
function drawParticles() {
  particles.forEach((p, i) => {
    p.x += p.dx;
    p.y += p.dy;
    p.life--;

    ctx.fillStyle = "white";
    ctx.fillRect(p.x, p.y, 2, 2);

    if (p.life <= 0) particles.splice(i, 1);
  });
}

// 🎥 Shake
function applyShake() {
  if (shake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake
    );
    shake *= 0.9;
  }
}

// 🔁 Game loop
function update() {
  if (gameOver) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  applyShake();

  // 🧍 Player
  drawStickman(player.x, player.y, player.punching);

  if (player.punchFrame > 0) {
    player.punchFrame--;
  } else {
    player.punching = false;
  }

  drawEnemies();
  drawParticles();

  // ❤️ Health
  if (player.health <= 0) {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("YOU DIED", canvas.width / 2 - 120, canvas.height / 2);
  }

  score++;
  scoreEl.innerText = "Score: " + score + " | HP: " + Math.floor(player.health);

  requestAnimationFrame(update);
}

update();
