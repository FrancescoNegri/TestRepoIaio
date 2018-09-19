class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.spritesheet('bird', 'img/bird.png', { frameWidth: 50, frameHeight: 50 });
        this.load.image('pipe', 'img/pipe.png');
    }

    create() {
        window.addEventListener('resize', resize);
        resize();

        this.score = 0;
        this.labelScore = this.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff' }).setOrigin(0, 0);
        this.labelScore.setDepth(2);

        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('bird', { frames: [0, 1, 2, 1] }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'die', frames: this.anims.generateFrameNumbers('bird', { frames: [0] })});

        this.bird = this.physics.add.sprite(100, 245, 'bird').play('fly');
        //this.bird.setOrigin(-.2, .5);
        //this.bird.body.setOffset(this.bird.width / 2 + 12, this.bird.height / 2 - 25);
        this.bird.body.setSize(35, 35);
        this.bird.alive = true;
        this.bird.setDepth(1);

        this.pipes = this.physics.add.group();

        this.timer = this.time.addEvent({ delay: 1500, callback: this.addRowofPipes, callbackScope: this, loop: true });

        this.input.on('pointerdown', () => { this.jump() }, this);

        this.physics.add.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    }

    update() {
        if (this.bird.body.y < -this.bird.height / 2 || this.bird.y > 490 + this.bird.height / 2) this.restart();

        this.pipes.getChildren().forEach(pipe => {
            if (pipe.x + pipe.width < 0) this.pipes.kill(pipe);
        });

        if (this.bird.angle < 20) this.bird.angle++;
    }

    addOnePipe(x, y) {
        var pipe = this.add.sprite(x, y, 'pipe').setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.setVelocityX(-200);
        pipe.body.setAllowGravity(false);
        pipe.setDepth(0);
    }

    addRowofPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) this.addOnePipe(400, i * 60 + 10);
        }
        this.score++;
        this.labelScore.text = this.score - 1;
    }

    jump() {
        if (this.bird.alive) {
            this.bird.body.velocity.y = -350;
            var animation = this.tweens.add({
                targets: this.bird, angle: -20, duration: 100, callback: () => {
                    console.log(this.bird.angle);
                }
            });
        }
    }

    restart() {
        GAME.scene.stop('GameScene');
        GAME.scene.run('GameScene');
    }

    hitPipe() {
        if (this.bird.alive) {
            this.bird.play('die');
            this.bird.alive = false;

            this.timer.destroy();

            this.pipes.getChildren().forEach(pipe => {
                pipe.body.setVelocityX(0);
            });
        }
    }
}

function resize() {
    var canvas = GAME.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;

    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}  