function animMainLine(show) {
    const lineMargin = show ? 15 : 0;
    const lineHeight = show ? 5 : 0;
    const lineOpacity = show ? 1 : 0;

    gsap.to('.music-timer-wrapper > .line', {
        duration: 0.5,
        height: lineHeight,
        opacity: lineOpacity,
        ease: Power2.easeInOut,
        margin: `${lineMargin}px 0`
    });
}
