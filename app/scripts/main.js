(function() {
  'use strict';

  require('babelify/polyfill');

  var EventEmitter = require('events').EventEmitter;
  var PIXI = require('pixi.js');
  var Textbox = require('./textbox.js');

  class Game {
    constructor() {
      this.events = new EventEmitter();

      this.lastRenderTime = 0;

      // don't use fancy scaling algorithms for pixel art
      PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

      // create an new instance of a pixi stage
      this.stage = new PIXI.Stage(0x000000, true);

      this.scene = null;

      // create a renderer instance.
      this.renderer = PIXI.autoDetectRenderer(960, 448);

      this.init();
    }

    init() {
      // add the renderer view element to the DOM
      document.body.appendChild(this.renderer.view);

      // when the stage is clicked
      this.stage.click = () => {
        this.events.emit('click');
      };

      document.addEventListener('keyup', (event) => {
        this.events.emit('keyup ' + event.which);
      });

      // kick off our generator game flow
      this.flowGen = this.flow();
      this.flowGen.next();

      requestAnimationFrame(this.render.bind(this));
    }

    // Render loop
    render(time) {
      requestAnimationFrame(this.render.bind(this));

      var dt = time - this.lastRenderTime; // ms
      this.lastRenderTime = time;

      if (this.textbox) {
        this.textbox.render(dt);
      }

      this.renderer.render(this.stage);
    }

    // Game flow in generator!
    *flow() {
      this.setTextbox('Hello! Click to continue!');

      yield this.events.once('click', () => {
        this.setTextbox('I\'m just an ordinary game dialog system.');
        this.flowGen.next();
      });

      yield this.events.once('click', () => {
        this.setTextbox('But I use ES6 generators, which is cool I guess.');
        this.flowGen.next();
      });

      yield this.events.once('click', () => {
        this.setTextbox('Anyway enough about me. Do you like (r)ed or (b)lue more?  (Type the letter)');
        this.flowGen.next();
      });

      this.events.once('keyup 82', () => {
        this.setTextbox('OMG I love red!');
        this.stage.setBackgroundColor(0xff5555);
        this.flowGen.next();
      });

      this.events.once('keyup 66', () => {
        this.setTextbox('Yeah whatever blue\'s ok.');
        this.stage.setBackgroundColor(0x5555ff);
        this.flowGen.next();
      });

      yield this.events.once('click', () => {
        this.setTextbox('I said type, not click.  R or B.');
      });

      yield this.events.once('click', () => {
        this.setTextbox('Welp that\'s all!  You can refresh if you want to start over.');
        this.stage.setBackgroundColor(0x000000);
        this.flowGen.next();
      });

      yield this.events.once('click', () => {
        this.removeTextbox();
      });
    }

    setTextbox(text) {
      this.removeTextbox();
      this.textbox = new Textbox(960, text);
      this.stage.addChild(this.textbox.element);
    }

    removeTextbox() {
      if (this.textbox) {
        this.stage.removeChild(this.textbox.element);
        this.textbox = null;
      }
    }
  }

  window.onload = function() {
    window.game = new Game();
  };
})();
