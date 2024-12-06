// Variables pour suivre l'état du timer
let timerInterval;
let currentPhase = 'Travail'; // Peut être 'Travail', 'Repos', ou 'Repos entre séries'
let roundsRemaining;
let seriesRemaining;
let pausedTime = null; // Temps restant lors de la pause
let pausedPhase = null; // Phase en cours lors de la pause

// Chargement des fichiers audio
const audioStart = new Audio('start-sound.mp3');
const audioHalfway = new Audio('halfway-sound.mp3');
const audioEnd = new Audio('end-sound.mp3');

// Fonction pour démarrer le timer
function startTimer() {
    const workTime = parseInt(document.getElementById('work-time').value, 10);
    const restTime = parseInt(document.getElementById('rest-time').value, 10);
    const seriesRestTime = parseInt(document.getElementById('series-rest-time').value, 10);

    if (pausedTime !== null && pausedPhase !== null) {
        // Reprendre à partir de l'état actuel
        resumeTimer(workTime, restTime, seriesRestTime);
    } else {
        roundsRemaining = parseInt(document.getElementById('rounds').value, 10);
        seriesRemaining = parseInt(document.getElementById('series').value, 10);
        hideSettings();
        updateRoundsRemaining();
        updateSeriesRemaining();
        startWorkPhase(workTime, restTime, seriesRestTime);
    }
}

function resumeTimer(workTime, restTime, seriesRestTime) {
    if (pausedPhase === 'Travail') {
        startWorkPhase(workTime, restTime, seriesRestTime);
    } else if (pausedPhase === 'Repos') {
        startRestPhase(restTime, seriesRestTime);
    } else if (pausedPhase === 'Repos entre séries') {
        startSeriesRestPhase(seriesRestTime);
    }
}

function startWorkPhase(workTime, restTime, seriesRestTime) {
    currentPhase = 'Travail';
    updateStatus('Travail');
    updateBackgroundColor('green');

    let seconds = pausedPhase === 'Travail' && pausedTime !== null ? pausedTime : workTime;
    pausedTime = null;
    pausedPhase = null;

    audioStart.play();

    timerInterval = setInterval(() => {
        if (seconds === Math.floor(workTime / 2)) {
            audioHalfway.play();
        }

        updateTimerDisplay(seconds);
        seconds--;

        if (seconds < 0) {
            clearInterval(timerInterval);
            if (roundsRemaining > 1) {
                roundsRemaining--;
                updateRoundsRemaining();
                startRestPhase(restTime, seriesRestTime);
            } else if (seriesRemaining > 1) {
                seriesRemaining--;
                updateSeriesRemaining();
                startSeriesRestPhase(seriesRestTime);
            } else {
                updateStatus('Terminé');
                updateBackgroundColor('');
                audioEnd.play();
                showSettings();
            }
        }
    }, 1000);
}

function startRestPhase(restTime, seriesRestTime) {
    currentPhase = 'Repos';
    updateStatus('Repos');
    updateBackgroundColor('red');

    let seconds = pausedPhase === 'Repos' && pausedTime !== null ? pausedTime : restTime;
    pausedTime = null;
    pausedPhase = null;

    audioStart.play();

    timerInterval = setInterval(() => {
        if (seconds === Math.floor(restTime / 2)) {
            audioHalfway.play();
        }

        updateTimerDisplay(seconds);
        seconds--;

        if (seconds < 0) {
            clearInterval(timerInterval);
            startWorkPhase(
                parseInt(document.getElementById('work-time').value, 10),
                restTime,
                seriesRestTime
            );
        }
    }, 1000);
}

function startSeriesRestPhase(seriesRestTime) {
    currentPhase = 'Repos entre séries';
    updateStatus('Repos entre séries');
    updateBackgroundColor('orange');

    let seconds = pausedPhase === 'Repos entre séries' && pausedTime !== null ? pausedTime : seriesRestTime;
    pausedTime = null;
    pausedPhase = null;

    audioStart.play();

    timerInterval = setInterval(() => {
        if (seconds === Math.floor(seriesRestTime / 2)) {
            audioHalfway.play();
        }

        updateTimerDisplay(seconds);
        seconds--;

        if (seconds < 0) {
            clearInterval(timerInterval);
            roundsRemaining = parseInt(document.getElementById('rounds').value, 10);
            updateRoundsRemaining();
            startWorkPhase(
                parseInt(document.getElementById('work-time').value, 10),
                parseInt(document.getElementById('rest-time').value, 10),
                seriesRestTime
            );
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = remainingSeconds.toString().padStart(2, '0');
}

function updateStatus(status) {
    document.querySelector('.status').textContent = status;
}

function updateBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function updateRoundsRemaining() {
    document.getElementById('rounds-remaining').textContent = roundsRemaining;
}

function updateSeriesRemaining() {
    document.getElementById('series-remaining').textContent = seriesRemaining;
}

function hideSettings() {
    document.getElementById('settings').style.display = 'none';
    document.querySelector('.rounds-remaining').style.display = 'block';
    document.querySelector('.series-remaining').style.display = 'block';
}

function showSettings() {
    document.getElementById('settings').style.display = 'flex';
    document.querySelector('.rounds-remaining').style.display = 'none';
    document.querySelector('.series-remaining').style.display = 'none';
}

// Fonction pour mettre en pause le timer
function pauseTimer() {
    clearInterval(timerInterval);
    const minutes = parseInt(document.getElementById('minutes').textContent, 10);
    const seconds = parseInt(document.getElementById('seconds').textContent, 10);
    pausedTime = minutes * 60 + seconds;
    pausedPhase = currentPhase;
}

// Réinitialiser le timer
function resetTimer() {
    clearInterval(timerInterval);
    pausedTime = null;
    pausedPhase = null;
    updateBackgroundColor('');
    updateTimerDisplay(0);
    updateStatus('Travail');
    document.getElementById('rounds-remaining').textContent = document.getElementById('rounds').value;
    document.getElementById('series-remaining').textContent = document.getElementById('series').value;
    showSettings();
}

// Gestion des boutons
document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
