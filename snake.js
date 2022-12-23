const GRID_SIZE = 20;
const v2d = (x, y) => ({ x, y, toString: () => `${x}, ${y}` });
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randPos = () => v2d(randInt(0, GRID_SIZE), randInt(0, GRID_SIZE));

let snake = [v2d(2, 2)];
let size = 1;
let dir = v2d(0, 0);
let apple = randPos();

function gameLoop() {
  if (moveBuffer.length) dir = moveBuffer.shift();
  snake = [v2d(snake[0].x + dir.x, snake[0].y + dir.y), ...snake];
  const snakeOnApple = String(snake[0]) === String(apple);
  size = snakeOnApple ? size + 1 : size;
  snake = snake.slice(0, size);
  const snakeOnSnake = new Set(snake.map(String)).size !== snake.length;
  const inBounds = (x) => x >= 0 && x < GRID_SIZE;
  const snakeInBounds = inBounds(snake[0].x) && inBounds(snake[0].y);
  apple = snakeOnApple ? randPos() : apple;
  if (snakeOnSnake || !snakeInBounds) {
    clearInterval(interval);
    alert(`Game over. Your snake was ${size} long!`);
    location.reload();
  }

  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const GRID = canvas.width / GRID_SIZE;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * GRID, apple.y * GRID, GRID, GRID);
  ctx.fillStyle = "green";
  snake.forEach(({ x, y }) => ctx.fillRect(x * GRID, y * GRID, GRID, GRID));
}

const FPS = 12;
let interval = setInterval(gameLoop, 1000 / FPS);
let moveBuffer = [];
const dirs = {
  ArrowUp: v2d(0, -1),
  ArrowDown: v2d(0, 1),
  ArrowLeft: v2d(-1, 0),
  ArrowRight: v2d(1, 0),
};
const changeDir = (arrow) => {
  const newDir = dirs[arrow] || dir;
  const lastDir = moveBuffer.at(-1) || dir;
  const illegalDir = lastDir.x == -newDir.x && lastDir.y == -newDir.y;
  if (!illegalDir) moveBuffer.push(newDir);
};
window.onkeydown = (e) => changeDir(e.key);
