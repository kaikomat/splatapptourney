const topBarInfoRows = document.querySelectorAll('.info-bar > .info-row');
let topInfoTl;

function setTopBarAnim() {
	const switchDelay = 10;

	if (topInfoTl) {
		topInfoTl.kill();
	}
	topInfoTl = gsap.timeline({repeat: -1});

	for (let i = 0; i < topBarInfoRows.length; i++) {
		const elem = topBarInfoRows[i];

		if (!musicShown.value && elem.classList.contains('info-row-music')) {
			gsap.set(elem, {opacity: 0});
			continue;
		}

		topInfoTl.add(gsap.fromTo(elem, {opacity: 0, y: -50}, {
			opacity: 1,
			y: 0,
			duration: 0.3,
			ease: Back.easeOut,
			force3D: false
		}));

		if (elem.classList.contains('info-row-commentators')) {
			const commentatorElems = elem.querySelectorAll('.commentators');

			for (let i = 0; i < commentatorElems.length; i++) {
				const elem = commentatorElems[i]

				topInfoTl.add(gsap.fromTo(elem, {opacity: 0}, {opacity: 1, duration: 0.3}), '-=0.3');
				topInfoTl.add(gsap.to({}, {duration: switchDelay / 2}));
				if (i !== commentatorElems.length - 1) {
					topInfoTl.add(gsap.to(elem, {opacity: 0, duration: 0.3}), '+=0.3');
				}
			}
		} else {
			topInfoTl.add(gsap.to({}, {duration: switchDelay}));
		}

		topInfoTl.add(gsap.to(elem, {opacity: 0, y: 50, duration: 0.3, ease: Back.easeIn, force3D: false}));
	}
}

musicShown.on('change', newValue => {
	setTopBarAnim();
});

document.addEventListener('DOMContentLoaded', () => {
	setTopBarAnim();
});
