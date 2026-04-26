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
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 🎮 Game State
let gameRunning = false;
let gameOver = false;
let score = 0;
let combo = 0;
let shake = 0;
let slowMo = 0;

// 🧍 Player
let player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  health: 100,
  punching: false,
  punchFrame: 0,
  rage: false
};

// 🤖 Enemies
let enemies = [];
let particles = [];
let spawnRate = 1200;

// 🎯 Controls
canvas.addEventListener("mousemove", e => {
  player.x = Math.max(50, Math.min(canvas.width - 50, e.clientX));
});

canvas.addEventListener("click", attack);
canvas.addEventListener("touchstart", attack);

function attack() {
  player.punching = true;
  player.punchFrame = 10;
}

// 🔥 Spawn Enemy (with boss chance)
function spawnEnemy() {
  if (!gameRunning) return;

  let isBoss = Math.random() < 0.1;

  enemies.push({
    x: Math.random() * canvas.width,
    y: -50,
    health: isBoss ? 200 : 30,
    speed: isBoss ? 1 : 2 + Math.random() * 2,
    boss: isBoss
  });

  setTimeout(spawnEnemy, spawnRate);
}

// 💥 Particles
function createParticles(x, y, amount = 15) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x,
      y,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      life: 30
    });
  }
}

// 🧍 Draw Stickman
function drawStickman(x, y, punching, boss = false) {
  ctx.strokeStyle = boss ? "red" : "white";
  ctx.lineWidth = boss ? 5 : 3;

  ctx.beginPath();
  ctx.arc(x, y - 40, boss ? 20 : 10, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.beginPath();
  if (punching) {
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 40, y - 20);
  } else {
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x + 15, y - 10);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x - 15, y - 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 10, y + 20);
  ctx.moveTo(x, y);
  ctx.lineTo(x + 10, y + 20);
  ctx.stroke();
}

// 🤖 Enemies Logic
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];

    // AI: follow player
    e.x += (player.x - e.x) * 0.02;
    e.y += e.speed;

    drawStickman(e.x, e.y, false, e.boss);

    // Punch hit
    if (player.punching) {
      let dist = Math.abs(player.x - e.x);
      if (dist < 50 && Math.abs(player.y - e.y) < 60) {
        e.health -= player.rage ? 30 : 10;

        // 💥 Effects
        createParticles(e.x, e.y, 20);
        shake = 15;
        slowMo = 5;

        // Knockback
        e.y -= 20;

        combo++;
      }
    }

    // Enemy attack
    if (Math.abs(player.x - e.x) < 30 && Math.abs(player.y - e.y) < 50) {
      player.health -= e.boss ? 1 : 0.5;
      combo = 0;
      shake = 10;
    }

    // Death
    if (e.health <= 0) {
      createParticles(e.x, e.y, 40);
      enemies.splice(i, 1);

      score += e.boss ? 500 : 100;
    }

    if (e.y > canvas.height) enemies.splice(i, 1);
  }
}

// 💥 Particles
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

// 🎥 Effects
function applyEffects() {
  if (shake > 0) {
    ctx.translate(
      (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake
    );
    shake *= 0.9;
  }

  if (slowMo > 0) {
    slowMo--;
  }
}

// 🔴 Rage Mode
function checkRage() {
  player.rage = player.health < 30;

  if (player.rage) {
    ctx.fillStyle = "rgba(255,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// 🔁 Game Loop
function update() {
  if (!gameRunning) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  applyEffects();
  checkRage();

  drawStickman(player.x, player.y, player.punching);

  if (player.punchFrame > 0) player.punchFrame--;
  else player.punching = false;

  updateEnemies();
  updateParticles();

  // ❤️ Death
  if (player.health <= 0) {
    gameOver = true;
    gameRunning = false;

    ctx.fillStyle = "red";
    ctx.font = "50px Arial";
    ctx.fillText("YOU DIED", canvas.width / 2 - 120, canvas.height / 2);

    startBtn.innerText = "RESTART";
    startBtn.style.display = "block";
  }

  score++;
  scoreEl.innerText =
    "Score: " + score +
    " | HP: " + Math.floor(player.health) +
    " | Combo: " + combo;

  setTimeout(() => requestAnimationFrame(update), slowMo ? 60 : 16);
}

// ▶️ Start Game
startBtn.onclick = () => {
  player.health = 100;
  score = 0;
  combo = 0;
  enemies = [];
  particles = [];
  gameOver = false;

  gameRunning = true;
  startBtn.style.display = "none";

  spawnEnemy();
  update();
};
