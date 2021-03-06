const config = {
  parent: "gameCss",
  width: 1200,
  height: 480,
  physics: {
    default: "arcade",
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

let player;
let cursors;
let music;
let score = 0;
let scoreText;
let life = 3;
let lifeText;
let winText;
let gameOverText;
let f5Text;
let finalScoreText;
const configSound = {
  mute: true,
  volume: 0.5,
};

/*----------PRELOAD------------ */

function preload() {
  this.load.image("player", "./assets/player.png");
  this.load.image("wall", "./assets/wall-small.png");
  this.load.image("bomb", "./assets/bomb2.png");
  this.load.image("torch", "./assets/torch.png");
  this.load.audio("music", "./assets/music.ogg");
}

/*----------CREATE------------ */

function create() {
  music = this.sound.add("music", configSound);
  music.loop = true;
  music.play();

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#FFF",
  });
  lifeText = this.add.text(16, 48, "Lifes: 3", {
    fontSize: "32px",
    fill: "#FFF",
  });

  player = this.physics.add.image(0, 100, "player");

  cursors = this.input.keyboard.createCursorKeys();

  this.walls = this.add.group({
    key: "wall",
    repeat: 7,
    setXY: {
      x: 60,
      y: 0,
      stepX: 150,
      stepY: 0,
    },
  });

  this.bombs = this.add.group({
    key: "bomb",
    repeat: 7,
    setXY: {
      x: 120,
      y: 0,
      stepX: 150,
      stepY: 0,
    },
  });

  this.torchs = this.add.group({
    key: "torch",
    repeat: 10,
    setXY: {
      x: 210,
      y: 50,
      stepX: 95,
      stepY: 40,
    },
  });

  Phaser.Actions.Call(
    this.walls.getChildren(),
    function (enemy) {
      enemy.speed = Math.random() * 6 + 1;
    },
    this
  );

  Phaser.Actions.Call(
    this.bombs.getChildren(),
    function (enemy) {
      life;
      enemy.speed = Math.random() * 6 + 1;
    },
    this
  );
}

/*----------UPDATE------------ */

function update() {
  player.body.collideWorldBounds = true;

  player.setVelocityX(0);
  player.setVelocityY(0);

  if (cursors.up.isDown) {
    player.setVelocity(0, -150);
  }
  if (cursors.down.isDown) {
    player.setVelocity(0, 150);
  }
  if (cursors.left.isDown) {
    player.setVelocity(-150, 0);
  }
  if (cursors.right.isDown) {
    player.setVelocity(150, 0);
  }

  const moveObjects = (enemies) => {
    enemies.forEach((enemy) => {
      enemy.y += enemy.speed;
      if (enemy.y >= config.height) {
        enemy.speed *= -1;
      } else if (enemy.y <= 0) {
        enemy.speed *= -1;
      }
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          player.getBounds(),
          enemy.getBounds()
        )
      ) {
        if (life > 1) {
          life--;
          lifeText.setText("Lifes: " + life);
          enemy.destroy();
        } else {
          lifeText.setText("Lifes: 0");
          gameOverText = this.add.text(320, 240, "Game Over", {
            fontSize: "100px",
            fill: "#FFF",
          });
          f5Text = this.add.text(320, 350, "Try again press F5", {
            fontSize: "50px",
            fill: "#FFF",
          });
          this.input.keyboard.enabled = false;
          score += 0;
          music.stop();
          this.game.start();
        }
      }
    });
  };

  const catchTorch = (torchs) => {
    torchs.forEach((torch) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          player.getBounds(),
          torch.getBounds()
        )
      ) {
        score += 10;
        scoreText.setText("Score: " + score);
        torch.destroy();
        scoreText.setText("Score: " + score);
        if (score == 110) {
          winText = this.add.text(320, 240, "You win !", {
            fontSize: "100px",
            fill: "#FFF",
          });
          f5Text = this.add.text(320, 350, "Try again press F5", {
            fontSize: "50px",
            fill: "#FFF",
          });
          this.input.keyboard.enabled = false;
          music.stop();
          this.game.start();
        }
      }
    });
  };

  moveObjects(this.walls.getChildren());
  moveObjects(this.bombs.getChildren());
  catchTorch(this.torchs.getChildren());
}
