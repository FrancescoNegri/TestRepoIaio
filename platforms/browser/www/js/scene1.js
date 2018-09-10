class Scene1 extends Phaser.Scene {
    constructor() {
        super({key: 'Scene1'});
    }
    
    preload() {
        this.load.atlas('sheet', 'img/sheet.png', 'img/sheet.json');
    }
    
    create() {
        window.addEventListener('resize', resize);
        resize();

        this.anims.create({
            key: 'plane',
            repeat: -1,
            frameRate: 10,
            frames: this.anims.generateFrameNames('sheet', { start: 1,  end: 3, prefix: 'planeBlue', suffix: '.png' })
        });

        this.bg = this.add.tileSprite(0, 0, 800, 480, 'sheet', 'background.png').setOrigin(0);
        var plane = this.add.sprite(400, 300, 'sheet').play('plane');
    }    

    update() {
        this.bg.tilePositionX += 5;
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