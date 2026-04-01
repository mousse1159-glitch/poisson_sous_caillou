// ── TIMER CONFIG ──
const TOTAL_SECONDS = 35 * 60; // 35 minutes
const WARNING_THRESHOLD = 10 * 60; // 10 min restantes → orange
const CRITICAL_THRESHOLD = 5 * 60; // 5 min restantes → rouge

let secondsLeft = TOTAL_SECONDS;
let isRunning = false;
let timerInterval = null;
let penalties = 0;

// ── DOM REFS ──
const timerDisplay = document.getElementById('timerDisplay');
const progressFill = document.getElementById('progressFill');
const glowRing = document.getElementById('glowRing');
const startBtn = document.getElementById('startBtn');
const btnIcon = document.getElementById('btnIcon');
const btnLabel = document.getElementById('btnLabel');
const penaltyCount = document.getElementById('penaltyCount');
const endOverlay = document.getElementById('endOverlay');

// ── FORMAT TIME ──
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── UPDATE UI ──
function updateDisplay() {
    timerDisplay.textContent = formatTime(secondsLeft);

    // Progress bar (100% → 0%)
    const ratio = secondsLeft / TOTAL_SECONDS;
    progressFill.style.width = `${ratio * 100}%`;

    // Color states
    const isCritical = secondsLeft <= CRITICAL_THRESHOLD;
    const isWarning = secondsLeft <= WARNING_THRESHOLD && !isCritical;

    timerDisplay.classList.toggle('warning', isWarning);
    timerDisplay.classList.toggle('critical', isCritical);
    glowRing.classList.toggle('warning', isWarning);
    glowRing.classList.toggle('critical', isCritical);

    // Progress bar color
    if (isCritical) {
        progressFill.style.background = 'linear-gradient(90deg, #c0392b, #e74c3c)';
    } else if (isWarning) {
        progressFill.style.background = 'linear-gradient(90deg, #e67e22, #f39c12)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #c9a84c, #f0cc6e)';
    }
}

// ── TICK ──
function tick() {
    if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        secondsLeft = 0;
        updateDisplay();
        showEndOverlay();
        return;
    }
    secondsLeft--;
    updateDisplay();
}

// ── START / PAUSE ──
function toggleTimer() {
    if (isRunning) {
        // Pause
        clearInterval(timerInterval);
        isRunning = false;
        btnIcon.textContent = '▶';
        btnLabel.textContent = 'REPRENDRE';
        startBtn.classList.remove('playing');
    } else {
        // Start
        if (secondsLeft <= 0) return;
        timerInterval = setInterval(tick, 1000);
        isRunning = true;
        btnIcon.textContent = '⏸';
        btnLabel.textContent = 'PAUSE';
        startBtn.classList.add('playing');
    }
}

// ── RESET ──
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    secondsLeft = TOTAL_SECONDS;
    penalties = 0;
    penaltyCount.textContent = '0';
    btnIcon.textContent = '▶';
    btnLabel.textContent = 'DÉMARRER';
    startBtn.classList.remove('playing');
    endOverlay.classList.remove('visible');
    updateDisplay();
}

// ── PENALTY (+2 min deduit du temps) ──
function addPenalty() {
    penalties++;
    penaltyCount.textContent = penalties;
    // Enlève 2 minutes du temps restant
    secondsLeft = Math.max(0, secondsLeft - 120);
    updateDisplay();
    // Flash d'avertissement
    timerDisplay.style.transition = 'none';
    timerDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => {
        timerDisplay.style.transform = 'scale(1)';
        timerDisplay.style.transition = 'color 0.5s ease, text-shadow 0.5s ease';
    }, 150);
}

// ── END OVERLAY ──
function showEndOverlay() {
    endOverlay.classList.add('visible');
}

// ── INIT ──
updateDisplay();
