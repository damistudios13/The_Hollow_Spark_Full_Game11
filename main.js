const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const homeScreen = document.getElementById('homeScreen');
const gameMusic = document.getElementById('gameMusic');
const laugh = document.getElementById('wiseauLaugh');
const pickupSound = document.getElementById('pickupSound');
const enemyHitSound = document.getElementById('enemyHitSound');

let player = { x: 100, y: 500, width: 40, height: 40, sprite: new Image(), speed: 4 };
player.sprite.src = 'assets/characters/hero.png';

let enemies = [];
let currentLevel = 1;
let keys = {};
let gameOver = false;
let gameStarted = false;
let animationFrame = 0;

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === 'Enter' && !gameStarted) startGame();
});
document.addEventListener('keyup', e => keys[e.key] = false);

function startGame() {
  homeScreen.style.display = 'none';
  canvas.style.display = 'block';
  gameMusic.play();
  loadLevel(1);
  gameLoop();
}

function loadLevel(levelNum) {
  currentLevel = levelNum;
  enemies = [];
  if (levelNum === 1) {
    enemies.push({ x: 300, y: 500, width: 40, height: 40, sprite: new Image(), dir: 1 });
    enemies[0].sprite.src = 'assets/characters/enemy1.png';
  } else if (levelNum === 2) {
    enemies.push({ x: 250, y: 450, width: 50, height: 50, sprite: new Image(), dir: -1 });
    enemies[0].sprite.src = 'assets/characters/enemy2.png';
  } else if (levelNum === 3) {
    enemies.push({ x: 350, y: 400, width: 80, height: 80, sprite: new Image(), dir: 1 });
    enemies[0].sprite.src = 'assets/characters/boss.png';
  }
}

function gameLoop() {
  if (gameOver) return drawGameOver();
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function update() {
  animationFrame++;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;

  enemies.forEach(enemy => {
    enemy.x += enemy.dir * 2;
    if (enemy.x <= 100 || enemy.x >= 700) enemy.dir *= -1;
    if (isColliding(player, enemy)) {
      gameOver = true;
      enemyHitSound.play();
    }
  });

  if (player.x > 750) {
    if (currentLevel < 3) {
      player.x = 100;
      loadLevel(currentLevel + 1);
      pickupSound.play();
    } else {
      drawVictory();
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(player.sprite, player.x, player.y, player.width, player.height);

  enemies.forEach(enemy => {
    ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  ctx.fillStyle = '#fff';
  ctx.font = '20px Courier New';
  ctx.fillText('Level ' + currentLevel, 10, 30);
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

function drawVictory() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f0';
  ctx.font = '48px Courier New';
  ctx.fillText('YOU WIN!', 300, 300);
}