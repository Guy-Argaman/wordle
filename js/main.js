$(document).ready(function () {
    let words = ['TASTE', 'WASTE', 'PESTY'];
    let wordle = words[0];
    // let wordle = words[getRandomInt(0, words.length - 1)];
    let gameOver = false;
    let winStatus = '';
    let boardTiles = [$('.row li')];
    let userInput = '';
    let filledTiles = [];
    let lettersEl = $('.letters-row li a');
    $('.letters-row li').on('click', function (e) {
        if ($(this).hasClass('submit') || $(this).hasClass('erase') || gameOver) {
            return;
        }
        $(this).text();
        if (userInput.length === 5) {
            return;
        }
        userInput += $(this).text();
        for (let i = 0; i < boardTiles.length; i++) {
            for (let j = 0; j < boardTiles[i].length; j++) {
                if ($(boardTiles[i][j]).text() === '') {
                    $(boardTiles[i][j]).text($(this).text());
                    filledTiles.push($(boardTiles[i][j])[0]);
                    return;
                }
            }
        }
    });
    $('.submit').on('click', function () {
        if (userInput.length === 5 && !gameOver) { checkWin() };
    });
    $('.erase').on('click', function () {
        if (filledTiles[filledTiles.length - 1] === undefined || gameOver) return;
        userInput = userInput.slice(0, -1);
        filledTiles[filledTiles.length - 1].innerText = '';
        filledTiles.pop();
    });
    $(document).on('keydown', function (e) {
        for (let i = 0; i < lettersEl.length; i++) {
            if ($(lettersEl[i]).text() === '') {
                continue;
            }
            if (e.key === $(lettersEl[i]).text().toLowerCase()) {
                $(lettersEl[i]).trigger('click');
                quickColor($(lettersEl[i]).parent());
            }
        }
        if (e.keyCode === 8) {
            $('.erase').trigger('click');
            quickColor($('.erase'));
        }
        if (e.keyCode === 13) {
            $('.submit').trigger('click');
            quickColor($('.submit'));
        }
    });

    function checkInput() {
        winStatus = 'You win! Congratulations!'
        return userInput === wordle;
    }

    function checkWin() {
        if (checkInput()) {
            $('.current li').addClass('green');
            popUp();
            checkKeyboard();
            gameOver = true;
        }
        userInput_arr = Array.from(userInput);
        letterCounter = {};
        wordle.split('').forEach((char) => {
            letterCounter[char] = (letterCounter[char] || 0) + 1;
        });
        userInput_arr.forEach((char, i) => {
            if (char === wordle[i]) {
                $(getEl(i)).addClass('green');
                letterCounter[char]--;
                userInput_arr[i] = '#';
            }
        });
        userInput_arr.forEach((char, i) => {
            if (letterCounter[char] && letterCounter[char] > 0) {
                $(getEl(i)).addClass('orange');
                letterCounter[char]--;
            }
            else if (char !== '#') {
                $(getEl(i)).addClass('grey');
            }
        });
        userInput_arr.forEach((char, i) => {
            $(getEl(i)).delay(500 * i).queue(function (next) {
                $(this).removeClass('default').addClass('flip');
                next();
            });
        });
        if (userInput.length === 5 && !gameOver) {
            if ($('.row').last().hasClass('current')) {
                gameOver = true;
                winStatus = 'You lost!';
                popUp();
            }
            checkKeyboard()
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }
    function popUp() {
        $('.pop-up').slideDown();
        $('.pop-up--status').text(winStatus);
        $('.pop-up--wordle').text(`The word was ${wordle}`);
    }

    function checkKeyboard() {
        let id = $('.current li');
        setTimeout(() => {

            id.text().split('').forEach((char, i) => {
                let keyboardID = $(getKeyboardEl(char));
                if (checkInput()) {
                    keyboardID.removeClass().addClass('green');
                    return;
                }
                if (keyboardID.is('.orange', '.green')) {
                    keyboardID.removeClass('orange');
                } else if (keyboardID.is('.grey', '.green')) {
                    keyboardID.removeClass('green');
                }
                else if (keyboardID.is('.green')) {
                    return;
                }
                keyboardID.addClass(id[i].classList[0]);
            });
        }, 2500);
    }

    function getEl(index) {
        return $('.current li')[index];
    }

    function getKeyboardEl(char) {
        return $(`#${char}`);
    }

    function quickColor(el) {
        $(el).css('background-color', 'saddlebrown');
        $(document).on('keyup', function () {
            $(el).css('background-color', '');
        });
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});