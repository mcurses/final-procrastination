import p5 from "p5";
import scoreImgFile from "./score.png";
import carefulFile from "./careful.png";
import headlineFile from "./letsstartsimple.png";
import gameOver1File from "./gameover1_1.jpg";
import gameOver2File from "./gameover1_2.jpg";
import raupiIMGFile from "./raupi.png";
import blattFile from "./bg.png";
import fruitFile from "./fruit.png";
import plaumeFile from "./pflaumenFangen.png";
import nimmersattFile from "./nimmersatt.png";
import startFile from "./start1.png";
import startHoverFile from "./start2.png";

export default function snake(s) {
  let width = 1920 * 0.5;
  let height = 800; //1080 * 0.5;
  // console.log(height);

  const buttonScale = 1.5

  const buttonPos = {
    x: width - 180,
    y: height / 2
  };
  const buttonSize = {
    width: 40 * buttonScale,
    height: 30 * buttonScale
  };

  const buttonUp = {
    x0: buttonPos.x + buttonSize.width,
    x1: buttonPos.x + buttonSize.width + buttonSize.width,
    y0: buttonPos.y,
    y1: buttonPos.y + buttonSize.height
  };

  const buttonDown = {
    x0: buttonPos.x + buttonSize.width,
    x1: buttonPos.x + buttonSize.width + buttonSize.width,
    y0: buttonPos.y + buttonSize.height,
    y1: buttonPos.y + buttonSize.height + buttonSize.height
  };

  const buttonLeft = {
    x0: buttonPos.x,
    x1: buttonPos.x + buttonSize.width,
    y0: buttonPos.y + buttonSize.height,
    y1: buttonPos.y + buttonSize.height + buttonSize.height
  };

  const buttonRight = {
    x0: buttonPos.x + buttonSize.width * 2,
    x1: buttonPos.x + buttonSize.width * 2 + buttonSize.width,
    y0: buttonPos.y + buttonSize.height,
    y1: buttonPos.y + buttonSize.height + buttonSize.height
  };

  s.setup = () => {
    s.createCanvas(width + 80, height);
    s.frameRate(60);
  };

  let sendScore;
  s.myCustomRedrawAccordingToNewPropsHandler = function(newProps) {
    if (newProps.getScore) {
      sendScore = newProps.getScore;
    }
  };

  //variables
  var sc = "start";
  var snakeBody = [];

  //img
  var scoreImg = s.loadImage(scoreImgFile);
  var careful = s.loadImage(carefulFile);
  var headline = s.loadImage(headlineFile);
  var gameOver1 = s.loadImage(gameOver1File);
  var gameOver2 = s.loadImage(gameOver2File);
  var raupiIMG = s.loadImage(raupiIMGFile);
  var blatt = s.loadImage(blattFile);
  var fruit = s.loadImage(fruitFile);
  var plaume = s.loadImage(plaumeFile);
  var nimmersatt = s.loadImage(nimmersattFile);

  var start = s.loadImage(startFile);
  var startHover = s.loadImage(startHoverFile);

  var arena = {
    x: 50,
    y: 150,
    width: 700,
    height: 550
  };

  var box = 40;
  var bx = 60;
  var snekL = 1;
  var robL = 1;
  var lives = 2;
  var lifeX = 0;
  var lifeY = 0;
  var score = 0;
  var frameSkip = 15;
  var frameSkipped = 0;
  var frameIncrease = 1;

  var dir; //default snake immobile

  function karoMuster() {
    var count = 0;
    var karoX = 0;
    var karoY = 0;
    var m = 40;

    while (count <= 600) {
      s.line(karoX, count + m + 20, 640 + m, m + 20 + count);
      s.line(count + m + 20, karoY, m + 20 + count, 640 + m);
      count = count + m;
    }
  }

  function keydown() {
    let buttonUpPressed =
      s.mouseIsPressed &&
      s.mouseX > buttonUp.x0 &&
      s.mouseX < buttonUp.x1 &&
      s.mouseY > buttonUp.y0 &&
      s.mouseY < buttonUp.y1;
    let buttonDownPressed =
      s.mouseIsPressed &&
      s.mouseX > buttonDown.x0 &&
      s.mouseX < buttonDown.x1 &&
      s.mouseY > buttonDown.y0 &&
      s.mouseY < buttonDown.y1;
    let buttonLeftPressed =
      s.mouseIsPressed &&
      s.mouseX > buttonLeft.x0 &&
      s.mouseX < buttonLeft.x1 &&
      s.mouseY > buttonLeft.y0 &&
      s.mouseY < buttonLeft.y1;
    let buttonRightPressed =
      s.mouseIsPressed &&
      s.mouseX > buttonRight.x0 &&
      s.mouseX < buttonRight.x1 &&
      s.mouseY > buttonRight.y0 &&
      s.mouseY < buttonRight.y1;

    if ((s.keyIsDown(37) || buttonLeftPressed) && dir !== "right") {
      dir = "left";
    }
    if ((s.keyIsDown(38) || buttonUpPressed ) && dir !== "down") {
      dir = "up";
    }
    if ((s.keyIsDown(39) || buttonRightPressed) && dir !== "left") {
      dir = "right";
    }
    if ((s.keyIsDown(40) || buttonDownPressed) && dir !== "up") {
      dir = "down";
    }
  }
  function keyReleased() {
    // console.log("key - " + s.keyCode);
  }

  //setting keyboard controls, stop snakerino from reversing

  var food = {
    x: 400,
    y: 300,

    render: function() {
      // console.log(this.x, this.y);
      
      s.fill(250, 20, 20);
      s.ellipse(this.x, this.y, box, box);
    },
    eat: function() {
      frameSkip -= 0.2;
      if (frameSkip < 0) {
        frameSkip = 0
      }
      this.respawn()
    },
    respawn: function() {
      this.x =
        box + arena.x + ~~(Math.random() * (arena.width / box - 1)) * box; // Math.floor(Math.random() * 17 + 7) * box;
      this.y =
        box + arena.y + ~~(Math.random() * (arena.height / box - 1)) * box; //Math.floor(Math.random() * 15 + 11) * box;

      while ( this.x % box != 0) {
        this.x -= 10
      }
      while ( this.y % box != 0) {
        this.y -= 10
      }
    }
  };
  food.eat();

  var snake = {
    x: 200 + arena.x,
    y: 200 + arena.y,
    render: function() {
      // console.log(this.x, this.y);

      s.fill(200, 200, 200);
      //s.ellipse(this.x, this.y, box, box);
      for (var i = 0; i < snakeBody.length; i++) {
        s.ellipse(snakeBody[i].x, snakeBody[i].y, box, box);
      }
    }
  };

  function drawLevelBg() {
    s.clear();

    //slow down snake
    // s.frameRate(30);

    s.fill(30);
    s.stroke(250);
    s.rect(50, 150, 700, 550, 40);

    s.noStroke();
    s.rect(345, 100, 100, 100);

    //strokeWeight();
    s.fill(250);
    //karoMuster();
    s.image(careful, 280, 700, 230, 190);

    //headline
    s.image(headline, 220, 30, 350, 110);
    //score
    s.text("00" + score, 360, 170);
    s.image(scoreImg, 340, 70, 130, 80);
    s.textSize(40);
  }

  function moveSnake() {
    if (dir == "right") {
      snake.x = snake.x + box;
    }
    if (dir == "left") {
      snake.x = snake.x - box;
    }
    if (dir == "up") {
      snake.y = snake.y - box;
    }
    if (dir == "down") {
      snake.y = snake.y + box;
    }

    while ( snake.x % 40 != 0) {
      snake.x += 10
    }
    while ( snake.y % 40 != 0) {
      snake.y += 10
    }
    for (var i = 0; i < snakeBody.length; i++) {
      if (
        snakeBody.length != 1 &&
        snake.x == snakeBody[i].x &&
        snake.y == snakeBody[i].y
      ) {
        // console.log("ouch - 1 heart");
        sc = "gameOver";
        s.fill(250);
        console.log(snake);
      }

      if (snake.x >= 750 || snake.x <= 50 || snake.y <= 150 || snake.y >= 700) {
        sc = "gameOver";
      }
    }
    snakeBody.push({ x: snake.x, y: snake.y });
    if (snakeBody.length > snekL) {
      snakeBody.splice(0, 1);
    }


  }

  function drawArrowButton(constraints, direction ) {
    // console.log(constraints);
    
    const width =  constraints.x1 - constraints.x0
    const height = constraints.y1 - constraints.y0
    s.push()
    s.fill(255,255,255)
    s.strokeWeight(1)
    s.stroke(0,0,0)
    s.rect(constraints.x0, constraints.y0, width, height)
    s.fill(0,0,0)
    s.textSize(12)
    s.text(direction, constraints.x0 + width / 2 , constraints.y0 + height / 2 + 3 )
    s.pop()
  }

  function drawArrowButtons() {
    drawArrowButton(buttonUp, "↑")
    drawArrowButton(buttonDown, "↓")
    drawArrowButton(buttonLeft, "←")
    drawArrowButton(buttonRight, "→")
  }

  s.draw = () => {
    if (sc == "start") {
      s.background(0);
      s.image(start, 0, 0, 750, 790);

      if (
        s.mouseY >= 220 &&
        s.mouseY <= 460 &&
        s.mouseX >= 250 &&
        s.mouseY <= 610
      ) {
        s.image(startHover, 0, 0, 750, 790);
      }

      if (
        s.mouseY >= 220 &&
        s.mouseY <= 460 &&
        s.mouseX >= 250 &&
        s.mouseY <= 610 &&
        s.mouseIsPressed
      ) {
        sc = "level";
      }
    }

    if (sc == "level") {
      drawLevelBg();
      keydown();
      //s.noStroke(0);

      if (snake.x === food.x && snake.y === food.y) {
        snekL++;
        score++;
        sendScore(score);
        // console.log(score);
        food.eat();

      }

      food.render();
      snake.render();

      if (frameSkipped < ~~frameSkip) {
        frameSkipped += 1;
      } else {
        moveSnake();
        frameSkipped = 0;
      }
    }

    //first game over screen
    if (sc == "gameOver") {
      s.background(0);
      s.image(gameOver1, 0, 0, 750, 790);

      if (
        s.mouseY >= 220 &&
        s.mouseY <= 460 &&
        s.mouseX >= 250 &&
        s.mouseY <= 610
      ) {
        s.image(gameOver2, 0, 0, 750, 790);
      }
      if (
        s.mouseY >= 220 &&
        s.mouseY <= 460 &&
        s.mouseX >= 250 &&
        s.mouseY <= 610 &&
        s.mouseIsPressed
      ) {
        sc = "level";

        snakeBody.length = 1;
        frameSkip = 10
        snekL = 1;
        score = 0;
        lives = 2;
        dir = null;
        snake = {
          x: 80,
          y: 180,
          render: function() {
            s.fill(200, 200, 200);
            //s.ellipse(this.x, this.y, box, box);
            for (var i = 0; i < snakeBody.length; i++) {
              s.ellipse(snakeBody[i].x, snakeBody[i].y, box, box);
            }
          }
        };
      }
    }
    drawArrowButtons()
  };
}
