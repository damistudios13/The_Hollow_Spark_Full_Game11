const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const homeScreen = document.getElementById('homeScreen');
const gameMusic = document.getElementById('gameMusic');
const laugh = document.getElementById('wiseauLaugh');

let player = { x: 100, y: 500, width: 40, height: 40, color: '#00f', speed: 4 };
let enemies = [
  { x: 300, y: 500, width: 40, height: 40, color: '#f00', dir: 1 },
  { x: 600, y: 500, width: 40, height: 40, color: '#f00', dir: -1 }
];
let keys = {};
let gameOver = false;
let gameStarted = false;

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === 'Enter' && !gameStarted) startGame();
});
document.addEventListener('keyup', e => keys[e.key] = false);

function startGame() {
  homeScreen.style.display = 'none';
  canvas.style.display = 'block';
  gameMusic.play();
  gameLoop();
}

function gameLoop() {
  if (gameOver) return drawGameOver();
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;

  enemies.forEach(enemy => {
    enemy.x += enemy.dir * 2;
    if (enemy.x <= 100 || enemy.x >= 700) enemy.dir *= -1;
    if (isColliding(player, enemy)) gameOver = true;
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  enemies.forEach(enemy => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });
  ctx.fillStyle = '#fff';
  ctx.font = '20px Courier New';
  ctx.fillText('Level 1: Wastelands', 10, 30);
}

function isColliding(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

function drawGameOver() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#f00';
  ctx.font = '48px Courier New';
  ctx.fillText('GAME OVER', 270, 300);
  laugh.play();
}