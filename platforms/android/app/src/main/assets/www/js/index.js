document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        autoResize: true,
        parent: 'game',
        width: 400,
        height: 490,
        scene: [ GameScene ],
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
                gravity: { y: 1000 }
            }
        },
        backgroundColor: '#71c5cf',
        pixelArt: true
    };
    
    GAME = new Phaser.Game(config);
    
    
});

if (!window.cordova) {
    window.dispatchEvent('deviceready');
}