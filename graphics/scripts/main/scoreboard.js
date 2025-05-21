const sbEditTls = {
    teamA: gsap.timeline(),
    teamB: gsap.timeline(),
    flavorText: gsap.timeline()
};

activeRound.on('change', (newValue, oldValue) => {
    document.getElementById('team-a-score').text = newValue.teamA.score;
    document.getElementById('team-b-score').text = newValue.teamB.score;

    doOnDifference(newValue, oldValue, 'teamA.name', name => {
        sbEditTls['teamA'].add(textOpacitySwap(addDots(name), document.getElementById('team-a-name')));
    });

    doOnDifference(newValue, oldValue, 'teamB.name', name => {
        sbEditTls['teamB'].add(textOpacitySwap(addDots(name), document.getElementById('team-b-name')));
    });

    gsap.to('#team-a-color', {
        backgroundColor: newValue.teamA.color,
        duration: 0.35
    });

    gsap.to('#team-b-color', {
        backgroundColor: newValue.teamB.color,
        duration: 0.35
    });
});

const sbShowTl = new gsap.timeline();

scoreboardData.on('change', (newValue, oldValue) => {
    doOnDifference(newValue, oldValue, 'flavorText', flavorText => {
        sbEditTls['flavorText'].add(textOpacitySwap(flavorText, document.getElementById('scoreboard-flavor-text')));
    });

    doOnDifference(newValue, oldValue, 'isVisible', isVisible => {
        if (isVisible) {
            sbShowTl.add(gsap.fromTo('#scoreboard-wrapper', {y: -200}, {
                duration: 0.5,
                y: 0,
                ease: Back.easeOut,
                force3D: false
            }));
        } else {
            sbShowTl.add(gsap.fromTo('#scoreboard-wrapper', {y: 0}, {
                duration: 0.5,
                y: -200,
                ease: Back.easeIn,
                force3D: false
            }));
        }
    });
});
