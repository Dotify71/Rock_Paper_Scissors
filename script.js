let gr = ['Rock', 'Paper', 'Scissor'];
let gs = {
    Rock: 'Scissor',
    Scissor: 'Paper',
    Paper: 'Rock',
};

// Current Session State
let ps = 0;
let cs = 0;
let userHistory = []; 
let isGameOver = false;

// DOM Elements
let r = document.getElementById('result');
let s = document.getElementById('score');
let css = document.getElementById('cscore');
let historyBody = document.getElementById('history-body');

// Lifetime State
let lifetimeStats = JSON.parse(localStorage.getItem('rps-stats')) || { wins: 0, losses: 0, draws: 0 };

// Initialize
function init() {
    updateLifetimeDisplay();
}

function updateLifetimeDisplay() {
    let w = document.getElementById('life-wins');
    let l = document.getElementById('life-losses');
    let d = document.getElementById('life-draws');
    if(w) w.innerText = lifetimeStats.wins;
    if(l) l.innerText = lifetimeStats.losses;
    if(d) d.innerText = lifetimeStats.draws;
}

function saveLifetimeStats() {
    localStorage.setItem('rps-stats', JSON.stringify(lifetimeStats));
    updateLifetimeDisplay();
}

function clearLifetimeStats() {
    if(confirm("Are you sure you want to completely clear your lifetime stats?")) {
        lifetimeStats = { wins: 0, losses: 0, draws: 0 };
        saveLifetimeStats();
    }
}

function getSmartMove() {
    let aiSelect = document.getElementById('ai-difficulty');
    let mode = aiSelect ? aiSelect.value : 'normal';
    
    if (mode === 'normal' || userHistory.length < 3) {
        return gr[Math.floor(Math.random() * gr.length)];
    }
    
    // Hard Mode: Tally the last 5 moves to predict the next
    let recentMoves = userHistory.slice(-5);
    let counts = { Rock: 0, Paper: 0, Scissor: 0 };
    for (const move of recentMoves) { counts[move]++; }
    
    let highestCount = 0;
    let predictedUserMove = 'Rock';
    for (const move in counts) {
        if (counts[move] > highestCount) {
            highestCount = counts[move];
            predictedUserMove = move;
        }
    }
    
    // Pick the move that counters the user's predicted move
    if (predictedUserMove === 'Rock') return 'Paper'; // Paper beats Rock
    if (predictedUserMove === 'Paper') return 'Scissor'; // Scissor beats Paper
    if (predictedUserMove === 'Scissor') return 'Rock'; // Rock beats Scissor
    return 'Rock'; // Fallback
}

function resetGame() {
    ps = 0;
    cs = 0;
    isGameOver = false;
    userHistory = [];
    s.innerText = ps;
    css.innerText = cs;
    r.innerText = 'Make your move!';
    r.className = 'result-text';
    while (historyBody.firstChild) {
        historyBody.removeChild(historyBody.firstChild);
    }
}

function resetAll() {
    let seriesSelect = document.getElementById('series-mode');
    if (seriesSelect) seriesSelect.value = 'infinity';
    
    let aiSelect = document.getElementById('ai-difficulty');
    if (aiSelect) aiSelect.value = 'normal';
    
    resetGame();
}

function fireConfetti(isGrandWin = false) {
    if (typeof confetti === 'undefined') return;
    
    if (isGrandWin) {
        var duration = 3 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, { particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }, 250);
    } else {
        // Small burst for single round win
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 }
        });
    }
}

function game(me) {
    if (isGameOver) {
        resetGame();
        return;
    }

    let comp = getSmartMove();
    userHistory.push(me);
    
    let resultOutcome = '';
    
    // Reset animation classes
    r.className = 'result-text';
    void r.offsetWidth; 
    
    if (me === comp) {
        resultOutcome = 'Draw';
        r.innerText = "It's a Draw!";
        r.classList.add('result-draw');
        lifetimeStats.draws++;
    }
    else if (gs[me] === comp){
        resultOutcome = 'Win';
        r.innerText = 'You Win 🎉!';
        r.classList.add('result-win');
        ps++;
        lifetimeStats.wins++;
    }
    else {
        resultOutcome = 'Lose';
        r.innerText = 'Computer Wins!';
        r.classList.add('result-lose');
        cs++;
        lifetimeStats.losses++;
    }
    
    saveLifetimeStats();
    
    // Animate score change
    s.innerText = ps;
    css.innerText = cs;
    s.style.transform = 'scale(1.2)';
    css.style.transform = 'scale(1.2)';
    setTimeout(() => {
        s.style.transform = 'scale(1)';
        css.style.transform = 'scale(1)';
        s.style.transition = 'transform 0.2s';
        css.style.transition = 'transform 0.2s';
    }, 150);
    
    // Update history table
    if(historyBody) {
        let tr = document.createElement('tr');
        tr.style.opacity = '0';
        tr.style.transform = 'translateX(-10px)';
        tr.style.transition = 'all 0.3s ease';
        
        let tdUser = document.createElement('td');
        tdUser.textContent = getEmoji(me) + " " + me;
        
        let tdComp = document.createElement('td');
        tdComp.textContent = getEmoji(comp) + " " + comp;
        
        let tdResult = document.createElement('td');
        tdResult.textContent = resultOutcome;
        
        if (resultOutcome === 'Win') tdResult.classList.add('badge-win');
        else if (resultOutcome === 'Lose') tdResult.classList.add('badge-lose');
        else tdResult.classList.add('badge-draw');
        
        tr.appendChild(tdUser);
        tr.appendChild(tdComp);
        tr.appendChild(tdResult);
        
        historyBody.insertBefore(tr, historyBody.firstChild);
        
        setTimeout(() => {
            tr.style.opacity = '1';
            tr.style.transform = 'translateX(0)';
        }, 10);
    }

    // Check for Series Completion
    let seriesSelect = document.getElementById('series-mode');
    let seriesMode = seriesSelect ? seriesSelect.value : 'infinity';
    
    if (seriesMode !== 'infinity') {
        let targetScore = parseInt(seriesMode) === 3 ? 2 : 3;
        if (ps >= targetScore) {
            isGameOver = true;
            r.innerText = "🏆 YOU WON THE SERIES! 🏆";
            r.classList.remove('result-win'); // clear previous
            r.classList.add('result-win'); 
            r.style.transform = 'scale(1.15)';
            fireConfetti(true);
        } else if (cs >= targetScore) {
            isGameOver = true;
            r.innerText = "💀 COMPUTER WINS SERIES 💀";
            r.classList.remove('result-lose');
            r.classList.add('result-lose');
            r.style.transform = 'scale(1.15)';
        } else if (resultOutcome === 'Win') {
            fireConfetti(false);
        }
    } else {
        if (resultOutcome === 'Win') {
            fireConfetti(false);
        }
    }
}

function getEmoji(move) {
    if (move === 'Rock') return '👊';
    if (move === 'Paper') return '🖐️';
    if (move === 'Scissor') return '✌️';
    return '';
}

// Start
document.addEventListener('DOMContentLoaded', init);