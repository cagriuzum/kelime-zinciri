// Game Mode Configurations
const GAME_MODES = {
    klasik: {
        name: 'Klasik',
        rounds: 5,
        timeLimit: null,  // No time limit
        description: '5 tur, süre sınırı yok'
    },
    zamanlı: {
        name: 'Zamanlı',
        rounds: 5,
        timeLimit: 15,  // Default 15 seconds per turn (user can customize)
        description: '5 tur, kullanıcı belirli süre'
    }
};

// Game state
const gameState = {
    currentMode: 'klasik',
    currentPlayer: 1,
    round: 1,
    lastLetter: null,
    wordHistory: [],
    turnsInRound: 0,
    gameOver: false,
    timerInterval: null,
    timeRemaining: 0,
    customRounds: 5,  // User-defined number of rounds
    customTimeLimit: 15,  // User-defined time limit for zamanlı mode
    scores: { 1: 0, 2: 0 },  // Player scores
    playerNames: { 1: 'Oyuncu 1', 2: 'Oyuncu 2' }  // Player names
};

// DOM elements
const roundDisplay = document.getElementById('round');
const maxRoundsDisplay = document.getElementById('max-rounds');
const currentPlayerDisplay = document.getElementById('current-player');
const instructionText = document.getElementById('instruction-text');
const requiredLetter = document.getElementById('required-letter');
const wordInput = document.getElementById('word-input');
const submitBtn = document.getElementById('submit-btn');
const messageDiv = document.getElementById('message');
const spellingNoteDiv = document.getElementById('spelling-note');
const wordHistoryList = document.getElementById('word-history');
const gameOverScreen = document.getElementById('game-over');
const medalDiv = document.getElementById('medal');
const restartBtn = document.getElementById('restart-btn');
const timerDiv = document.getElementById('timer');
const timeLeftDisplay = document.getElementById('time-left');
const modeModal = document.getElementById('mode-modal');
const modeChoiceBtns = document.querySelectorAll('.mode-choice');
const rulesOpenBtn = document.getElementById('rules-open');
const rulesModal = document.getElementById('rules-modal');
const rulesCloseBtn = document.getElementById('rules-close');
const timeLimitModal = document.getElementById('time-limit-modal');
const timeLimitInput = document.getElementById('time-limit-input');
const timeLimitConfirmBtn = document.getElementById('time-limit-confirm');
const roundsModal = document.getElementById('rounds-modal');
const roundsInput = document.getElementById('rounds-input');
const roundsConfirmBtn = document.getElementById('rounds-confirm');
const scoreP1Display = document.getElementById('score-p1');
const scoreP2Display = document.getElementById('score-p2');
const playerNamesModal = document.getElementById('player-names-modal');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const namesConfirmBtn = document.getElementById('names-confirm');
const scoreP1Label = document.querySelector('.player-1-score .score-label');
const scoreP2Label = document.querySelector('.player-2-score .score-label');
const moodP1 = document.getElementById('mood-p1');
const moodP2 = document.getElementById('mood-p2');

// Initialize game
function init() {
    // Show mode setup modal first
    modeChoiceBtns[0].focus();

    submitBtn.addEventListener('click', handleSubmit);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    restartBtn.addEventListener('click', restartGame);

    // Time limit modal listeners
    timeLimitConfirmBtn.addEventListener('click', confirmTimeLimit);
    timeLimitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmTimeLimit();
        }
    });

    // Mode setup modal listeners
    modeChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            switchMode(btn.dataset.mode);
        });
    });
    rulesOpenBtn.addEventListener('click', showRulesModal);
    rulesCloseBtn.addEventListener('click', hideRulesModal);

    // Round setup modal listeners
    roundsConfirmBtn.addEventListener('click', confirmRounds);
    roundsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmRounds();
        }
    });

    // Player names modal listeners
    namesConfirmBtn.addEventListener('click', confirmPlayerNames);
    player1NameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            player2NameInput.focus();
        }
    });
    player2NameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmPlayerNames();
        }
    });
}

function showRulesModal() {
    rulesModal.classList.remove('hidden');
    rulesCloseBtn.focus();
}

function hideRulesModal() {
    rulesModal.classList.add('hidden');
    rulesOpenBtn.focus();
}

function showModeSelection() {
    stopTimer();
    gameState.gameOver = true;
    modeModal.classList.remove('hidden');
    roundsModal.classList.add('hidden');
    playerNamesModal.classList.add('hidden');
    timeLimitModal.classList.add('hidden');
    rulesModal.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    modeChoiceBtns[0].focus();
}

function startSetupFlow() {
    stopTimer();
    gameState.gameOver = true;
    modeModal.classList.add('hidden');
    roundsInput.value = 5;
    roundsModal.classList.remove('hidden');
    playerNamesModal.classList.add('hidden');
    timeLimitModal.classList.add('hidden');
    rulesModal.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    roundsInput.focus();
    roundsInput.select();
}

function confirmRounds() {
    const value = parseInt(roundsInput.value, 10);
    gameState.customRounds = value && value > 0 && value <= 50 ? value : 5;
    roundsModal.classList.add('hidden');

    if (gameState.currentMode === 'zamanlı') {
        showTimeLimitModal();
        return;
    }

    showPlayerNamesModal();
}

function showPlayerNamesModal() {
    playerNamesModal.classList.remove('hidden');
    player1NameInput.value = gameState.playerNames[1] === 'Oyuncu 1' ? '' : gameState.playerNames[1];
    player2NameInput.value = gameState.playerNames[2] === 'Oyuncu 2' ? '' : gameState.playerNames[2];
    player1NameInput.focus();
}

// Confirm player names and start game
function confirmPlayerNames() {
    const name1 = player1NameInput.value.trim() || 'Oyuncu 1';
    const name2 = player2NameInput.value.trim() || 'Oyuncu 2';

    gameState.playerNames[1] = name1;
    gameState.playerNames[2] = name2;

    // Update scoreboard labels
    scoreP1Label.textContent = name1;
    scoreP2Label.textContent = name2;

    playerNamesModal.classList.add('hidden');

    startNewGame();
}

// Switch game mode
function switchMode(mode) {
    if (!GAME_MODES[mode]) return;

    gameState.currentMode = mode;

    startSetupFlow();
}

// Show time limit input modal
function showTimeLimitModal() {
    timeLimitInput.value = gameState.customTimeLimit;
    timeLimitModal.classList.remove('hidden');
    timeLimitInput.focus();
    timeLimitInput.select();
}

// Confirm time limit and start game
function confirmTimeLimit() {
    const value = parseInt(timeLimitInput.value, 10);
    if (value && value > 0 && value <= 120) {
        gameState.customTimeLimit = value;
    } else {
        gameState.customTimeLimit = 15; // Default if invalid
    }
    timeLimitModal.classList.add('hidden');
    showPlayerNamesModal();
}

// Get current mode config
function getCurrentModeConfig() {
    return {
        ...GAME_MODES[gameState.currentMode],
        rounds: gameState.customRounds
    };
}

// Find the correct Turkish spelling of a word
function findCorrectSpelling(inputWord) {
    const normalized = inputWord.toLowerCase().trim();

    // If word exists directly, return it
    if (TURKISH_WORDS.has(normalized)) {
        return normalized;
    }

    // Try to find the matching word with Turkish characters
    return findMatchingWord(normalized, 0, '');
}

function findMatchingWord(word, index, builtWord) {
    if (index >= word.length) {
        if (TURKISH_WORDS.has(builtWord)) {
            return builtWord;
        }
        return null;
    }

    const char = word[index];
    const equivalents = CHAR_EQUIVALENTS[char] || [char];

    for (const eq of equivalents) {
        const result = findMatchingWord(word, index + 1, builtWord + eq);
        if (result) {
            return result;
        }
    }

    return null;
}

// Check if the input differs from the correct spelling
function hasSpellingDifference(input, correct) {
    return input.toLowerCase() !== correct.toLowerCase();
}

// Timer functions
function startTimer() {
    const config = getCurrentModeConfig();
    if (!config.timeLimit) return;

    stopTimer();
    // Use custom time limit for zamanlı mode
    gameState.timeRemaining = gameState.currentMode === 'zamanlı'
        ? gameState.customTimeLimit
        : config.timeLimit;
    updateTimerDisplay();
    timerDiv.classList.remove('hidden');

    gameState.timerInterval = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();

        if (gameState.timeRemaining <= 5) {
            timerDiv.classList.add('warning');
        }

        if (gameState.timeRemaining <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    timerDiv.classList.remove('warning');
}

function updateTimerDisplay() {
    timeLeftDisplay.textContent = gameState.timeRemaining;
}

function handleTimeUp() {
    stopTimer();
    showMessage(`Süre doldu! ${gameState.playerNames[gameState.currentPlayer]} kaybetti.`, 'error');

    // End the game when time runs out
    setTimeout(() => {
        endGame(true);
    }, 1500);
}

// Handle word submission
function handleSubmit() {
    if (gameState.gameOver) return;

    const word = wordInput.value.trim().toLowerCase();
    spellingNoteDiv.innerHTML = '';

    if (!word) {
        showMessage('Lütfen bir kelime girin.', 'error');
        return;
    }

    // Check if word starts with required letter (if not first turn)
    if (gameState.lastLetter) {
        const firstChar = word[0];
        if (!charactersMatch(gameState.lastLetter, firstChar)) {
            showMessage(`Kelime "${gameState.lastLetter.toUpperCase()}" harfi ile başlamalı!`, 'error');
            showErrorCross();
            wordInput.select();
            return;
        }
    }

    // Check if word is valid Turkish word
    if (!isValidTurkishWord(word)) {
        showMessage('Bu kelime sözlükte bulunamadı. Başka bir kelime deneyin.', 'error');
        showErrorCross();
        wordInput.select();
        return;
    }

    // Find the correct spelling
    const correctSpelling = findCorrectSpelling(word);

    // Check if word was already used (check both input and correct spelling)
    const wordToCheck = correctSpelling || word;
    if (gameState.wordHistory.some(entry => entry.word.toLowerCase() === wordToCheck)) {
        showMessage('Bu kelime daha önce kullanıldı!', 'error');
        showErrorCross();
        wordInput.select();
        return;
    }

    // Valid word - stop timer, add points, and add to history
    stopTimer();
    const finalWord = correctSpelling || word;
    const pointsEarned = addPoints(gameState.currentPlayer, finalWord);
    showPointsPopup(gameState.currentPlayer, pointsEarned);
    addWordToHistory(finalWord, pointsEarned);

    // Show spelling note if different
    if (correctSpelling && hasSpellingDifference(word, correctSpelling)) {
        spellingNoteDiv.innerHTML = `Doğru yazılışı: <span class="correct-spelling">${correctSpelling}</span>`;
    }

    // Update game state (use correct spelling for last letter)
    gameState.lastLetter = finalWord[finalWord.length - 1];
    gameState.turnsInRound++;

    const config = getCurrentModeConfig();

    // Check if round is complete (both players played)
    if (gameState.turnsInRound >= 2) {
        gameState.round++;
        gameState.turnsInRound = 0;

        // Check if game is complete
        if (gameState.round > config.rounds) {
            endGame();
            return;
        }
    }

    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;

    // Clear input and update display
    wordInput.value = '';
    showMessage('Doğru!', 'success');
    launchFireworks();
    updateDisplay();
    wordInput.focus();

    // Start timer for next turn if timed mode
    startTimer();
}

// Add word to history display
function addWordToHistory(word, points) {
    gameState.wordHistory.push({
        word: word,
        points: points,
        player: gameState.currentPlayer
    });

    const li = document.createElement('li');
    li.className = `player-${gameState.currentPlayer}`;
    li.innerHTML = `
        <span class="word-entry">
            <span class="word">${word}</span>
            <span class="word-points">+${points}</span>
        </span>
        <span class="player">${gameState.playerNames[gameState.currentPlayer]}</span>
    `;

    // Add to top of list
    if (wordHistoryList.firstChild) {
        wordHistoryList.insertBefore(li, wordHistoryList.firstChild);
    } else {
        wordHistoryList.appendChild(li);
    }
}

// Update display
function updateDisplay() {
    const config = getCurrentModeConfig();

    roundDisplay.textContent = Math.min(gameState.round, config.rounds);
    maxRoundsDisplay.textContent = config.rounds;
    currentPlayerDisplay.textContent = gameState.playerNames[gameState.currentPlayer];

    // Show/hide timer based on mode
    if (config.timeLimit) {
        timerDiv.classList.remove('hidden');
    } else {
        timerDiv.classList.add('hidden');
    }

    if (gameState.lastLetter) {
        instructionText.textContent = 'Şu harfle başlayan bir kelime girin:';
        requiredLetter.textContent = gameState.lastLetter.toUpperCase();
        requiredLetter.style.display = 'inline-block';
    } else {
        instructionText.textContent = 'Bir kelime girin';
        requiredLetter.style.display = 'none';
    }

    // Update player indicator color
    document.querySelector('.game-area').className =
        `game-area ${gameState.currentPlayer === 2 ? 'player-2' : ''}`;
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 1500);
    }
}

// Update score display
function updateScoreDisplay() {
    scoreP1Display.textContent = gameState.scores[1];
    scoreP2Display.textContent = gameState.scores[2];
    updateMoodEmojis();
}

// Update smiley/sad emojis based on who's leading
function updateMoodEmojis() {
    const s1 = gameState.scores[1];
    const s2 = gameState.scores[2];

    let emoji1, emoji2;
    if (s1 === 0 && s2 === 0) {
        emoji1 = '';
        emoji2 = '';
    } else if (s1 > s2) {
        emoji1 = '😄';
        emoji2 = '😢';
    } else if (s2 > s1) {
        emoji1 = '😢';
        emoji2 = '😄';
    } else {
        emoji1 = '😐';
        emoji2 = '😐';
    }

    setMoodEmoji(moodP1, emoji1);
    setMoodEmoji(moodP2, emoji2);
}

function setMoodEmoji(el, emoji) {
    if (el.textContent === emoji) return;
    el.textContent = emoji;
    el.classList.remove('pop');
    void el.offsetWidth; // restart animation
    if (emoji) el.classList.add('pop');
}

// Add points for a word
function addPoints(player, word) {
    const points = getWordScore(word);
    gameState.scores[player] += points;
    updateScoreDisplay();
    return points;
}

function getWordScore(word) {
    const normalizedWord = word.toLocaleLowerCase('tr-TR');
    if (normalizedWord.endsWith('mak') || normalizedWord.endsWith('mek')) {
        return Math.max(word.length - 3, 0);
    }
    return word.length;
}

// End game
function endGame(isTimeout = false) {
    stopTimer();
    gameState.gameOver = true;

    // Determine winner based on scores
    const s1 = gameState.scores[1];
    const s2 = gameState.scores[2];
    const name1 = gameState.playerNames[1];
    const name2 = gameState.playerNames[2];
    let winnerMessage;

    let hasWinner = true;
    if (s1 === s2) {
        winnerMessage = `Berabere! (${s1} - ${s2})`;
        hasWinner = false;
    } else if (isTimeout) {
        // Current player lost due to timeout, other player wins
        const loser = gameState.currentPlayer;
        const winner = loser === 1 ? 2 : 1;
        winnerMessage = `${gameState.playerNames[winner]} kazandı! (Süre doldu) - Skor: ${s1} - ${s2}`;
    } else if (s1 > s2) {
        winnerMessage = `${name1} kazandı! (${s1} - ${s2})`;
    } else if (s2 > s1) {
        winnerMessage = `${name2} kazandı! (${s2} - ${s1})`;
    }

    // Show or hide medal
    if (hasWinner) {
        medalDiv.classList.remove('hidden');
    } else {
        medalDiv.classList.add('hidden');
    }

    // Update game over message
    const gameOverMessage = gameOverScreen.querySelector('p');
    if (gameOverMessage) {
        gameOverMessage.textContent = winnerMessage;
    }

    gameOverScreen.classList.remove('hidden');
}

// Restart game (may show time limit modal for zamanlı mode)
function restartGame() {
    showModeSelection();
}

// Pick a random starting word from the dictionary
function getRandomStartingWord() {
    const wordsArray = Array.from(TURKISH_WORDS);
    // Filter words between 4-8 characters for good starting words
    const goodWords = wordsArray.filter(w => w.length >= 4 && w.length <= 8);
    const randomIndex = Math.floor(Math.random() * goodWords.length);
    return goodWords[randomIndex];
}

// Internal restart (after time limit is set)
function startNewGame() {
    stopTimer();

    gameState.currentPlayer = 1;
    gameState.round = 1;
    gameState.wordHistory = [];
    gameState.turnsInRound = 0;
    gameState.gameOver = false;
    gameState.scores = { 1: 0, 2: 0 };

    wordHistoryList.innerHTML = '';
    gameOverScreen.classList.add('hidden');
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    spellingNoteDiv.innerHTML = '';
    wordInput.value = '';
    updateScoreDisplay();

    // Update scoreboard labels with player names
    scoreP1Label.textContent = gameState.playerNames[1];
    scoreP2Label.textContent = gameState.playerNames[2];

    // Pick a random starting word
    const startingWord = getRandomStartingWord();
    gameState.lastLetter = startingWord[startingWord.length - 1];

    updateDisplay();
    wordInput.focus();

    // Start timer if timed mode
    startTimer();
}

// Show floating points popup at the current player's score badge
function showPointsPopup(player, points) {
    const scoreEl = player === 1 ? scoreP1Display : scoreP2Display;
    const rect = scoreEl.getBoundingClientRect();
    const color = player === 1 ? '#667eea' : '#764ba2';

    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = `+${points}`;
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.bottom}px`;
    popup.style.color = color;

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1150);
}

// Show animated error cross at the input area
function showErrorCross() {
    const cross = document.createElement('div');
    cross.className = 'error-cross';
    cross.textContent = '❌';

    const rect = wordInput.getBoundingClientRect();
    cross.style.left = `${rect.left + rect.width / 2}px`;
    cross.style.top = `${rect.top + rect.height / 2}px`;

    document.body.appendChild(cross);
    setTimeout(() => cross.remove(), 850);

    // Shake the input field
    wordInput.classList.remove('shake');
    void wordInput.offsetWidth; // force reflow to restart animation
    wordInput.classList.add('shake');
    setTimeout(() => wordInput.classList.remove('shake'), 400);
}

// Launch small fireworks from the input area
function launchFireworks() {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9F43'];
    const count = 22;
    const rect = wordInput.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';

        const angle = (i / count) * 2 * Math.PI;
        const distance = 50 + Math.random() * 90;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 5 + Math.random() * 6;

        particle.style.cssText =
            `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
            `background:${color};--dx:${dx}px;--dy:${dy}px;` +
            `animation-duration:${0.6 + Math.random() * 0.4}s;`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Start the game
init();
