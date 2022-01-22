// @ts-check

export default class AnimationLoop {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    /** @type {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @type {CanvasRenderingContext2D} */
    this.ctx = canvas.getContext("2d");
    /** @type {Function} */
    this.update = () => {};
    /** @type {Number} */
    this.fps = 60;

    this.runGameLoop();
  }

  runGameLoop() {
    let start = Date.now();
    this.update();
    let end = Date.now();
    let timeTillNextFrame = 1000 / this.fps - (end.valueOf() - start.valueOf());
    setTimeout(this.runGameLoop.bind(this), timeTillNextFrame);
  }
}
