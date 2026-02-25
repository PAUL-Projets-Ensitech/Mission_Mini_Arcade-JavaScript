const joueur = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const affichageScore = document.getElementById('score');
const affichageStatut = document.getElementById('status');
const boutonRejouer = document.getElementById('restart');
const zoneJeu = document.getElementById('game');

let enSaut = false;
let partieTerminee = true;
let score = 0;
let minuteurCollision = null;
let minuteurScore = null;

const cleMeilleurScore = 'runnerBestScore';
let meilleurScore = Number(localStorage.getItem(cleMeilleurScore)) || 0;

const afficherScores = () => {
	affichageScore.textContent = `Points : ${score} | Record : ${meilleurScore}`;
};

const sauter = () => {
	if (enSaut || partieTerminee) {
		return;
	}
	enSaut = true;
	joueur.classList.add('jump');
	setTimeout(() => {
		joueur.classList.remove('jump');
		enSaut = false;
	}, 550);
};

const demarrerPartie = () => {
	partieTerminee = false;
	score = 0;
	affichageStatut.textContent = '';
	afficherScores();
	enSaut = false;
	joueur.classList.remove('jump');
	obstacle.classList.remove('moving');
	obstacle.style.animation = 'none';
	void obstacle.offsetHeight;
	obstacle.style.animation = '';
	obstacle.classList.add('moving');
	obstacle.style.animationPlayState = 'running';

	if (minuteurCollision) {
		clearInterval(minuteurCollision);
	}
	if (minuteurScore) {
		clearInterval(minuteurScore);
	}

	minuteurCollision = setInterval(() => {
		const rectJoueur = joueur.getBoundingClientRect();
		const rectObstacle = obstacle.getBoundingClientRect();

		const hitJoueur = {
			left: rectJoueur.left + 6,
			right: rectJoueur.right - 6,
			top: rectJoueur.top + 6,
			bottom: rectJoueur.bottom - 2
		};

		const hitObstacle = {
			left: rectObstacle.left + 4,
			right: rectObstacle.right - 4,
			top: rectObstacle.top + 4,
			bottom: rectObstacle.bottom - 4
		};

		const collision = !(
			hitJoueur.right < hitObstacle.left ||
			hitJoueur.left > hitObstacle.right ||
			hitJoueur.bottom < hitObstacle.top ||
			hitJoueur.top > hitObstacle.bottom
		);

		if (collision) {
			terminerPartie();
		}
	}, 20);

	minuteurScore = setInterval(() => {
		if (!partieTerminee) {
			score += 1;
			afficherScores();
		}
	}, 200);
};

const terminerPartie = () => {
	partieTerminee = true;
	obstacle.style.animationPlayState = 'paused';
	affichageStatut.textContent = 'Perdu... Clique sur le bouton pour rejouer.';
	if (score > meilleurScore) {
		meilleurScore = score;
		localStorage.setItem(cleMeilleurScore, String(meilleurScore));
		afficherScores();
	}
	clearInterval(minuteurCollision);
	clearInterval(minuteurScore);
};

document.addEventListener('keydown', (event) => {
	if (event.code === 'Space') {
		event.preventDefault();
		sauter();
	}
});

zoneJeu.addEventListener('click', sauter);
boutonRejouer.addEventListener('click', demarrerPartie);

affichageStatut.textContent = 'Clique sur Jouer pour commencer !';
afficherScores();