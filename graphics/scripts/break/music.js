const songTextTl = gsap.timeline();
const songTextElem = document.getElementById('song-text');
const topBarMusicTl = gsap.timeline();
const topBarMusicElem = document.getElementById('info-row-music-text');

function isBlank(string) {
    string = String(string);
    return (string === 'undefined' || string === '');
}

function getSongName(rep) {
    if (isBlank(rep.artist) && isBlank(rep.song)) {
        return 'No song is playing.'
    }

    if (isBlank(rep.artist)) {
        return rep.song;
    } else if (isBlank(rep.song)) {
        return rep.artist;
    }

    return rep.artist + ' - ' + rep.song;
}

nowPlaying.on('change', newValue => {
    const songName = getSongName(newValue);

    songTextTl.add(textOpacitySwap(songName, songTextElem, [songTextElem.parentNode.querySelector('i')]));

    topBarMusicTl.add(gsap.to([topBarMusicElem, '#info-row-music-icon'], {
        opacity: 0, duration: 0.3, onComplete: function () {
            topBarMusicElem.text = songName;
        }
    }));

    topBarMusicTl.add(gsap.to([topBarMusicElem, '#info-row-music-icon'], {
        opacity: 1, duration: 0.3
    }));
});
NodeCG.waitForReplicants(nextRoundTime, musicShown).then(() => {
    musicShown.on('change', newValue => {
        const elemHeight = newValue ? 70 : 0;
        const elemOpacity = newValue ? 1 : 0;

        gsap.to('.music-timer-wrapper > .music', {
            duration: 0.5,
            height: elemHeight,
            opacity: elemOpacity,
            ease: Power2.easeInOut
        });

        if (!newValue) {
            animMainLine(false);
        }

        if (nextRoundTime.value.isVisible && newValue) {
            animMainLine(true);
        }
    });
});
