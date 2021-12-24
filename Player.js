import GameObject from "./GameObject.js";

class Player extends GameObject {

  constructor(context, x, y, width, height, CONFIG) {

    super(context, x, y, width, height, CONFIG);

    this.dx = 0;
    this.dy = 0;
    this.currentKeys = {};
    this.velocity = 0.3;
    this.lastDirection = 1;
    this.state = 'idle';

  }

  init() {
    // listen for keydown event
    document.addEventListener('keydown', (event) => {
      // event.preventDefault() will prevent the scrolling
      event.preventDefault();

      this.currentKeys[event.code] = true;
    });

    // listen for keyup event
    document.addEventListener('keyup', (event) => {
      this.currentKeys[event.code] = false;
    });

    // define sprite images
    this.sprites = {
      run: {
        src: './assets/run-sprite.png',
        frames: 8,
        fps: 20,
        frameSize: {
          width: 400,
          height: 400,
        },
        image: null
      },
      idle: {
        src: './assets/idle-sprite.png',
        frames: 10,
        fps: 20,
        frameSize: {
          width: 400,
          height: 400,
        },
        image: null
      },
    }

    // load images
    Object.values(this.sprites).forEach((sprite) => {
      sprite.image = new Image();
      sprite.image.src = sprite.src;
    });

  }


  update(timePassedSinceLastRender) {

    // set the value of dx (along x axis)
    if (this.currentKeys['ArrowRight'] === true) this.dx = 1;
    else if (this.currentKeys['ArrowLeft'] === true) this.dx = -1;
    else this.dx = 0;

    // set the value of dy (along y axis)
    if (this.currentKeys['ArrowUp'] === true) this.dy = -1;
    else if (this.currentKeys['ArrowDown'] === true) this.dy = 1;
    else this.dy = 0;

    // store last direction the player moved in
    if (this.dx !== 0) this.lastDirection = this.dx;

    // correct velocity for moving diagonal
    if (this.dx !== 0 && this.dy !== 0) {
      this.dx /= Math.hypot(this.dx, this.dy);
      this.dy /= Math.hypot(this.dx, this.dy);
    }

    // calculate new position
    this.x += timePassedSinceLastRender * this.dx * this.velocity;
    this.y += timePassedSinceLastRender * this.dy * this.velocity;

    // check for right boundary
    if (this.x + this.width / 2 > this.CONFIG.width) this.x = this.CONFIG.width - this.width / 2;
    // check for left boundary
    else if (this.x - this.width / 2 < 0) this.x = 0 + this.width / 2;

    // check for bottom boundary
    if (this.y + this.height / 2 > this.CONFIG.height) this.y = this.CONFIG.height - this.height / 2;
    // check for top boundary
    else if (this.y - this.height / 2 < 0) this.y = 0 + this.height / 2;

    // define current state
    this.state = this.dx === 0 && this.dy === 0 ? 'idle' : 'run';

  }

  render() {
    // call render() of GameObject
    super.render();
    // move canvas origin to x
    this.context.translate(this.x, this.y);

    this.context.scale(this.lastDirection, 1);

    let coords = this.getImageSpriteCoordinates(this.sprites[this.state]);

    // draw image
    this.context.drawImage(
      this.sprites[this.state].image, // the image
      coords.sourceX,     // source x
      coords.sourceY,     // source y
      coords.sourceWidth, // source width
      coords.sourceHeight,// source height
      -this.width / 2,      // destination x
      -this.height / 2,     // destination y
      this.width,         // destination width
      this.height         // destination height
    );
    this.context.resetTransform();
  }


  getImageSpriteCoordinates(sprite) {

    let frameX = Math.floor(performance.now() / 1000 * sprite.fps % sprite.frames);

    let coords = {
      sourceX: frameX * sprite.frameSize.width,
      sourceY: 0,
      sourceWidth: sprite.frameSize.width,
      sourceHeight: sprite.frameSize.height
    }
    return coords;
  }

  getBoundingBox() {
    let bb = super.getBoundingBox();

    // change bounding box
    // width: 20% | 60% | 20% = 100%
    bb.w = bb.w * 0.6;
    bb.x = bb.x + this.width * 0.2;
    // height: 10% | 80% | 10% = 100%
    bb.h = bb.h * 0.8;
    bb.y = bb.y + this.height * 0.1;

    return bb;
  }

}

export default Player;