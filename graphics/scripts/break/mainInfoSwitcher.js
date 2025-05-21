const infoContainers = document.querySelectorAll('.scene.main-scene > .main-container');
let infoTl;

function setInfoSwitchAnim() {
    if (infoTl) {
        infoTl.kill();
    }
    infoTl = gsap.timeline({repeat: -1});

    for (let i = 0; i < infoContainers.length; i++) {
        const elem = infoContainers[i];

        const pauseDuration = i === 1 ? 15 : 45;

        infoTl.add(gsap.fromTo(elem, {opacity: 0, y: -50}, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: Back.easeOut,
            force3D: false
        }));
        infoTl.add(gsap.to({}, {duration: pauseDuration}));
        infoTl.add(gsap.to(elem, {opacity: 0, y: 50, duration: 0.5, ease: Back.easeIn, force3D: false}));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setInfoSwitchAnim();
});
