//@ts-check

import AnimationLoop from "./animationLoop.mjs";

let snakeGame = new AnimationLoop(
  /** @type {HTMLCanvasElement} */ (document.getElementById("gameCanvas"))
);
snakeGame.fps = 12;
const gameSize = 20;

class Vector2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  /**
   * @param {Vector2} pos
   */
  constructor(pos) {
    this.pos = pos;
    this.dir = new Vector2(0, 0);
    /**
     * @type {Vector2[]}
     */
    this.body = [new Vector2(this.pos.x, this.pos.y)];
    this.length = 1;
  }
}

let applePos = new Vector2(
  Math.floor(Math.random() * gameSize),
  Math.floor(Math.random() * gameSize)
);

let snake = new Snake(new Vector2(1, 1));
let playing = true;

snakeGame.update = () => {
  // dont play if dead
  if (playing == false) {
    document.getElementById("instructionText").innerHTML = "you lost!<br>f5 to play again"
    return;
  }

  //clear screen
  snakeGame.ctx.fillStyle = "black";
  snakeGame.ctx.fillRect(0, 0, 20, 20);

  //if snake on apple, increase size and move apple
  if (snake.pos.x == applePos.x && snake.pos.y == applePos.y) {
    snake.length += 1;
    applePos = new Vector2(
      Math.floor(Math.random() * gameSize),
      Math.floor(Math.random() * gameSize)
    );
    document.getElementById("score").innerHTML = `${snake.length - 1}`;
  }

  //update snake
  snake.pos.x += snake.dir.x;
  snake.pos.y += snake.dir.y;
  snake.body.push(new Vector2(snake.pos.x, snake.pos.y));
  if (snake.body.length > snake.length) snake.body.splice(0, 1);

  //if hit side or hit self, lose game
  let seen = new Set();
  for (const part of snake.body) {
    const partString = `${part.x},${part.y}`;
    if (seen.has(partString)) playing = false;
    seen.add(partString);
  }
  if (
    snake.pos.x < 0 ||
    snake.pos.x >= gameSize ||
    snake.pos.y < 0 ||
    snake.pos.y >= gameSize
  )
    playing = false;

  //draw apple
  snakeGame.ctx.fillStyle = "red";
  snakeGame.ctx.fillRect(applePos.x, applePos.y, 1, 1);

  //draw snake
  snakeGame.ctx.fillStyle = "green";
  for (const part of snake.body) {
    snakeGame.ctx.fillRect(part.x, part.y, 1, 1);
  }
};

//change snake direction on key down
const keyToDir = {
  ArrowLeft: new Vector2(-1, 0),
  ArrowRight: new Vector2(1, 0),
  ArrowDown: new Vector2(0, 1),
  ArrowUp: new Vector2(0, -1),
};
document.onkeydown = (ev) => {
  if (ev.key in keyToDir) snake.dir = keyToDir[ev.key];
};
