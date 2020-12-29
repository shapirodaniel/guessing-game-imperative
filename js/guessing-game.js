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
}