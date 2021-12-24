import Collectible from './Collectible.js';
import Player from './Player.js';
import PointsDisplay from './PointsDisplay.js';
import RandomDispatcher, { randomNumberBetween } from './RandomDispatcher.js';

// global variables
let context;
let lastTickTimestamp;
let player;
let collectibles = [];
let gameObjects = [];
let pointsDisplay;

const CONFIG = {
  width: 800,
  height: 600,
  debug: false
}

const init = () => {
  let canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  canvas.setAttribute('width', CONFIG.width);
  canvas.setAttribute('height', CONFIG.height);

  // create Player
  player = new Player(context, 100, 100, 100, 100, CONFIG);
  gameObjects.push(player);

  // randomly dispatch Collectibles (Mice)
  let dispatcherOptions = { min: 500, max: 5000 };
  let randomDispatcher = new RandomDispatcher(() => {

    let newX = randomNumberBetween(50, CONFIG.width - 50);
    let newY = randomNumberBetween(50, CONFIG.height - 50);
    let randomCollectible = new Collectible(context, newX, newY, 50, 50, CONFIG);
    collectibles.push(randomCollectible);
    gameObjects.push(randomCollectible);

    randomCollectible.onRemove(() => {
      removeCollectible(randomCollectible);
    });

  }, dispatcherOptions);

  // create PointsDisplay
  pointsDisplay = new PointsDisplay(context, CONFIG.width - 30, 30);
  gameObjects.push(pointsDisplay);


  lastTickTimestamp = performance.now();
  gameLoop();
}

const gameLoop = () => {
  // how much time has passed since the last tick?
  let timePassedSinceLastRender = performance.now() - lastTickTimestamp;

  update(timePassedSinceLastRender);
  render();

  // set lastTickTimestamp to "now"
  lastTickTimestamp = performance.now();
  // call next iteration of the game loop
  requestAnimationFrame(gameLoop);
}


const update = (timePassedSinceLastRender) => {

  // update all game objects
  gameObjects.forEach((gameObject) => {
    gameObject.update(timePassedSinceLastRender);
  });


  // check for collisions between collectibles and player and store in removeItems array
  let removeItems = [];
  collectibles.forEach(function(collectible) {
    if(checkCollisionBetween(player, collectible)) {
      removeItems.push(collectible);
      pointsDisplay.increase();
    }
  });

  // remove colliding collectibles from collectibes and gameObjects arrays
  removeItems.forEach((removeItem) => {
    removeCollectible(removeItem);
  });
  // or:
  // removeItems.forEach(removeCollectible)

}


const render = () => {
  // clear the canvas
  context.resetTransform();
  context.clearRect(0, 0, CONFIG.width, CONFIG.height);

  // render all game objects
  gameObjects.forEach((gameObject) => {
    gameObject.render();
  });
}


let checkCollisionBetween = (gameObjectA, gameObjectB) => {

  let bbA = gameObjectA.getBoundingBox();
  let bbB = gameObjectB.getBoundingBox();

  if(
    bbA.x < bbB.x + bbB.w &&
    bbA.x + bbA.w > bbB.x &&
    bbA.y < bbB.y + bbB.h &&
    bbA.y + bbA.h > bbB.y
    ) {
    // collision happened
      return true;
  }
  else return false;
}


let removeCollectible = (collectible) => {
  collectibles.splice(collectibles.indexOf(collectible), 1);
  gameObjects.splice(gameObjects.indexOf(collectible), 1);
}


window.addEventListener('load', () => {
  init();
});
