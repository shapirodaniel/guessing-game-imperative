/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
    let rand = Math.ceil(Math.random() * 100);
    while (rand === this.winningNumber) {
        rand = Math.ceil(Math.random() * 100);
    }
    return rand;
}
function newGame() {
    return new Game();
}
function shuffle(arr) {
    let remaining = arr.length, temp, curr;
    while (remaining) {
        curr = Math.floor(Math.random() * remaining--);
        temp = arr[remaining];
        arr[remaining] = arr[curr];
        arr[curr] = temp;
    }
    return arr;
}
class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }
    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }
    isLower() {
        return this.playersGuess < this.winningNumber ? 
            true : false;
    }
    playersGuessSubmission(num) {
        num = Number(num);
        if (num < 1 || num > 100 || isNaN(num)) {
            throw 'That is an invalid guess.';
        }
        this.playersGuess = num;
        return this.checkGuess();
    }
    checkGuess() {
        // update guesses before checking if lost!
        let won = this.playersGuess === this.winningNumber;
        let alreadyGuessed = this.pastGuesses.includes(this.playersGuess);
        let novelGuess = !this.pastGuesses.includes(this.playersGuess) && this.playersGuess !== this.winningNumber;
        if (novelGuess) {this.pastGuesses.push(this.playersGuess);}
        // adjust guess count, reveal winning node if lost
        let lost = this.pastGuesses.length === 5;
        let burningUp = this.difference() < 10
        let lukeWarm = this.difference() < 25;
        let bitChilly = this.difference() < 50;
        let iceCold = this.difference() < 100;
        if (lost) {game.revealWinningNode();}
        // return game message
        switch (true) {
            case won:               return 'You Win!';
            case alreadyGuessed:    return 'You have already guessed that number.'; 
            case lost:              return 'You Lose.';
            case burningUp:         return "You\'re burning up!";
            case lukeWarm:          return 'You\'re lukewarm.';
            case bitChilly:         return 'You\'re a bit chilly.';
            case iceCold:           return 'You\'re ice cold!';
        }
    }
    provideHint() {
        let hints = new Array(9), alreadyPicked = [this.winningNumber];
        for (let i=0; i<hints.length; i++) {
            hints[i] = generateWinningNumber();
            while (alreadyPicked.includes(hints[i])) {
                hints[i] = generateWinningNumber();
            }
            alreadyPicked.push(hints[i]);
        }
        hints.push(this.winningNumber);
        return shuffle(hints);
    }
    // extra functionality
    buildPlayingField() {
        for (let i=0; i<10; i++) {
            let newRow = i % 2 === 0 ? evenRow.cloneNode(true) : oddRow.cloneNode(true);
            newRow.classList.toggle('template');
            playingField.appendChild(newRow);
        }
    }
    assignNodeVals() {
        let nodes = Array.from(document.querySelectorAll('.playing-field span'));
        let array100 = new Array(100).fill(null).map((val, i) => val = i+1);
        
        // optional hard mode functionality:
        // let shuffled1to100 = shuffle(array100);
        
        nodes.forEach((node, i) => {
            node.innerText = array100[i];
            // node.innerText = hardMode ? shuffled1to100[i] : array100[i];
            node.id = node.innerText;
        });    
    }
    revealWinningNode() {
        let winningNode = document.getElementById(this.winningNumber);
        let winLoseClass = playerMessage.innerText === 'You Win!' ? 'won' : 'lost';
        winningNode.classList.toggle(winLoseClass);
        // important! IF won, remove currentChoice class to reveal winning color and updateWinStreak()
        if (winLoseClass === 'won') {
            winningNode.classList.remove('currentChoice');
            this.updateWinStreak();
        } else {
            winStreak.innerText = 'Current Win Streak: 0';
        }
    }
    updateWinStreak() {
        let currWins = Number(winStreak.innerText.charAt(winStreak.innerText.length - 1));
        winStreak.innerText = `Current Win Streak: ${++currWins}`;
    }
}

/* ---- INIT GAME --- */

// assign objects
const gameNodes = () => {return Array.from(document.querySelectorAll('.playing-field span'));}
const body = document.querySelector('body');
const playingField = document.querySelector('.playing-field');
const oddRow = document.querySelector('.odd-row.template');
const evenRow = document.querySelector('.even-row.template');
const playerMessage = document.querySelector('.player-message');
const userGuess = document.querySelector('.user-guess');
const submitGuessBtn = document.querySelector('#submit-guess-btn');
const hintBtn = document.querySelector('#hint-btn');
const playAgainBtn = document.querySelector('#play-again-btn');
const winStreak = document.querySelector('.winstreak');
const remainingGuesses = document.querySelector('.remaining-guesses');

// build playing field, assign numbers to nodes
function initializeGame() {
    this.buildPlayingField();
    this.assignNodeVals();
}
let game = newGame();
initializeGame.call(game);

/* ---- EVENT HANDLING ---- */

// gameplay
function clickHandler(e) {
    // suspend actions except play again btn if lost
    let lost = playerMessage.innerText === 'You Lose.';
    let won = playerMessage.innerText === 'You Win!';
    let playAgainBtn = e.target.matches('#play-again-btn');
    if ((lost || won) && !playAgainBtn) {return;}
    // gameNode
    if (gameNodes().some(node => e.target === node)) {
        gameNodes().forEach(node => node.classList.remove('currentChoice'));
        e.target.classList.add('currentChoice');
        userGuess.innerText = e.target.id;
    }
    // submit-guess-btn
    if (e.target.matches('#submit-guess-btn')) {
        // update playerMessage and toggle won/lost class on winning node
        let outcome = game.playersGuessSubmission(userGuess.innerText);
        playerMessage.innerText = outcome;
        if (playerMessage.innerText === ('You Win!' || 'You Lose.')) {game.revealWinningNode();}
        // opt. functionality for changing color scheme according to how close guess is
        switch (outcome) {
            case 'You Win!' || 'You Lose.': /* win / lose modal, split this condition... */; break;
            case "You\'re burning up!": /* toggle hot scheme */; break;
            case 'You\'re lukewarm.': /* toggle warm scheme */; break;
            case 'You\'re a bit chilly.': /* toggle chilly scheme */; break;
            case 'You\'re ice cold!': /* toggle cold scheme */; break;
        }
        // update remaining guesses
        remainingGuesses.innerText = `Remaining Guesses: ${5 - game.pastGuesses.length}`;
    }
    // hint-btn
    if (e.target.matches('#hint-btn')) {
        // clear prior hints
        gameNodes()
            .filter(node => node.matches('.hint'))
            .forEach(node => node.classList.toggle('hint'));
        // get new hints and assign to nodes
        game.provideHint()
            .map(val => document.getElementById(val))
            .forEach(node => node.classList.toggle('hint'));
        // add a null val to pastGuesses, update remainingGuesses
        game.pastGuesses.push(null);
        remainingGuesses.innerText = `Remaining Guesses: ${5 - game.pastGuesses.length}`;
        if (game.pastGuesses.length === 5) {
            playerMessage.innerText = 'You Lose.';
            game.revealWinningNode();
        }
    }
    // play-again-btn
    if (e.target.matches('#play-again-btn')) {
        playingField.innerHTML = '';
        userGuess.innerText = '';
        playerMessage.innerText = '';
        game = newGame();
        initializeGame.call(game);
        remainingGuesses.innerText = 'Remaining Guesses: 5';
    }
}
function focusoutHandler(e) {
    if (e.target.matches('.user-guess')) {
        let val = Number(e.target.innerText);
        let isValid = !(val < 1 || val > 100 || isNaN(val));
        let currChoice = document.querySelector('.currentChoice');
        if (currChoice) {currChoice.classList.remove('currentChoice');}
        if (isValid) {document.getElementById(val).classList.add('currentChoice');}
    }
}
function keydownHandler(e) {
    if (e.keyCode === 13) {e.target.blur();}
}

// assign ELs
body.addEventListener('click', clickHandler);
body.addEventListener('focusout', focusoutHandler);
body.addEventListener('keydown', keydownHandler);