document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        autoResize: true,
        parent: 'game',
        width: 800,
        height: 480,
        scene: [ Scene1 ]
    };
    
    GAME = new Phaser.Game(config);
    
    
});

if (!window.cordova) {
    window.dispatchEvent('deviceready');
}