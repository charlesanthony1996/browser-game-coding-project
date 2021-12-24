import GameObject from "./GameObject.js";

class PointsDisplay extends GameObject {

  constructor(context, x, y) {
    super(context, x, y);
    this.points = 0;
  }

  render() {
    // circle in background
    this.context.fillStyle = "rebeccapurple";
    this.context.beginPath();
    this.context.ellipse(this.x + 8, this.y - 8, 35, 35, 2 * Math.PI, 0, 2 * Math.PI);
    this.context.fill();
    // text in foreground
    this.context.font = 'bold 30px monospace';
    this.context.fillStyle = 'white';
    this.context.textAlign = 'center';
    this.context.fillText(this.points, this.x, this.y);
  }

  increase() {
    this.points++;
  }
}

export default PointsDisplay;