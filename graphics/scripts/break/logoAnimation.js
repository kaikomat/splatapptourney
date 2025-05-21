const logoAnimApp = new PIXI.Application({
    view: document.getElementById('logo-text-canvas'),
    width: 900,
    height: 240,
    backgroundAlpha: 0
});

const textures = [];

for (let i = 1; i <= 6; i++) {
    const texture = PIXI.Texture.from(`imgs/logo-animation/logo${i}.png`);
    textures.push(texture);
}

const animSprite = new PIXI.AnimatedSprite(textures, true);
animSprite.width = 960;
animSprite.height = 240;
animSprite.loop = true;
animSprite.animationSpeed = 0.05;

logoAnimApp.stage.addChild(animSprite);

document.addEventListener('DOMContentLoaded', () => {
    animSprite.play();
});
