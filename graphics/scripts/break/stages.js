const stagesElem = document.getElementById("stages-grid");
const stagesTl = gsap.timeline();

function getUpdatedGames(newActiveRound, oldActiveRound) {
	const gamesWithIndex = newActiveRound.games.map((game, index) => ({
		index,
		...game,
	}));

	if (!oldActiveRound || newActiveRound.match.id !== oldActiveRound.match.id) {
		return {
			isNewMatch: true,
			isFirstLoad: !oldActiveRound,
			changedGames: gamesWithIndex,
		};
	}

	return {
		isNewMatch: false,
		isFirstLoad: false,
		changedGames: gamesWithIndex.filter((game, index) => {
			const oldGame = oldActiveRound.games[index];
			return game.stage !== oldGame.stage || game.mode !== oldGame.mode;
		}),
	};
}

function getUpdatedWinners(newActiveRound, oldActiveRound) {
	const winners = newActiveRound.games.map((game, index) => ({
		index,
		winner: game.winner,
		oldWinner: oldActiveRound?.games[index]?.winner,
	}));

	if (!oldActiveRound || newActiveRound.match.id !== oldActiveRound.match.id) {
		return winners;
	}

	return winners.filter((winner) => {
		const oldGame = oldActiveRound.games[winner.index];
		return (
			winner.winner !== oldGame.winner ||
			(winner.winner === "alpha" &&
				newActiveRound.teamA.name !== oldActiveRound.teamA.name) ||
			(winner.winner === "bravo" &&
				newActiveRound.teamB.name !== oldActiveRound.teamB.name)
		);
	});
}

function getWinnerName(activeRound, winner) {
	return addDots(
		winner === "alpha" ? activeRound.teamA.name : activeRound.teamB.name
	);
}

function getStageUrl(stageName) {
	return assetPaths.value.stageImages[stageName] ?? "imgs/rr-unknown-stage.png";
}

const teamANameElem = document.getElementById("team-a-name-scoreboard");
const teamBNameElem = document.getElementById("team-b-name-scoreboard");
const teamAScoreElem = document.getElementById("team-a-score-scoreboard");
const teamBScoreElem = document.getElementById("team-b-score-scoreboard");

NodeCG.waitForReplicants(activeRound, assetPaths).then(() => {
	activeRound.on("change", (newValue, oldValue) => {
		doOnDifference(newValue, oldValue, "teamA.name", (name) => {
			textOpacitySwap(addDots(name), teamANameElem);
		});
		doOnDifference(newValue, oldValue, "teamB.name", (name) => {
			textOpacitySwap(addDots(name), teamBNameElem);
		});

		teamAScoreElem.text = newValue.teamA.score;
		teamBScoreElem.text = newValue.teamB.score;

		const games = getUpdatedGames(newValue, oldValue);
		const winners = getUpdatedWinners(newValue, oldValue);

		updateGames(games, winners);

		if (!games.isNewMatch) {
			setWinners(winners);
		}
	});
});

async function updateGames(games, winners) {
	if (games.changedGames.length <= 0) return;

	const stageElementIds = games.changedGames
		.map((game) => `#stage_${game.index}`)
		.join(", ");
	const target = games.isNewMatch ? "#stages-grid > .stage" : stageElementIds;
	const tl = gsap.timeline({
		defaults: {
			force3D: false,
			immediateRender: false,
		},
	});

	function createStageElems() {
		if (games.isNewMatch) {
			const modeTextMaxWidth = { 3: 352, 5: 250, 7: 190 }[
				games.changedGames.length
			];
			stagesElem.classList.remove(
				"stage-count-3",
				"stage-count-5",
				"stage-count-7"
			);
			stagesElem.classList.add(`stage-count-${games.changedGames.length}`);
			stagesElem.innerHTML = games.changedGames.reduce((prev, game) => {
				prev += `
                    <div class="stage flex-align-center" id="stage_${game.index}" style="opacity: 0">
						<img class="stage-decor-icon" src="${getWinnerIconLink(game.winner)}">
						<div class="accent"></div>
						<div class="stage-content">
							<div class="stage-image"
								style="background-image: url('${getStageUrl(game.stage)}'); filter: saturate(1)">
							</div>
							<div class="stage-text">
								<div
								 	class="stage-winner-wrapper flex-align-center" 
								 	id="winner_${game.index}"
								>
									<div class="stage-winner"></div>
								</div>
								<div class="stage-info">
									<fitted-text
										class="stage-mode"
										text="${game.mode}"
										max-width="${modeTextMaxWidth}">
									</fitted-text>
									<div class="stage-line"></div>
									<div class="stage-name">${game.stage}</div>
								</div>
							</div>
						</div>
					</div>                
                `;

				return prev;
			}, "");
			setWinners(winners);
		} else {
			games.changedGames.forEach((game) => {
				const stageElem = document.getElementById(`stage_${game.index}`);

				stageElem.querySelector(".stage-image").style.backgroundImage =
					`url('${getStageUrl(game.stage)}')`;
				stageElem.querySelector(".stage-mode").text = game.mode;
				stageElem.querySelector(".stage-name").innerText = game.stage;
			});
		}

		if (activeBreakScene.value === "stages") {
			tl.fromTo(
				target,
				{
					y: -75,
				},
				{
					duration: 0.5,
					ease: Back.easeOut,
					y: 0,
					opacity: 1,
					stagger: { from: "start", each: 0.05 },
				}
			);
		}
	}

	await Promise.all(
		games.changedGames.map((game) => loadImagePromise(getStageUrl(game.stage)))
	);

	if (!games.isFirstLoad && activeBreakScene.value === "stages") {
		tl.to(target, {
			duration: 0.5,
			ease: Back.easeIn,
			y: 75,
			opacity: 0,
			stagger: { from: "start", each: 0.05 },
			onComplete: createStageElems,
		});
	} else {
		createStageElems();
	}

	stagesTl.add(tl);
}

function setWinners(winners) {
	winners.forEach((winner) => {
		const winnerElem = document.getElementById(`winner_${winner.index}`);
		const winnerText = winnerElem.querySelector(".stage-winner");
		const stageElem = document.getElementById(`stage_${winner.index}`);
		const iconElem = stageElem.querySelector(".stage-decor-icon");

		if (winner.winner !== "none") {
			const winnerName = getWinnerName(activeRound.value, winner.winner);
			const iconLink = getWinnerIconLink(winner.winner);

			if (
				(winner.winner === "alpha" && winner.oldWinner === "bravo") ||
				(winner.winner === "bravo" && winner.oldWinner === "alpha") ||
				winner.winner === winner.oldWinner
			) {
				textOpacitySwap(winnerName, winnerText);
				gsap.to(iconElem, {
					opacity: 0,
					duration: 0.35,
					onComplete: () => {
						iconElem.src = iconLink;
					},
				});
				gsap.to(iconElem, { opacity: 1, duration: 0.35, delay: 0.35 });
			} else {
				winnerText.innerText = winnerName;
				iconElem.src = iconLink;
			}

			if (winner.oldWinner === "none") {
				gsap.to(iconElem, { opacity: 1, duration: 0.35, delay: 0.1 });
			}
		} else {
			gsap.to(iconElem, { duration: 0.35, opacity: 0 });
		}

		gsap.to(winnerElem, {
			duration: 0.35,
			opacity: winner.winner === "none" ? 0 : 1,
		});
	});
}

function getWinnerIconLink(winner) {
	switch (winner) {
		case "alpha":
			return "imgs/snake.svg";
		case "bravo":
			return "imgs/shell.svg";
		default:
			return "imgs/question-mark.svg";
	}
}
