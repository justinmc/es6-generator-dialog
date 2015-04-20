(function() {
  'use strict';

  var PIXI = require('pixi.js');

  class Textbox {
    constructor(cameraWidth, string) {
      this.string = string;
      this.speed = 0.03;
      this.blinkerDelay = 200;
      this.blinkerSpeed = 0.003;
      this.age = 0;
      this.ageFinished = null;
      this.dismissable = false;

      var width = cameraWidth - 40;
      var height = 100;
      var offset = 20;
      var thickness = 4;
      var roundRadius = 8;

      this.element = new PIXI.DisplayObjectContainer();
      this.element.height = height;
      this.element.width = width;
      this.element.x = offset;
      this.element.y = offset;

      this.box = new PIXI.Graphics();
      this.box.lineStyle(thickness * 2, 0xffffff);
      this.box.drawRoundedRect(0, 0, width, height, roundRadius);
      this.box.endFill();
      this.element.addChild(this.box);

      var chrome = new PIXI.Graphics();
      chrome.lineStyle(thickness, 0xabcdef);
      chrome.beginFill(0x000000, 0.7);
      chrome.drawRoundedRect(0, 0, width, height, roundRadius);
      chrome.endFill();
      this.element.addChild(chrome);

      this.blinker = new PIXI.Graphics();
      this.blinker.beginFill(0xffffff);
      this.blinker.moveTo(width - 26, height - 18);
      this.blinker.lineTo(width - 10, height - 18);
      this.blinker.lineTo(width - 18, height - 12);
      this.blinker.lineTo(width - 26, height - 18);
      this.blinker.endFill();
      this.blinker.visible = false;
      this.element.addChild(this.blinker);

      this.text = new PIXI.Text('', {font: '40px Sevastopol', fill: '#ffffff'});
      this.text.position.x = offset;
      this.text.position.y = offset;
      this.element.addChild(this.text);
    }

    render(dt) {
      this.age += dt;

      if (!this.ageFinished) {
        var numberOfLetters = Math.floor(this.age * this.speed);
        var string = this.string.substring(0, numberOfLetters);

        if (string !== this.text.text) {
          this.text.setText(string);

          if (string === this.string) {
            this.ageFinished = this.age;
          }
        }
      } else if (this.age > (this.ageFinished + this.blinkerDelay)) {
        var blink = Math.floor(this.age * this.blinkerSpeed) % 2;
        this.blinker.visible = !!blink;
        this.dismissable = true;
      }
    }
  }

  module.exports = Textbox;
})();
