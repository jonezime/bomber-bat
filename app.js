const config = {
    width: 1900,
    height: 480,
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
let score = 0;
let scoreText;
let life = 3;
let lifeText;
let winText;
let gameOverText;
let f5Text;

function preload() {
    this.load.image("player", "/assets/player.png");
    this.load.image("wall", "/assets/wall-small.png");
    this.load.image("bomb", "/assets/bomb2.png");
    this.load.image("torch", "/assets/torch.png");
    this.load.audio("music", "/assets/music.ogg");
}

function create() {
    music = this.sound.add("music");
    music.loop = true;
    music.play();

    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#FFF" });
    lifeText = this.add.text(16, 48, "Life: 3", { fontSize: "32px", fill: "#FFF" });

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
            y: 20,
            stepX: 150,
            stepY: 40
        }
    });

    Phaser.Actions.Call(
        this.walls.getChildren(),
        function(enemy) {
            enemy.speed = Math.random() * 4 + 1;
        },
        this
    );

    Phaser.Actions.Call(
        this.bombs.getChildren(),
        function(enemy) {
            enemy.speed = Math.random() * 7 + 1;
        },
        this
    );
}

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

    const moveObjects = enemies => {
        enemies.forEach(enemy => {
            enemy.y += enemy.speed;
            if (enemy.y >= config.height - 28) {
                enemy.speed *= -1;
            } else if (enemy.y <= 0) {
                enemy.speed *= -1;
            }
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), enemy.getBounds())) {
                if (life > 1) {
                    life--;
                    console.log(life);
                    lifeText.setText("Life: " + life);
                    enemy.destroy();
                } else {
                    lifeText.setText("Life: 0");
                    gameOverText = this.add.text(620, 240, "Game Over", { fontSize: "100px", fill: "#FFF" });
                    f5Text = this.add.text(620, 350, "Try again press F5", { fontSize: "50px", fill: "#FFF" });
                    this.input.keyboard.enabled = false;
                    score += 0;
                    music.stop();
                    this.game.start();
                }
            }
        });
    };

    const catchTorch = torchs => {
        torchs.forEach(torch => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), torch.getBounds())) {
                score += 10;
                scoreText.setText("Score: " + score);
                torch.destroy();
                scoreText.setText("Score: " + score);
                if (score == 120) {
                    winText = this.add.text(620, 240, "You win !", { fontSize: "100px", fill: "#FFF" });
                    f5Text = this.add.text(620, 350, "Try again press F5", { fontSize: "50px", fill: "#FFF" });
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
