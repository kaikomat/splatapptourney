const teamsTls = {
	'a': gsap.timeline(),
	'b': gsap.timeline()
}

NodeCG.waitForReplicants(activeRound).then(() => {
	activeRound.on('change', (newValue, oldValue) => {
		if (!oldValue) {
			setTeams(newValue.teamA, 'a');
			setTeams(newValue.teamB, 'b');
			return;
		}

		if (newValue.teamA.id !== oldValue.teamA.id) {
			setTeams(newValue.teamA, 'a');
		} else {
			doOnDifference(newValue, oldValue, 'teamA.showLogo', showLogo => {
				gsap.to('#team-a-image', {opacity: showLogo ? 0.2 : 0, duration: 0.35});
			});
		}

		if (newValue.teamB.id !== oldValue.teamB.id) {
			setTeams(newValue.teamB, 'b');
		} else {
			doOnDifference(newValue, oldValue, 'teamB.showLogo', showLogo => {
				gsap.to('#team-b-image', {opacity: showLogo ? 0.2 : 0, duration: 0.35});
			});
		}
	});
});

function setTeams(data, team) {
	const tl = teamsTls[team];

	const teamNameElem = document.getElementById(`team-${team}-name`);
	tl.add(gsap.to(teamNameElem, {
		opacity: 0, duration: 0.3, onComplete: function () {
			teamNameElem.text = addDots(data.name);
		}
	}));
	tl.add(gsap.to(teamNameElem, {opacity: 1, duration: 0.3}));

	const teamImageElem = document.getElementById(`team-${team}-image`);

	tl.add(gsap.to(teamImageElem, {
		opacity: 0, duration: 0.3, onComplete: () => {
			if (data.logoUrl === '' || data.logoUrl === undefined || data.logoUrl === null) {
				teamImageElem.style.backgroundImage = 'unset';
			} else {
				loadImage(data.logoUrl, () => {
					teamImageElem.style.backgroundImage = `url("${data.logoUrl}")`;
					if (data.showLogo) {
						tl.add(gsap.to(teamImageElem, {opacity: 0.2, duration: 0.3}));
					}
				});
			}
		}
	}), '-=0.6');

	const teamPlayersElem = document.getElementById(`team-${team}-players`);
	tl.add(gsap.to(teamPlayersElem, {
		opacity: 0, duration: 0.3, onComplete: function () {
			teamPlayersElem.innerHTML = '';
			for (let i = 0; i < data.players.length; i++) {
				const player = data.players[i];

				const playerNameElem = document.createElement('fitted-text');
				playerNameElem.classList.add('team-player');
				playerNameElem.text = addDots(player.name);
				playerNameElem.maxWidth = 445;

				teamPlayersElem.appendChild(playerNameElem);
			}
		}
	}), '-=0.6');
	tl.add(gsap.to(teamPlayersElem, {opacity: 1, duration: 0.3}), '-=0.3');
}

function loadImage(imageUrl, callback) {
	const imageLoaderElem = document.createElement("img");
	imageLoaderElem.src = imageUrl;

	imageLoaderElem.addEventListener('load', e => {
		callback();
	});
}
