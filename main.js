
const words = ['autonomy', 'portion', 'academy', 'deserve'];
const state = {
    alive: false,
    word: '',
    guesses: 0,
    errors: 0,
    validLetters: [...'abcdefghijklmnopqrstuvwxyz']
};

function startNewGame() {
    // pick a new random word from the word array
    let newWord = '';
    do {
        newWord = words[Math.floor(Math.random() * words.length)];
    } while (state.word == newWord);
    state.word = newWord;

    // print the empty word boxes
    const wordLocation = document.getElementById('word');
    wordLocation.innerHTML = '';
    for (let i = 0; i != state.word.length; ++i) {
        const newSpan = document.createElement('span');
        newSpan.textContent = '';
        newSpan.setAttribute('data-position', i);
        wordLocation.appendChild(newSpan);
    }

    // enable all letter buttons
    const buttons = document.querySelectorAll('#letters > button');
    buttons.forEach(button => {
        button.disabled = false;
    });

    state.alive = true;
    state.guesses = 0;
    state.errors = 0;
    state.validLetters = [...'abcdefghijklmnopqrstuvwxyz'];

    // reset the canvas
    const canvas = document.getElementById('hangman');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function guessLetter(letter) {
    // if game is alive and letter hasn't been picked before
    if (state.alive == true && state.validLetters.includes(letter)) {
        ++state.guesses;

        // remove selected letter from valid letters and disable button
        state.validLetters = state.validLetters.filter(item => item != letter);
        disableButton(letter);

        // if guessed letter exist in the word
        if (state.word.includes(letter)) {
            printLetter(letter);
        } else {
            ++state.errors;
            drawFigure();
        }

        // check if there are letters left to guess
        if(!state.word.split('').some(item => state.validLetters.includes(item))) {
            gameWon();
        } else if (state.errors == 7) {
            gameLost();
        }
    }
}

function gameLost() {
    document.getElementById('headline').textContent = 'Game Over';
    document.getElementById('message').textContent = 'Unfortunately your attempts ran out :(';
    document.getElementById('splash').style.display = 'block';
    state.alive = false;
}

function gameWon() {
    document.getElementById('headline').textContent = 'You won';
    document.getElementById('message').textContent = 'It took you ' + state.guesses + ' guesses to save him';
    document.getElementById('splash').style.display = 'block';
    state.alive = false;
}

function drawFigure() {
    const canvas = document.getElementById('hangman');
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;

    switch(state.errors) {
        case 1:
            ctx.beginPath();
            ctx.moveTo(20, 300);
            ctx.quadraticCurveTo(200, 200, 400, 300);
            ctx.stroke();
            break;
        case 2:
            ctx.beginPath();
            ctx.moveTo(200, 250);
            ctx.lineTo(200, 60);
            ctx.stroke();
            break;
        case 3:
            ctx.beginPath();
            ctx.moveTo(165, 252);
            ctx.lineTo(200, 230);
            ctx.stroke();
            break;
        case 4:
            ctx.beginPath();
            ctx.moveTo(235, 252);
            ctx.lineTo(200, 230);
            ctx.stroke();
            break;
        case 5:
            ctx.beginPath();
            ctx.moveTo(190, 60);
            ctx.lineTo(300, 60);
            ctx.stroke();
            break;
        case 6:
            ctx.beginPath();
            ctx.moveTo(230, 60);
            ctx.lineTo(200, 90);
            ctx.stroke();
            break;
        case 7:
            ctx.lineWidth = 1;
            ctx.moveTo(290, 60);
            ctx.quadraticCurveTo(292, 90, 290, 125);
            ctx.stroke();
            break;
    }
}

function printLetter(letter) {
    // print letter to screen
    const spanElements = document.querySelectorAll('#word > span');
    for (let i = 0; i != state.word.length; ++i) {
        if (state.word[i] == letter) {
            spanElements[i].textContent = letter;
        }
    }
}

function disableButton(letter) {
    const buttons = document.querySelectorAll('#letters > button');
    buttons.forEach(button => {
        if (letter == button.value) {
            button.disabled = true;
        }
    });
}

// event listener for guessing a letter (a-z) by keyboard
document.addEventListener('keydown', e => {
    if (e.key.match(/^[a-z]+$/)) {
        guessLetter(e.key);
    }
});

// event listener for guessing a letter by mouse
document.querySelectorAll('#letters > button').forEach(button => {
    button.addEventListener('click', e => {
        guessLetter(e.target.value);
    });
});

// event listener for starting new game
document.getElementById('new-game').addEventListener('click', startNewGame);

// event listener to hide the end message
document.getElementById('splash').addEventListener('click', () => {
    document.getElementById('splash').removeAttribute('style');
});