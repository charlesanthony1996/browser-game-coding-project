import GameObject from "./GameObject.js";

class Collectible extends GameObject {

  constructor(context, x, y, width, height, CONFIG) {
    super(context, x, y, width, height, CONFIG);
    this.age = 0;
    this.creationTime = performance.now();
    this.maxAge = 5; // seconds
    this.removeCallback = null;
  }

  init() {
    this.image = new Image();
    this.image.src = './assets/mouse.png';
  }

  update() {
    this.age = (performance.now() - this.creationTime) / 1000;  // / 1000 for milliseconds -> seconds
    if(this.age >= this.maxAge && typeof this.removeCallback === 'function') {
      // reached maximum age -> remove this collectible
      this.removeCallback();
    }
  }

  render() {
    // call render() of GameObject
    super.render();

    this.context.translate(this.x, this.y);

    // draw "age" bar
    let percentageAge = this.age / this.maxAge;
    this.context.fillStyle = 'rebeccapurple';
    this.context.fillRect(-this.width / 2, this.height / 2, this.width - this.width * percentageAge, 8);

    this.context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

    this.context.resetTransform();
  }

  onRemove(callbackFunction) {
    this.removeCallback = callbackFunction;
  }

}

export default Collectible;