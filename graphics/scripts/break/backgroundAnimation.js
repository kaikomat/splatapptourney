// Don't ask me how it works, I don't know either. :)
// Respects to https://codepen.io/osublake/pen/QVozey
const shaderFrag = `
  precision mediump float;
  varying vec2 vTextureCoord;
  
  uniform sampler2D uSampler;  
  uniform float time;
  uniform float frequency;
  uniform float amplitude;
  uniform float amplitudeY;
  uniform float speed;

  void main() {    
    vec2 position = vTextureCoord;    
    float distortion = sin(position.y * frequency + time * speed) * amplitude;
    float distortion2 = sin(position.y * frequency + time * speed) * amplitudeY;
    gl_FragColor = texture2D(uSampler, vec2(position.x + distortion, position.y + distortion2));
  }`

wavify(document.getElementById('wave-path'), {
    height: -500,
    bones: 3,
    amplitude: 50,
    color: 'var(--background-1-dark)',
    speed: 0.10
});

const coralTileScrollTl = gsap.timeline({repeat: -1});

coralTileScrollTl.to('div.coral-wrapper', {
    duration: 15,
    ease: Power0.easeNone,
    backgroundPosition: '400px 1300px'});



const bottomCoralApp = new PIXI.Application({
    view: document.getElementById('bottom-coral-canvas'),
    width: 1920,
    height: 285,
    backgroundAlpha: 0
});

const filter = new PIXI.Filter(null, shaderFrag);
filter.uniforms.frequency = 50;
filter.uniforms.amplitude = 0.0050;
filter.uniforms.amplitudeY = 0.0010;
filter.uniforms.speed = 1.0;
filter.uniforms.time = 1.0;

const sprite1 = createCoralSprite('imgs/coral-pattern-a.png', 10);

const sprite2 = createCoralSprite('imgs/coral-pattern-b.png', 1590);

bottomCoralApp.stage.addChild(sprite1);
bottomCoralApp.stage.addChild(sprite2);

bottomCoralApp.ticker.add(function(delta) {
    filter.uniforms.time += 0.05 * delta;
});

function createCoralSprite(imgSource, posX) {
    let sprite = PIXI.Sprite.from(imgSource);
    sprite.width = 400;
    sprite.height = 285;
    sprite.position.x = posX;
    sprite.filters = [filter];

    return sprite;
}
