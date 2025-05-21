let nextStageDate;
let lastNextStageDiff;
let nextStageDiffInterval;

function setNextStageTimer(time, diffChangeCallback) {
    function checkDiff() {
        const diff = Math.ceil(nextStageDate.diffNow(['minutes']).toObject().minutes);
        if (lastNextStageDiff !== diff) {
            lastNextStageDiff = diff;
            diffChangeCallback(diff);
        }
    }

    const newDate = luxon.DateTime.fromISO(time);

    if (newDate.toMillis() !== nextStageDate?.toMillis()) {
        nextStageDate = newDate;
        clearInterval(nextStageDiffInterval);

        checkDiff();
        nextStageDiffInterval = window.setInterval(checkDiff, 1000);
    }
}

const nextRoundTimeElem = document.getElementById('timer-text');

nextRoundTime.on('change', (newValue, oldValue) => {
    setNextStageTimer(newValue.startTime, diff => {
        if (diff < 1) {
            nextRoundTimeElem.innerHTML = 'Next round starts soon!';
        } else if (diff === 1) {
            nextRoundTimeElem.innerHTML = `Next round starts in <span id="mins-remaining">~${diff} minute...</span>`;
        } else {
            nextRoundTimeElem.innerHTML = `Next round starts in <span id="mins-remaining">~${diff} minutes...</span>`;
        }
    });

    doOnDifference(newValue, oldValue, 'isVisible', (isVisible) => {
        const elemHeight = isVisible ? 70 : 0;
        const elemOpacity = isVisible ? 1 : 0;
        gsap.to('.music-timer-wrapper > .timer', {
            duration: 0.5,
            height: elemHeight,
            opacity: elemOpacity,
            ease: Power2.easeInOut
        });

        if (!isVisible) {
            animMainLine(false);
        }

        if (musicShown.value && isVisible) {
            animMainLine(true);
        }
    });
});
