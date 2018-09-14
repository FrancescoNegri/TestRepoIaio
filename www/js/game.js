class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('bird', 'img/bird.png');
        this.load.image('pipe', 'img/pipe.png');
    }

    create() {
        window.addEventListener('resize', resize);
        resize();

        this.score = 0;
        this.labelScore = this.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff'}).setOrigin(0, 0);

        this.bird = this.physics.add.sprite(100, 245, 'bird');
        this.bird.setOrigin(0, 0);
        this.bird.body.setOffset(this.bird.width / 2, this.bird.height / 2);

        this.pipes = this.physics.add.group();

        this.timer = this.time.addEvent({ delay: 1500, callback: this.addRowofPipes, callbackScope: this, loop: true });

        this.input.on('pointerdown', () => { this.jump() }, this);

        this.physics.add.overlap(this.bird, this.pipes, this.restart, null, this);
    }

    update() {
        if (this.bird.body.y < -this.bird.height / 2 || this.bird.y > 490 + this.bird.height / 2) this.restart();

        this.pipes.getChildren().forEach(pipe => {
            if (pipe.x + pipe.width < 0) this.pipes.kill(pipe);
        });
    }

    addOnePipe(x, y) {
        var pipe = this.add.sprite(x, y, 'pipe').setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.setVelocityX(-200);
        pipe.body.setAllowGravity(false);
    }

    addRowofPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) this.addOnePipe(400, i * 60 + 10);
        }
        this.score++;
        this.labelScore.text = this.score;
    }

    jump() {
        this.bird.body.velocity.y = -350;
    }

    restart() {
        GAME.scene.stop('GameScene');
        GAME.scene.run('GameScene');
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