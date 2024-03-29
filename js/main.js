$(document).ready(function () {
    let wordle = '';
    $('.generate-link').on('click', function (e) {
        e.preventDefault();
        $('.copy-link').text('Copy to Clipboard').removeClass('copied');
        let chosenWord = $('#word').val().toUpperCase();
        let currentURL = window.location.href;
        if (!isNaN(chosenWord) || chosenWord.length < 3 || chosenWord.length > 5) {
            challengeLinkError();
            return;
        }
        $('#link a').text(currentURL + '?=' + btoa(chosenWord));
        $('.link-wrapper').fadeIn();
    });
    if (window.location.href.includes('?=')) {
        let query = window.location.search;
        let index = query.indexOf('=');
        wordle = atob(query.substring(index + 1, query.length));
        setDifficulty(0, wordle.length);
        fiveLetterWords.push(wordle);
        revealBoard();
    }
    function revealBoard() {
        $('.difficulty, .challenge').fadeOut(400).promise().done(function () {
            $('.board, .keyboard').fadeIn(400);
            $('.board').addClass('game-started');
        });
    }
    $('.difficulty li').on('click', function (e) {
        e.preventDefault();
        if ($('.difficulty li').hasClass('selected')) return;
        $(this).toggleClass('selected');
        revealBoard();
        setDifficulty($(this));
        wordle = fiveLetterWords[getRandomInt(0, fiveLetterWords.length - 1)].toUpperCase();
    });
    let sound = new Audio('./sound/wow.wav');
    let soundLose = new Audio('./sound/lose.mp3');
    let gameOver = false;
    let reveal = false;
    let userInput = '';
    let filledTiles = [];
    let gameLost = false;

    $('.letters-row li').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('submit') || $(this).hasClass('erase') || gameOver || userInput.length === $('.current li').length) {
            return;
        }
        userInput += $(this).text();
        let currentRow = $('.current li');
        for (let i = 0; i < currentRow.length; i++) {
            if ($(currentRow[i]).text() === '') {
                $(currentRow[i]).text($(this).text());
                filledTiles.push($(currentRow[i])[0]);
                return;
            }
        }
    });

    function setDifficulty(clickedEl, length) {
        if (length) {
            setBoard(length);
            length === 3 ? fiveLetterWords = threeLetterWords : '';
            length === 4 ? fiveLetterWords = fourLetterWords : '';
            return;
        }
        let num = 5;
        if (clickedEl.text().includes('THREE')) {
            num = 3;
            fiveLetterWords = threeLetterWords;
        } else if (clickedEl.text().includes('FOUR')) {
            num = 4;
            fiveLetterWords = fourLetterWords;
        }
        setBoard(num);
    }

    function setBoard(num) {
        for (let j = 0; j <= 6; j++) {
            for (let i = 0; i < num; i++) {
                let newEl = '<li class="default"><a href="#"></a></li>';
                $(`.board-row-${j}`).append(newEl);
            }
        }
    }

    function checkWord(arr, str) {
        return arr.filter(function (elem) { return elem == str }).length > 0;
    }
    $('.submit').on('click', function (e) {
        e.preventDefault();
        if (userInput.length === $('.current li').length && !gameOver && checkWord(fiveLetterWords, userInput)) {
            checkWin();
        } else {
            if (!$('.incorrect-pop-up').hasClass('animate')) {
                incorrectPopUp();
            }
        }
    });
    $('.erase').on('click', function () {
        if (filledTiles[filledTiles.length - 1] === undefined || gameOver) return;
        userInput = userInput.slice(0, -1);
        filledTiles[filledTiles.length - 1].innerText = '';
        filledTiles.pop();
    });

    let erasePressTimer;
    $('.erase').on('pointerdown', function (e) {
        // Check if the event is cancelable before calling preventDefault
        if (e.cancelable) {
            e.preventDefault();
        }
        erasePressTimer = setTimeout(function () {
            erasePressTimer = null;
            userInput = ''; // Clear the user input
            $('.current li').text(''); // Clear the filled tiles on the board
            filledTiles = []; // Clear the filled tiles array
        }, 500); // Set the long-press duration here (800ms in this example)
    });

    $('.erase').on('pointerup', function () {
        clearTimeout(erasePressTimer);
    });

    $(document).on('keydown', function (e) {
        if (reveal) { return; }
        let lettersEl = $('.letters-row li a');
        for (let i = 0; i < lettersEl.length; i++) {
            if ($(lettersEl[i]).text() === '') {
                continue;
            }
            e.key === $(lettersEl[i]).text().toLowerCase() ? quickColor($(lettersEl[i]).parent().trigger('click')) : '';
        }
        e.keyCode === 8 ? quickColor($('.erase').trigger('click')) : '';
        e.keyCode === 13 ? quickColor($('.submit').trigger('click')) : '';
    });

    function checkInput() {
        return userInput === wordle;
    }

    function checkResults() {
        let str = '';
        let count = 1;
        for (let i = 0; i < $('.row li').length; i++) {
            $('.row li')[i].classList.contains('green') ? str += '✅' : '';
            $('.row li')[i].classList.contains('orange') ? str += '🟧' : '';
            $('.row li')[i].classList.contains('grey') ? str += '⬜️' : '';
            if ((i + 1) % wordle.length === 0 && str) {
                let list = document.createElement('li');
                $('.pop-up--copy-result ul').append(list);
                list.append(`${count++}.` + str + '\r');
                str = '';
            }
        }
    }
    function checkWin() {
        if (checkInput()) {
            $('.current li').addClass('green');
            checkKeyboard();
            checkResults();
            popUp();
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
            reveal = true;
            $(getEl(i)).delay(500 * i).queue(function (next) {
                $(this).removeClass('default').addClass('flip');
                next();
            });
        });
        if (userInput.length === $('.current li').length && !gameOver) {
            if ($('.row').last().hasClass('current')) {
                gameOver = true;
                $('.pop-up--status').text('You lose!');
                checkResults();
                gameLost = true;
                popUp();
            }
            checkKeyboard();
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }

    function popUp() {
        setTimeout(function () {
            $('.board, .keyboard').fadeOut(300);
        }, 3000);
        setTimeout(function () {
            $('.pop-up').fadeIn(300);
            $('.pop-up--wordle span').text('The word was ');
            $('.pop-up--wordle strong').text(wordle);
            if (gameLost) {
                soundLose.play();
            } else {
                sound.play();
                const jsConfetti = new JSConfetti();
                jsConfetti.addConfetti();
            }
        }, 3600);
    }

    function incorrectPopUp() {
        userInput ? $('.incorrect-pop-up').text(`${userInput} is not a valid word`) : $('.incorrect-pop-up').text('Please enter a word');
        $('.incorrect-pop-up').addClass('animate').fadeIn(300);
        setTimeout(function () {
            $('.incorrect-pop-up').removeClass('animate');
        }, 1200);
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
                if (keyboardID.is('.green')) {
                    return;
                }
                if (keyboardID.is('.orange') && id[i].classList[0] === 'green') {
                    keyboardID.removeClass().addClass('green');
                    return;
                } else if (keyboardID.is('.orange')) {
                    return;
                }
                keyboardID.removeClass().addClass(id[i].classList[0]);
            });
            reveal = false;
        }, wordle.length * 500);
    }

    function getEl(index) {
        return $('.current li')[index];
    }

    function getKeyboardEl(char) {
        return $(`#${char}`);
    }

    function quickColor(el) {
        $(el).addClass('saddlebrown');
        $(document).on('keyup', function () {
            $(el).removeClass('saddlebrown');
        });
    }

    $('.copy-link').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('copied')) return;
        var $temp = $('<TEXTAREA>');
        $('body').append($temp);
        if ($(this).parent().hasClass('pop-up')) {
            $temp.val($('.pop-up--copy-result ul li').text()).select();
            $('.pop-up .copy-link').text('Copied!').addClass('copied');
        } else {
            $temp.val($('#link a').text()).select();
            $('.challenge .copy-link').text('Copied!').addClass('copied');
        }
        document.execCommand('copy');
        $temp.remove();
        setTimeout(() => {
            $('.copy-link').removeClass('copied').text('Copy To Clipboard');
        }, 700);
    });

    function challengeLinkError() {
        $('.challenge label').css('color', 'red');
        setTimeout(function () { $('.challenge label').css('color', '') }, 500);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});