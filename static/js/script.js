document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const diffBtns = document.querySelectorAll('.btn-diff');
    const startBtn = document.getElementById('start-btn');
    const guessBtn = document.getElementById('guess-btn');
    const guessInput = document.getElementById('guess-input');
    const rangeText = document.getElementById('range-text');
    const attemptsUi = document.getElementById('attempts-ui');
    const feedbackText = document.getElementById('feedback-text');
    const modal = document.getElementById('modal');

    // Audio
    const winSound = document.getElementById('sound-win');
    const loseSound = document.getElementById('sound-lose');

    let currentDifficulty = 'easy';

    // Start Game API Call
    const startGame = async () => {
        try {
            const res = await fetch('/api/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ difficulty: currentDifficulty })
            });
            const data = await res.json();

            // UI Updates
            rangeText.innerHTML = `Guess the number between <strong>${data.min}</strong> and <strong>${data.max}</strong>`;
            attemptsUi.innerText = data.max_attempts;
            feedbackText.innerText = '';
            feedbackText.className = '';

            guessInput.disabled = false;
            guessBtn.disabled = false;
            guessInput.value = '';
            guessInput.focus();

            startBtn.innerText = 'Restart Game';
        } catch (err) {
            console.error("Failed to start game", err);
        }
    };

    // Difficulty Selection
    diffBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            diffBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDifficulty = e.target.dataset.diff;
            await startGame();
        });
    });

    startBtn.addEventListener('click', startGame);

    // Auto-start on load
    startGame();

    // Handle Guess Submit
    const submitGuess = async () => {
        const guessVal = guessInput.value;
        if (!guessVal) return;

        try {
            const res = await fetch('/api/guess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guess: guessVal })
            });
            const data = await res.json();

            if (data.error) {
                showFeedback(data.error, 'high');
                shakeInput();
                return;
            }

            attemptsUi.innerText = data.attempts_left;

            if (data.status === 'correct') {
                showFeedback(`🎉 ${data.message} Score: ${data.score}`, 'correct');
                endGame(true, data.score, data.attempts_made);
            } else if (data.status === 'game_over') {
                showFeedback(`💀 ${data.message} The number was ${data.secret}.`, 'high');
                endGame(false);
            } else {
                const hint = data.status === 'high' ? 'Too High! 🔽' : 'Too Low! 🔼';
                showFeedback(hint, data.status);
                guessInput.value = '';
                guessInput.focus();
            }
        } catch (err) {
            console.error("Guess failed", err);
        }
    };

    guessBtn.addEventListener('click', submitGuess);
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });

    // Helper functions
    function showFeedback(msg, type) {
        feedbackText.innerText = msg;
        feedbackText.className = type;
        // Trigger reflow for animation restart
        void feedbackText.offsetWidth;
    }

    function shakeInput() {
        guessInput.classList.add('shake');
        setTimeout(() => guessInput.classList.remove('shake'), 300);
    }

    function endGame(won, score = 0, attempts = 0) {
        guessInput.disabled = true;
        guessBtn.disabled = true;

        if (won) {
            if (winSound) winSound.play().catch(e => { });
            setTimeout(() => {
                const name = prompt(`You won! Enter your name for the leaderboard (Score: ${score}):`) || 'Anonymous';
                saveScore(name, score, attempts);
            }, 1000);
        } else {
            if (loseSound) loseSound.play().catch(e => { });
        }
    }

    async function saveScore(name, score, attempts) {
        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, score, attempts })
        });
        loadLeaderboard();
    }

    // Leaderboard logic
    document.getElementById('leaderboard-btn').addEventListener('click', loadLeaderboard);
    document.querySelector('.close-btn').addEventListener('click', () => modal.classList.add('hidden'));

    async function loadLeaderboard() {
        const res = await fetch('/api/leaderboard');
        const scores = await res.json();

        const list = document.getElementById('score-list');
        list.innerHTML = '';

        if (scores.length === 0) {
            list.innerHTML = '<li>No scores yet. Be the first!</li>';
        } else {
            scores.forEach((s, idx) => {
                list.innerHTML += `
                    <li>
                        <span><strong>#${idx + 1}</strong> ${s.name}</span>
                        <span class="badge" style="color:var(--primary)">${s.score} pts</span>
                    </li>
                `;
            });
        }
        modal.classList.remove('hidden');
    }
});