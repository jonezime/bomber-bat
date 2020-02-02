const config = {
    width: 1900,
    height: 300,
    type: Phaser.AUTO,
    physics: {
        default: "arcade"
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let player;
let cursors;
let music;
var score = 0;
var scoreText;
let torchKeep;

function preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("wall", "assets/wall-small.png");
    this.load.image("bomb", "assets/bomb2.png");
    this.load.image("torch", "assets/torch.png");
    this.load.audio("music", "assets/music.ogg");
}

function create() {
    window.onload = function() {
        var context = new AudioContext();
        // Setup all nodes
      }

    music = this.sound.add("music");
    music.loop = true;
    music.play();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    player = this.physics.add.image(0, 0, "player");

    cursors = this.input.keyboard.createCursorKeys();

    this.walls = this.add.group({
        key: "wall",
        repeat: 11,
        setXY: {
            x: 60,
            y: 0,
            stepX: 150,
            stepY: 0
        }
    });

    this.bombs = this.add.group({
        key: "bomb",
        repeat: 11,
        setXY: {
            x: 120,
            y: 0,
            stepX: 150,
            stepY: 0
        }
    });

    this.torchs = this.add.group({
        key: "torch",
        repeat: 12,
        setXY: {
            x: 160,
            y: 10,
            stepX: 150,
            stepY: 25
        }
    });

    Phaser.Actions.Call(
        this.walls.getChildren(),
        function(enemy) {
            enemy.speed = Math.random() * 1 + 1;
        },
        this
    );

    Phaser.Actions.Call(
        this.bombs.getChildren(),
        function(enemy) {
            enemy.speed = Math.random() * 3 + 1;
        },
        this
    );
}

function update() {
    player.body.collideWorldBounds = true;

    player.setVelocityX(0);
    player.setVelocityY(50);

    if (cursors.up.isDown) {
        player.setVelocity(0, -150);
    }
    if (cursors.down.isDown) {
        player.setVelocity(0, 150);
    }
    if (cursors.left.isDown) {
        player.setVelocity(-200, 0);
    }
    if (cursors.right.isDown) {
        player.setVelocity(200, 0);
    }

    const moveObjects = enemies => {
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            if (enemy.y >= config.height - 28) {
                enemy.speed *= -1;
            } else if (enemy.y <= 0) {
                enemy.speed *= -1;
            }
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), enemy.getBounds())) {
                music.stop();
                this.game.restart();
            }
        });
    };

    const catchTorch = torchs => {
        torchs.forEach(torch => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), torch.getBounds())) {
                score += 10;
                scoreText.setText('Score: ' + score);
                torch.destroy();
            }
        });
    };

    moveObjects(this.walls.getChildren());
    moveObjects(this.bombs.getChildren());
    catchTorch(this.torchs.getChildren());
 }
