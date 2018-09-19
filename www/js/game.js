class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.spritesheet('bird', 'img/bird.png', { frameWidth: 50, frameHeight: 50 });
        this.load.image('pipe', 'img/pipe.png');
        this.load.image('pipe-up', 'img/pipe-up.png');
        this.load.image('pipe-down', 'img/pipe-down.png');
    }

    create() {
        window.addEventListener('resize', resize);
        resize();

        this.score = 0;
        this.labelScore = this.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff' }).setOrigin(0, 0);
        this.labelScore.setDepth(2);

        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('bird', { frames: [0, 1, 2, 1] }), frameRate: 6, repeat: -1 });
        this.anims.create({ key: 'die', frames: this.anims.generateFrameNumbers('bird', { frames: [0] }) });

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

    addOnePipe(x, y, typePipe) {
        var pipe;
        switch (typePipe) {
            case 'pipe-down': pipe = this.add.sprite(x, y, 'pipe-down').setOrigin(0, 0);
                break;
            case 'pipe-up': pipe = this.add.sprite(x, y, 'pipe-up').setOrigin(0, 0);
                break;
            case 'pipe': pipe = this.add.sprite(x, y, 'pipe').setOrigin(0, 0);
                break;
        }
        this.pipes.add(pipe);
        pipe.body.setVelocityX(-200);
        pipe.body.setAllowGravity(false);
        pipe.setDepth(0);
    }

    addRowofPipes() {
        const COLUMN_SIZE = 9;
        const PIPE_SIZE = 60;
        //Calcolre 3 dinamicamente (se l'altezza della webview è esattamente div per 60, allora non posso usare solo l'ultimo buco (-3), se è arrotondata per eccesso allora è (-4))
        var hole = Math.floor(Math.random() * (COLUMN_SIZE - 3)) + 1;
        for (var i = 0; i < COLUMN_SIZE; i++) {
            var pipeType = 'pipe';
            if (i != hole && i != hole + 1) {
                if (i == hole - 1) pipeType = 'pipe-up';
                else if (i == hole + 2) pipeType = 'pipe-down';
                this.addOnePipe(400, i * PIPE_SIZE, pipeType);
            }
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