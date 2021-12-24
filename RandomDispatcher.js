// see https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
let randomNumberBetween = (minRandomNumber, maxRandomNumber) => {
  return Math.floor(Math.random() * (maxRandomNumber - minRandomNumber + 1) + minRandomNumber);
}

class RandomDispatcher {

  constructor(callback, options = { min: 1000, max: 5000}) {
    // throw an error if callback is not a function
    if(typeof callback !== 'function') throw Error('Callback must be a function.');

    this.callback = callback;
    this.options = options;

    // kick off first iteration
    this.loop();
  }

  loop () {

    // calculate a random number between min and max
    let wait = randomNumberBetween(this.options.min, this.options.max);

    // clear previous timeout
    if(this.timeout) window.clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => {
      // call the callback
      this.callback();
      // do next iteration
      this.loop();
    }, wait);

  }

}

export default RandomDispatcher;

export {
  randomNumberBetween
}