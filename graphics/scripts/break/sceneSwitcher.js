const sceneTl = gsap.timeline();

activeBreakScene.on('change', (newValue, oldValue) => {
    if (!oldValue) {
        switch (newValue) {
            case 'main':
                hideStages();
                hideTeams();
                break;
            case 'teams':
                hideMainScene();
                hideStages();
                break;
            case 'stages':
                hideMainScene();
                hideTeams();
        }
    } else {
        switch (oldValue) {
            case 'main':
                hideMainScene();
                break;
            case 'teams':
                hideTeams();
                break;
            case 'stages':
                hideStages()
                break;
            default:

        }
    }

    switch (newValue) {
        case 'main':
            hideInfoBar('-=0.6');
            showMainScene();
            break;
        case 'teams':
            showInfoBar();
            showTeams();
            break;
        case 'stages':
            showInfoBar();
            showStages();
            break;
        default:

    }
});

function showMainScene() {
    toggleWaveHeight(false);
    sceneTl.add(gsap.to('.scene.main-scene', {duration: 0.5, opacity: 1}), '-=0.85');
}

function hideMainScene() {
    toggleWaveHeight(true);
    sceneTl.add(gsap.to('.scene.main-scene', {duration: 0.5, opacity: 0}), '-=0.85');
}

function toggleWaveHeight(expand) {
    const waveTop = expand ? -460 : 0;
    const coralY = expand ? 0 : 300;
    const position = expand ? '-=0' : '-=0.9';
    const coralEase = expand ? Power2.easeOut : Power2.easeIn;
    const coralDelay = expand ? 0.5 : 0;

    sceneTl.add(gsap.to('div.wave-wrapper', {top: waveTop, duration: 1.5, ease: Power3.easeInOut}), position);
    sceneTl.add(gsap.to('div.bottom-coral-wrapper', {
        y: coralY,
        duration: 0.75,
        delay: coralDelay,
        ease: coralEase
    }), '-=1.5');
}

function showInfoBar() {
    sceneTl.add(gsap.to('.info-bar-wrapper', {y: 0, opacity: 1, duration: 0.5, ease: Power2.easeOut}), '-=0.35');
}

function hideInfoBar(position = '-=0.0') {
    sceneTl.add(gsap.to('.info-bar-wrapper', {y: 100, opacity: 0, duration: 0.5, ease: Power2.easeIn}, position));
}

function showTeams() {
    sceneTl.add(gsap.fromTo('#team-a-wrapper', {y: -75, opacity: 0}, {
        y: 0,
        duration: 0.5,
        opacity: 1,
        ease: Back.easeOut,
        force3D: false
    }), '-=0.3');
    sceneTl.add(gsap.fromTo('#team-b-wrapper', {y: 75, opacity: 0}, {
        y: 0,
        duration: 0.5,
        opacity: 1,
        ease: Back.easeOut,
        force3D: false
    }), '-=0.5');
}

function hideTeams() {
    sceneTl.add(gsap.to('#team-a-wrapper', {y: 75, duration: 0.5, opacity: 0, ease: Back.easeIn}));
    sceneTl.add(gsap.to('#team-b-wrapper', {y: -75, duration: 0.5, opacity: 0, ease: Back.easeIn}), '-=0.5');
}

function showStages() {
    showStageElems(sceneTl, '-=0.3');
    sceneTl.add(gsap.to('.stages-scoreboard', {opacity: 1, y: 0, duration: 0.5, ease: Back.easeOut}), '-=0.75');
}

function hideStages() {
    hideStageElems(sceneTl);
    sceneTl.add(gsap.to('.stages-scoreboard', {opacity: 0, y: -50, duration: 0.5, ease: Back.easeIn}), '-=0.5');
}

function hideStageElems(timeline, callback = () => {
}) {
    timeline.add(gsap.to('.stage', {
        y: 75,
        ease: Back.easeIn,
        duration: 0.5,
        stagger: {from: "start", each: 0.05},
        opacity: 0,
        onComplete: () => {
            gsap.set('.stages-grid', {opacity: 0});
            callback();
        }
    }));
}

function showStageElems(timeline, startPos = '-=0.0') {
    timeline.add(gsap.fromTo('.stage', {opacity: 0, y: -75}, {
        y: 0,
        ease: Back.easeOut,
        duration: 0.5,
        opacity: 1,
        stagger: {from: "start", each: 0.05},
        onStart: function () {
            if (activeBreakScene.value === 'stages') {
                gsap.set('.stages-grid', {opacity: 1});
            }
        }
    }), startPos);
}
