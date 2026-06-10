const nav = document.getElementById('main-navigation');
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.site-nav a');

function toggleNav() {
  if (!toggle || !nav) return;
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('closed');
}

if (toggle && nav) {
  toggle.addEventListener('click', toggleNav);
}

if (navLinks && navLinks.length) {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 720 && nav && !nav.classList.contains('closed')) {
        toggleNav();
      }
    });
  });
}

if (nav && toggle) {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720 && nav.classList.contains('closed')) {
      nav.classList.remove('closed');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('revealed'));
}

// ========== CHATBOT FUNCTIONALITY ==========

// Only initialize chatbot behavior if the expected DOM elements exist
const _chatbotToggle = document.getElementById('chatbotToggle');
const _chatbotClose = document.getElementById('chatbotClose');
const _chatbotPanel = document.getElementById('chatbotPanel');
const _chatbotInput = document.getElementById('chatbotInput');
const _chatbotSend = document.getElementById('chatbotSend');
const _chatbotMessages = document.getElementById('chatbotMessages');
const _chatbotSuggestions = document.getElementById('chatbotSuggestions');

// Chatbot responses
const responses = {
  'what do you do?': {
    reply: 'I design and build polished, high-performance web experiences. I specialize in front-end engineering, design systems, and creating interfaces that users love. From landing pages to web applications, I help turn ideas into elegant digital products.'
  },
  'availability?': {
    reply: 'I\u2019m available for freelance projects and collaborations. The best way to discuss your project timeline and needs is to email me directly at hello@mquaye700.com or check out my recent work to see if we\u2019re a good fit.'
  },
  'contact info?': {
    reply: 'You can reach me at hello@mquaye700.com or visit my GitHub at github.com/mquaye700. I typically respond within 24 hours. Looking forward to connecting!'
  },
  'about you': {
    reply: 'I\u2019m a designer and developer based in Accra, Ghana. I combine design thinking with front-end development to build websites that feel effortless and work reliably. I focus on user clarity, clean interactions, and measurable results.'
  },
  'expertise': {
    reply: 'My core expertise includes front-end engineering (JavaScript, modern CSS, responsive design), design systems, performance optimization, and product strategy. I\u2019m passionate about building scalable solutions and creating great user experiences.'
  },
  'projects': {
    reply: 'I\u2019ve worked on brand sites, conversion-driven landing pages, and product interface upgrades. Each project demonstrates thoughtful design, strong execution, and measurable value. Check out the \u201CRecent work\u201d section above to see examples.'
  },
  'services': {
    reply: 'I offer front-end development, design system creation, performance optimization, and product strategy consulting. Whether you need a new website or a product refresh, I can help turn your vision into reality.'
  },
  'experience': {
    reply: 'I\u2019ve spent the last several years building web experiences for startups and agencies. Currently, I\u2019m working as a Senior Front-end Developer, leading design-focused projects with emphasis on accessibility and performance.'
  }
};

function toggleChatbot() {
  if (!_chatbotPanel) return;
  _chatbotPanel.classList.toggle('active');
  if (_chatbotPanel.classList.contains('active')) {
    _chatbotInput && _chatbotInput.focus();
  }
}

function addMessage(text, isUser = false) {
  if (!_chatbotMessages) return;
  const messageEl = document.createElement('div');
  messageEl.className = isUser ? 'message user-message' : 'message bot-message';
  const p = document.createElement('p');
  p.textContent = text;
  messageEl.appendChild(p);
  _chatbotMessages.appendChild(messageEl);
  _chatbotMessages.scrollTop = _chatbotMessages.scrollHeight;
}

function getBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Direct match
  if (responses[lowerMessage]) {
    return responses[lowerMessage].reply;
  }
  
  // Partial match
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key.split('?')[0].toLowerCase()) || 
        key.includes(lowerMessage.split('?')[0])) {
      return value.reply;
    }
  }
  
  // Check for keywords
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return responses['contact info?'].reply;
  }
  if (lowerMessage.includes('do') || lowerMessage.includes('service') || lowerMessage.includes('build')) {
    return responses['what do you do?'].reply;
  }
  if (lowerMessage.includes('available') || lowerMessage.includes('hire') || lowerMessage.includes('work')) {
    return responses['availability?'].reply;
  }
  if (lowerMessage.includes('skill') || lowerMessage.includes('expert') || lowerMessage.includes('tech')) {
    return responses['expertise'].reply;
  }
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('project')) {
    return responses['projects'].reply;
  }
  
  // Default response
  return 'That\u2019s a great question! Feel free to email me at hello@mquaye700.com for more details, or explore my work above. I\u2019m happy to discuss how I can help!';
}

function sendMessage(message = null) {
  if (!_chatbotInput) return;
  const text = message || _chatbotInput.value.trim();
  
  if (!text) return;
  
  // Add user message
  addMessage(text, true);
  _chatbotInput.value = '';
  
  // Hide suggestions after first message
  if (_chatbotSuggestions && _chatbotSuggestions.style.display !== 'none') {
    _chatbotSuggestions.style.display = 'none';
  }
  
  // Simulate bot typing delay
  setTimeout(() => {
    const botResponse = getBotResponse(text);
    addMessage(botResponse, false);
  }, 500);
}

// Attach chatbot event listeners only if elements exist
if (_chatbotToggle && _chatbotClose && _chatbotSend && _chatbotInput) {
  _chatbotToggle.addEventListener('click', toggleChatbot);
  _chatbotClose.addEventListener('click', toggleChatbot);
  _chatbotSend.addEventListener('click', () => sendMessage());

  _chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Close chatbot when clicking outside if widget exists
  document.addEventListener('click', (e) => {
    const widget = document.getElementById('chatbotWidget');
    if (widget && !_chatbotPanel) return;
    if (widget && !_chatbotPanel.classList.contains('active')) return;
    if (widget && !widget.contains(e.target) && _chatbotPanel && _chatbotPanel.classList.contains('active')) {
      toggleChatbot();
    }
  });
}

// ========== GAME FUNCTIONALITY ==========

function startGame(gameType) {
  const modal = document.getElementById('gameModal');
  const gameContainer = document.getElementById('gameContainer');
  gameContainer.innerHTML = '';
  
  switch(gameType) {
    case 'rps':
      initRockPaperScissors(gameContainer);
      break;
    case 'memory':
      initMemoryGame(gameContainer);
      break;
    case 'guess':
      initNumberGuessing(gameContainer);
      break;
    case 'tictactoe':
      initTicTacToe(gameContainer);
      break;
    case 'colorclicker':
      initColorClicker(gameContainer);
      break;
    case 'wordscramble':
      initWordScramble(gameContainer);
      break;
  }
  
  modal.classList.add('active');
}

function closeGame() {
  const modal = document.getElementById('gameModal');
  modal.classList.remove('active');
}

// Close game modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('gameModal');
  if (e.target === modal) {
    closeGame();
  }
});

// ========== ROCK PAPER SCISSORS ==========
function initRockPaperScissors(container) {
  let playerScore = 0;
  let computerScore = 0;
  
  container.innerHTML = `
    <h2 class="game-title">🪨 Rock Paper Scissors</h2>
    <p class="game-description">Choose your move!</p>
    <div class="rps-container">
      <div class="rps-choices">
        <button class="rps-btn" onclick="playRPS('rock')">🪨 Rock</button>
        <button class="rps-btn" onclick="playRPS('paper')">📄 Paper</button>
        <button class="rps-btn" onclick="playRPS('scissors')">✂️ Scissors</button>
      </div>
      <div id="rpsResult" class="rps-result">Make your choice!</div>
      <div id="rpsScore" class="rps-score">Player: 0 | Computer: 0</div>
      <button class="rps-btn" style="margin-top: 1rem;" onclick="resetRPS()">Reset</button>
    </div>
  `;
  
  window.playRPS = function(choice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    const choiceEmoji = { rock: '🪨', paper: '📄', scissors: '✂️' };
    
    let result = '';
    if (choice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (choice === 'rock' && computerChoice === 'scissors') ||
      (choice === 'paper' && computerChoice === 'rock') ||
      (choice === 'scissors' && computerChoice === 'paper')
    ) {
      result = 'You win! 🎉';
      playerScore++;
    } else {
      result = 'Computer wins! 🤖';
      computerScore++;
    }
    
    document.getElementById('rpsResult').innerHTML = 
      `You chose ${choiceEmoji[choice]} | Computer chose ${choiceEmoji[computerChoice]}<br><strong>${result}</strong>`;
    document.getElementById('rpsScore').textContent = 
      `Player: ${playerScore} | Computer: ${computerScore}`;
  };
  
  window.resetRPS = function() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('rpsResult').innerHTML = 'Make your choice!';
    document.getElementById('rpsScore').textContent = 'Player: 0 | Computer: 0';
  };
}

// ========== MEMORY GAME ==========
function initMemoryGame(container) {
  const pairs = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉', '🍒', '🍑'];
  const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
  let flipped = [];
  let matched = [];
  let moves = 0;
  
  let html = `
    <h2 class="game-title">🧠 Memory Game</h2>
    <p class="game-description">Match the pairs!</p>
    <div class="memory-grid" id="memoryGrid"></div>
    <div class="memory-moves">Moves: <span id="moves">0</span></div>
    <button class="rps-btn" style="margin-top: 1rem;" onclick="location.reload()">Reset</button>
  `;
  
  container.innerHTML = html;
  const grid = container.querySelector('#memoryGrid');
  
  cards.forEach((card, index) => {
    const btn = document.createElement('button');
    btn.className = 'memory-card';
    btn.innerHTML = '?';
    btn.onclick = () => flipCard(btn, index);
    grid.appendChild(btn);
  });
  
  window.flipCard = function(btn, index) {
    if (flipped.length < 2 && !matched.includes(index) && !btn.classList.contains('flipped')) {
      btn.innerHTML = cards[index];
      btn.classList.add('flipped');
      flipped.push({ btn, index });
      
      if (flipped.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        if (cards[flipped[0].index] === cards[flipped[1].index]) {
          matched.push(flipped[0].index, flipped[1].index);
          flipped[0].btn.classList.add('matched');
          flipped[1].btn.classList.add('matched');
          flipped = [];
          
          if (matched.length === cards.length) {
            setTimeout(() => {
              alert(`You won in ${moves} moves! 🎉`);
            }, 500);
          }
        } else {
          setTimeout(() => {
            flipped[0].btn.innerHTML = '?';
            flipped[0].btn.classList.remove('flipped');
            flipped[1].btn.innerHTML = '?';
            flipped[1].btn.classList.remove('flipped');
            flipped = [];
          }, 1000);
        }
      }
    }
  };
}

// ========== NUMBER GUESSING ==========
function initNumberGuessing(container) {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  
  container.innerHTML = `
    <h2 class="game-title">🎲 Guess the Number</h2>
    <p class="game-description">I'm thinking of a number between 1 and 100</p>
    <div class="guess-container">
      <input type="number" class="guess-input" id="guessInput" min="1" max="100" placeholder="Enter your guess">
      <button class="guess-btn" onclick="submitGuess()">Submit</button>
      <div id="guessFeedback" class="guess-feedback">Start guessing!</div>
      <div id="guessStats" class="guess-stats">Attempts: 0</div>
    </div>
  `;
  
  window.submitGuess = function() {
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);
    
    if (!guess) {
      document.getElementById('guessFeedback').innerHTML = 'Please enter a valid number!';
      return;
    }
    
    attempts++;
    let feedback = '';
    
    if (guess === secretNumber) {
      feedback = `🎉 Correct! The number was ${secretNumber}. You did it in ${attempts} attempts!<br><button class="guess-btn" style="margin-top: 0.5rem;" onclick="location.reload()">Play Again</button>`;
    } else if (guess < secretNumber) {
      feedback = `📈 Too low! Try a higher number.`;
    } else {
      feedback = `📉 Too high! Try a lower number.`;
    }
    
    document.getElementById('guessFeedback').innerHTML = feedback;
    document.getElementById('guessStats').textContent = `Attempts: ${attempts}`;
    input.value = '';
    input.focus();
  };
  
  document.getElementById('guessInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') submitGuess();
  });
  
  document.getElementById('guessInput').focus();
}

// ========== TIC TAC TOE ==========
function initTicTacToe(container) {
  const board = Array(9).fill('');
  let gameActive = true;
  let currentPlayer = 'X';
  
  container.innerHTML = `
    <h2 class="game-title">⭕ Tic Tac Toe</h2>
    <p class="game-description">You are X, I am O</p>
    <div class="tictactoe-board" id="tictactoeBoard"></div>
    <div class="tictactoe-status" id="tictactoeStatus">Your turn (X)</div>
    <button class="rps-btn" style="margin-top: 1rem;" onclick="location.reload()">Reset</button>
  `;
  
  const boardElement = container.querySelector('#tictactoeBoard');
  
  board.forEach((_, index) => {
    const cell = document.createElement('button');
    cell.className = 'tictactoe-cell';
    cell.innerHTML = '';
    cell.onclick = () => playerMove(index);
    boardElement.appendChild(cell);
  });
  
  function checkWinner() {
    const winning = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    for (let combo of winning) {
      if (board[combo[0]] && board[combo[0]] === board[combo[1]] && board[combo[0]] === board[combo[2]]) {
        return board[combo[0]];
      }
    }
    return null;
  }
  
  function updateBoard() {
    boardElement.querySelectorAll('.tictactoe-cell').forEach((cell, index) => {
      cell.innerHTML = board[index];
    });
  }
  
  function computerMove() {
    let available = board.map((cell, i) => !cell ? i : null).filter(i => i !== null);
    if (available.length === 0) return;
    
    for (let i of available) {
      board[i] = 'O';
      if (checkWinner() === 'O') return;
      board[i] = '';
    }
    
    for (let i of available) {
      board[i] = 'X';
      if (checkWinner() === 'X') {
        board[i] = 'O';
        return;
      }
      board[i] = '';
    }
    
    const randomMove = available[Math.floor(Math.random() * available.length)];
    board[randomMove] = 'O';
  }
  
  window.playerMove = function(index) {
    if (!gameActive || board[index]) return;
    
    board[index] = 'X';
    updateBoard();
    
    let winner = checkWinner();
    if (winner) {
      document.getElementById('tictactoeStatus').innerHTML = winner === 'X' ? 'You won! 🎉<button class="rps-btn" style="margin-top: 0.5rem;" onclick="location.reload()">Play Again</button>' : 'I won! 🤖';
      gameActive = false;
      return;
    }
    
    if (!board.includes('')) {
      document.getElementById('tictactoeStatus').innerHTML = "It's a draw! 🤝<button class='rps-btn' style='margin-top: 0.5rem;' onclick='location.reload()'>Play Again</button>";
      gameActive = false;
      return;
    }
    
    document.getElementById('tictactoeStatus').textContent = 'My turn...';
    
    setTimeout(() => {
      computerMove();
      updateBoard();
      
      winner = checkWinner();
      if (winner) {
        document.getElementById('tictactoeStatus').innerHTML = 'I won! 🤖<button class="rps-btn" style="margin-top: 0.5rem;" onclick="location.reload()">Play Again</button>';
        gameActive = false;
        return;
      }
      
      if (!board.includes('')) {
        document.getElementById('tictactoeStatus').innerHTML = "It's a draw! 🤝<button class='rps-btn' style='margin-top: 0.5rem;' onclick='location.reload()'>Play Again</button>";
        gameActive = false;
        return;
      }
      
      document.getElementById('tictactoeStatus').textContent = 'Your turn (X)';
    }, 500);
  };
}

// ========== COLOR CLICKER ==========
function initColorClicker(container) {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  let score = 0;
  let timeLeft = 30;
  let gameActive = true;
  let gameStarted = false;
  
  function pickColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  function startGame() {
    gameStarted = true;
    const startBtn = document.querySelector('.colorclicker-startbtn');
    if (startBtn) startBtn.style.display = 'none';
    
    const countdown = setInterval(() => {
      timeLeft--;
      document.getElementById('timeLeft').textContent = timeLeft;
      
      if (timeLeft <= 0) {
        clearInterval(countdown);
        gameActive = false;
        document.getElementById('colorclickerDisplay').innerHTML = 
          `Game Over! Final Score: ${score}<br><button class="rps-btn" style="margin-top: 1rem;" onclick="location.reload()">Play Again</button>`;
        document.querySelector('.colorclicker-grid').innerHTML = '';
      }
    }, 1000);
    
    updateColorButtons();
  }
  
  function updateColorButtons() {
    if (!gameActive) return;
    
    const targetColor = pickColor();
    const grid = document.querySelector('.colorclicker-grid');
    grid.innerHTML = '';
    
    colors.forEach(color => {
      const btn = document.createElement('button');
      btn.className = 'colorclicker-btn';
      btn.style.backgroundColor = color;
      
      if (color === targetColor) {
        btn.onclick = () => {
          if (gameActive) {
            score++;
            document.getElementById('score').textContent = score;
            updateColorButtons();
          }
        };
      } else {
        btn.onclick = () => {
          if (gameActive) {
            gameActive = false;
            document.getElementById('colorclickerDisplay').innerHTML = 
              `Wrong color! Final Score: ${score}<br><button class="rps-btn" style="margin-top: 1rem;" onclick="location.reload()">Play Again</button>`;
            grid.innerHTML = '';
          }
        };
      }
      
      grid.appendChild(btn);
    });
  }
  
  container.innerHTML = `
    <h2 class="game-title">🌈 Color Clicker</h2>
    <p class="game-description">Click the correct color as fast as you can!</p>
    <div class="colorclicker-container">
      <div id="colorclickerDisplay" class="colorclicker-display">
        <button class="rps-btn colorclicker-startbtn" onclick="startGame()">Start Game</button>
      </div>
      <div class="colorclicker-grid" id="colorclickerGrid"></div>
      <div class="colorclicker-stats">
        Score: <span id="score">0</span> | Time: <span id="timeLeft">30</span>s
      </div>
    </div>
  `;
  
  window.startGame = startGame;
}

// ========== WORD SCRAMBLE ==========
function initWordScramble(container) {
  const words = [
    { word: 'javascript', hint: 'Programming language' },
    { word: 'computer', hint: 'Electronic device' },
    { word: 'website', hint: 'Online page' },
    { word: 'function', hint: 'Code block' },
    { word: 'variable', hint: 'Data container' },
    { word: 'element', hint: 'HTML component' },
    { word: 'button', hint: 'Clickable UI item' },
    { word: 'developer', hint: 'Code writer' },
    { word: 'design', hint: 'Visual layout' },
    { word: 'application', hint: 'Software program' }
  ];
  
  let currentWordObj = words[Math.floor(Math.random() * words.length)];
  let scrambled = currentWordObj.word.split('').sort(() => Math.random() - 0.5).join('');
  let attempts = 0;
  
  container.innerHTML = `
    <h2 class="game-title">📝 Word Scramble</h2>
    <p class="game-description">Unscramble the letters to find the word</p>
    <div class="wordscramble-container">
      <div class="wordscramble-word" id="scrambledWord">${scrambled}</div>
      <input type="text" class="wordscramble-input" id="wordscrambleInput" placeholder="Enter your answer">
      <button class="wordscramble-btn" onclick="submitWord()">Submit</button>
      <div id="wordscrambleFeedback" class="wordscramble-feedback">Good luck!</div>
      <div class="wordscramble-hint">Hint: ${currentWordObj.hint}</div>
    </div>
  `;
  
  window.submitWord = function() {
    const input = document.getElementById('wordscrambleInput');
    const guess = input.value.toLowerCase();
    attempts++;
    
    if (guess === currentWordObj.word) {
      document.getElementById('wordscrambleFeedback').innerHTML = 
        `🎉 Correct! The word was "${currentWordObj.word}"<br>You got it in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}!<br><button class="wordscramble-btn" style="margin-top: 1rem;" onclick="location.reload()">Next Word</button>`;
      input.disabled = true;
    } else {
      document.getElementById('wordscrambleFeedback').innerHTML = 
        `❌ That's not correct. Try again! (Attempt ${attempts})`;
    }
    
    input.value = '';
  };
  
  document.getElementById('wordscrambleInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') submitWord();
  });
  
  document.getElementById('wordscrambleInput').focus();
}

// ========== GEOGUESS-LIKE GAME ==========
(function() {
  // initialize game maps after DOM is ready to ensure containers have size
  document.addEventListener('DOMContentLoaded', () => {
    const makeBtn = document.getElementById('makeGuessBtn');
    if (!makeBtn) return; // page doesn't include the game UI

    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const nextBtn = document.getElementById('nextBtn');
    const resetBtn = document.getElementById('resetBtn');
    const roundEl = document.getElementById('round');
    const scoreEl = document.getElementById('score');

    if (typeof L === 'undefined') {
      const streetViewImage = document.getElementById('streetViewImage');
      if (streetViewImage) {
        streetViewImage.alt = 'Street View image cannot load because the map library is unavailable.';
      }
      return;
    }

    const googleStreetViewKey = ''; // Optional: add a Google Street View API key for true Street View imagery
    const streetViewImage = document.getElementById('streetViewImage');
    const streetViewLabel = document.getElementById('streetViewLabel');
    const streetViewStatus = document.getElementById('streetViewStatus');
    const streetViewPanel = document.getElementById('streetViewPanel');
    const guessMap = L.map('guessMap').setView([20, 0], 2);
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmOpts = { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors', errorTileUrl: '' };
    const guessTiles = L.tileLayer(osmUrl, osmOpts).addTo(guessMap);

    // ensure leaflet redraws correctly inside responsive layout
    setTimeout(() => { try { guessMap.invalidateSize(); } catch (e) {} }, 300);

    const streetViewLocations = [
      { label: 'New York, USA', coords: [40.748817, -73.985428] },
      { label: 'London, UK', coords: [51.507351, -0.127758] },
      { label: 'Tokyo, Japan', coords: [35.689487, 139.691711] },
      { label: 'Cape Town, South Africa', coords: [-33.924870, 18.424055] },
      { label: 'Accra, Ghana', coords: [5.603717, -0.186964] },
      { label: 'Paris, France', coords: [48.856613, 2.352222] },
      { label: 'Rio de Janeiro, Brazil', coords: [-22.906847, -43.172897] },
      { label: 'Sydney, Australia', coords: [-33.868820, 151.209290] },
      { label: 'Cairo, Egypt', coords: [30.044420, 31.235712] },
      { label: 'Mumbai, India', coords: [19.075983, 72.877655] },
      { label: 'Toronto, Canada', coords: [43.653225, -79.383186] },
      { label: 'Seoul, South Korea', coords: [37.566536, 126.977966] },
      { label: 'Mexico City, Mexico', coords: [19.432608, -99.133209] },
      { label: 'Dubai, UAE', coords: [25.204849, 55.270783] },
      { label: 'Berlin, Germany', coords: [52.520008, 13.404954] },
      { label: 'Nairobi, Kenya', coords: [-1.292066, 36.821945] },
      { label: 'Bangkok, Thailand', coords: [13.756331, 100.501762] },
      { label: 'Buenos Aires, Argentina', coords: [-34.603722, -58.381592] },
      { label: 'Istanbul, Turkey', coords: [41.008238, 28.978359] },
      { label: 'Madrid, Spain', coords: [40.416775, -3.703790] }
    ];
    let lastStreetIndex = null;

    function getRandomStreetLocation() {
      if (!streetViewLocations.length) {
        return [20, 0];
      }
      let index = Math.floor(Math.random() * streetViewLocations.length);
      if (index === lastStreetIndex) {
        index = (index + 1) % streetViewLocations.length;
      }
      lastStreetIndex = index;
      return streetViewLocations[index];
    }

    function streetImageFallback(location) {
      const query = encodeURIComponent(`${location.label} street`);
      return `https://source.unsplash.com/640x420/?${query}`;
    }

    function buildStreetViewSources(location) {
      const heading = Math.floor(Math.random() * 360);
      const sources = [];
      const query = encodeURIComponent(`${location.label} street`);

      if (googleStreetViewKey) {
        sources.push({
          url: `https://maps.googleapis.com/maps/api/streetview?size=640x420&location=${location.coords[0]},${location.coords[1]}&heading=${heading}&pitch=0&key=${googleStreetViewKey}`,
          label: `Google Street View at ${location.label}`,
          type: 'google'
        });
      }

      sources.push({
        url: `https://images.unsplash.com/photo-1494526585095-c41746248156?w=640&h=420&fit=crop&auto=format&fm=jpg&q=80&sig=${Date.now()}`,
        label: `Street photo fallback image`, 
        type: 'fallback'
      });

      sources.push({
        url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=420&fit=crop&auto=format&fm=jpg&q=80&sig=${Date.now()}`,
        label: `Street photo alternate fallback`, 
        type: 'fallback'
      });

      return sources;
    }

    function loadStreetViewSource(location, sources, index = 0) {
      if (!streetViewImage || !streetViewLabel || !streetViewPanel || !streetViewStatus) return;
      if (index >= sources.length) {
        streetViewImage.src = '';
        streetViewImage.alt = `Street photo could not be loaded for ${location.label}`;
        streetViewLabel.textContent = `Unable to load image`;
        streetViewStatus.textContent = `No available street image source could be loaded.`;
        streetViewPanel.classList.add('street-view-error');
        streetViewPanel.classList.remove('street-view-fallback');
        return;
      }

      const source = sources[index];
      const tester = new Image();
      tester.onload = () => {
        streetViewImage.src = source.url;
        streetViewImage.alt = source.label;
        streetViewLabel.textContent = source.type === 'google' ? location.label : `${location.label} (street photo)`;
        if (source.type === 'google') {
          streetViewStatus.textContent = `Google Street View image loaded from ${location.label}.`;
          streetViewPanel.classList.remove('street-view-fallback');
          streetViewPanel.classList.remove('street-view-error');
        } else {
          streetViewStatus.textContent = `Fallback street photo used because no Google API key is configured.`;
          streetViewPanel.classList.add('street-view-fallback');
          streetViewPanel.classList.remove('street-view-error');
        }
      };
      tester.onerror = () => {
        loadStreetViewSource(location, sources, index + 1);
      };
      tester.src = source.url;
    }

    function updateStreetViewImage(location) {
      if (!streetViewImage || !streetViewLabel || !streetViewPanel || !streetViewStatus) return;
      streetViewImage.alt = `Loading street view for ${location.label}...`;
      streetViewLabel.textContent = `Loading ${location.label}`;
      streetViewStatus.textContent = googleStreetViewKey ? 'Loading Google Street View...' : 'Loading fallback street photo; add a Google Street View API key for real Street View imagery.';
      streetViewPanel.classList.remove('street-view-error');
      streetViewPanel.classList.toggle('street-view-fallback', !googleStreetViewKey);
      const sources = buildStreetViewSources(location);
      loadStreetViewSource(location, sources, 0);
    }

  let trueLatLng = null;
  let trueMarker = null;
  let guessMarker = null;
  let connector = null;
  let guessing = false;
  let round = 0;
  let totalScore = 0;

  function toRadians(deg) { return deg * Math.PI / 180; }
  function haversine(a, b) {
    const lat1 = toRadians(a[0]);
    const lon1 = toRadians(a[1]);
    const lat2 = toRadians(b[0]);
    const lon2 = toRadians(b[1]);
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const R = 6371; // km
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function clearRoundLayers() {
    if (trueMarker) { guessMap.removeLayer(trueMarker); trueMarker = null; }
    if (guessMarker) { guessMap.removeLayer(guessMarker); guessMarker = null; }
    if (connector) { guessMap.removeLayer(connector); connector = null; }
  }

  function startNewRound() {
    clearRoundLayers();
    round += 1;
    roundEl.textContent = round;
    guessing = false;
    const location = getRandomStreetLocation();
    trueLatLng = location.coords;
    updateStreetViewImage(location);
    try { guessMap.setView([20, 0], 2); } catch (e) {}
  }
    makeBtn.addEventListener('click', () => {
    guessing = true;
    alert('Guess mode active: click the right-hand map to place your guess.');
  });

    guessMap.on('click', function(e) {
    if (!guessing) return;
    const latlng = [e.latlng.lat, e.latlng.lng];

    if (guessMarker) guessMap.removeLayer(guessMarker);
    guessMarker = L.marker(latlng).addTo(guessMap);

    const dist = haversine(trueLatLng, latlng); // km
    // scoring: closer = more points (arbitrary scale)
    const points = Math.max(0, Math.round(5000 - dist * 20));
    totalScore += points;
    scoreEl.textContent = totalScore;
    guessing = false;

    // show connector and popup
    if (connector) guessMap.removeLayer(connector);
    connector = L.polyline([latlng, trueLatLng], { color: 'red' }).addTo(guessMap);
    guessMarker.bindPopup(`Distance: ${dist.toFixed(1)} km<br>Points: ${points}`).openPopup();
  });

    showAnswerBtn.addEventListener('click', () => {
    if (!trueLatLng) return;
    if (trueMarker) { guessMap.removeLayer(trueMarker); }
    trueMarker = L.marker(trueLatLng, { title: 'Answer' }).addTo(guessMap).bindPopup('Answer').openPopup();

    if (connector) guessMap.fitBounds(connector.getBounds().pad(0.3));
    else guessMap.setView(trueLatLng, 3);
  });

    nextBtn.addEventListener('click', () => {
    startNewRound();
  });

    resetBtn.addEventListener('click', () => {
    totalScore = 0;
    round = 0;
    scoreEl.textContent = totalScore;
    roundEl.textContent = round;
    clearRoundLayers();
      try { guessMap.setView([20,0],2); } catch (e) {}
  });

  // Start first round
  startNewRound();
  });
})();
