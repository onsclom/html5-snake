const GRID_SIZE = 20;
const FPS = 12;
const v2d = (x, y) => ({ x, y, toString: () => `${x}, ${y}`, on: (v) => x === v.x && y === v.y });
const randInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
const randPos = () => v2d(randInt(0, GRID_SIZE), randInt(0, GRID_SIZE));

const snake = [v2d(2, 2)];
let size = 1;
let dir = v2d(0, 0);
let apple = randPos();
const moveBuffer = [];
const canvas = document.querySelector("#canvas");
const interval = setInterval(gameLoop, 1000 / FPS);

canvas.width = GRID_SIZE;
canvas.height = GRID_SIZE;
window.onkeydown = (event) => changeDir(event.key);

function gameLoop() {
  if (moveBuffer.length) dir = moveBuffer.shift();
  snake.unshift(v2d(snake[0].x + dir.x, snake[0].y + dir.y));
  if (snake[0].on(apple)) {
    size++;
    apple = randPos();
  } else {
    snake.pop();
  }
  const snakeOnSnake = new Set(snake.map(String)).size !== snake.length;
  const inBounds = (c) => c >= 0 && c < GRID_SIZE;
  const snakeInBounds = inBounds(snake[0].x) && inBounds(snake[0].y);
  if (snakeOnSnake || !snakeInBounds) {
    clearInterval(interval);
    alert(`Game over. Your snake was ${size} long!`);
    location.reload();
  }
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);
  ctx.fillStyle = "red";
  ctx.fillRect(apple.x, apple.y, 1, 1);
  ctx.fillStyle = "green";
  snake.forEach(({ x, y }) => ctx.fillRect(x, y, 1, 1));
}

function changeDir(arrow) {
  const dirs = {
    ArrowUp: v2d(0, -1),
    ArrowDown: v2d(0, 1),
    ArrowLeft: v2d(-1, 0),
    ArrowRight: v2d(1, 0),
  };
  const newDir = dirs[arrow] || dir;
  const prevDir = moveBuffer.at(-1) || dir;
  const illegalDir = prevDir.on(v2d(-newDir.x, -newDir.y));
  if (!illegalDir) moveBuffer.push(newDir);
}
