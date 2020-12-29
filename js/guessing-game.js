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
        
        let won = this.playersGuess === this.winningNumber;
        let alreadyGuessed = this.pastGuesses.includes(this.playersGuess);
        let novelGuess = !this.pastGuesses.includes(this.playersGuess) && this.playersGuess !== this.winningNumber;
        if (novelGuess) {this.pastGuesses.push(this.playersGuess);}

        let lost = this.pastGuesses.length === 5;
        let burningUp = this.difference() < 10
        let lukeWarm = this.difference() < 25;
        let bitChilly = this.difference() < 50;
        let iceCold = this.difference() < 100;        
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
        let hints = [generateWinningNumber(), generateWinningNumber(), this.winningNumber];
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
        let shuffled1to100 = shuffle(array100);
        nodes.forEach((node, i) => {
            node.innerText = shuffled1to100[i]
            node.id = node.innerText;
        });    
    }
    assignWinningNode() {
        let winningNode = document.getElementById(`${this.winningNumber}`);
        winningNode.classList.toggle('winner');
    }
}

/* ---- INIT GAME --- */

// assign objects
const gameNodes = () => {return Array.from(document.querySelectorAll('.playing-field span'));}
const playingField = document.querySelector('.playing-field');
const oddRow = document.querySelector('.odd-row.template');
const evenRow = document.querySelector('.even-row.template');
const guessField = document.querySelector('.guess-field');
const submitBtn = document.querySelector('.submit-btn');
const hintBtn = document.querySelector('.hint-btn');
const playAgainBtn = document.querySelector('.play-again-btn');
const endGameModal = document.querySelector('.end-game-modal');

// build playing field, assign numbers to nodes, assign winning node
function initializeGame() {
    this.buildPlayingField();
    this.assignNodeVals();
    this.assignWinningNode();
}
let game = newGame();
initializeGame.call(game);

// gameplay
function clickHandler(e) {
    
    // if a gameNode: 
    // toggle active class OFF previous selection, toggle new selection ON
    // update submitField to nodeID
    if (gameNodes().some(node => e.target === node)) {
        gameNodes().forEach(node => node.classList.remove('currentChoice'));
        e.target.classList.add('currentChoice');
        submitField.innerText = e.target.id;
    }
    // if submit button
    if (e.target.matches('.submit-btn')) {
        let outcome = game.playersGuessSubmission(submitField.innerText);
        switch (outcome) {
            case 'You Win!': /* winning modal */; break;
            case 'You Lose.': /* losing modal */; break;
            case "You\'re burning up!": /* toggle hot scheme */; break;
            case 'You\'re lukewarm.': /* toggle warm scheme */; break;
            case 'You\'re a bit chilly.': /* toggle chilly scheme */; break;
            case 'You\'re ice cold!': /* toggle cold scheme */; break;
        }
    }
    // if hint button, generate array of hints and toggle 'hint' on each node whose innerText matches hint array vals
    if (e.target.matches('.hint-btn')) {
        let hints = game.provideHint();
        gameNodes().filter(val => hints.includes(val.innerText)).forEach(node => node.classList.toggle('hint'));
    }
    // if playAgain button, toggle modal active class OFF, get new game and initialize it
    if (e.target.matches('.play-again-btn')) {
        endGameModal.classList.toggle('active');
        game = newGame();
        initializeGame.call(game);
    }
}

// assign ELs
playingField.addEventListener('click', clickHandler);