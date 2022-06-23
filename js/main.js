$(document).ready(function () {
    let wordle = '';
    $('.board, .keyboard').hide();
    $('.generate-link').on('click', function () {
        $('.copy-link').text('Copy to Clipboard').css('background-color', '');
        let chosenWord = $('#word').val().toUpperCase();
        let currentURL = window.location.href;
        if (chosenWord.length >= 3 && chosenWord.length <= 5) {
            $('#link a').text(currentURL + '?=' + btoa(chosenWord));
            $('.link-wrapper').fadeIn();
        } else {
            $('.challenge label').css('color', 'red');
            setTimeout(function () { $('.challenge label').css('color', '') }, 500);
        }
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
        });
    }
    $('.difficulty li').on('click', function () {
        $(this).toggleClass('selected').css('pointer-events', 'none');
        revealBoard();
        setDifficulty($(this));
        wordle = fiveLetterWords[getRandomInt(0, fiveLetterWords.length - 1)].toUpperCase();
        console.log(wordle);
    });
    let gameOver = false;
    let status = '';
    let userInput = '';
    let filledTiles = [];
    $('.letters-row li').on('click', function (e) {
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
    $('.submit').on('click', function () {
        if (userInput.length === $('.current li').length && !gameOver && checkWord(fiveLetterWords, userInput)) {
            checkWin();
        } else {
            if (!$('.incorrect-pop-up').is(':visible')) {
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
    $(document).on('keydown', function (e) {
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
        status = 'You win! Congratulations!';
        return userInput === wordle;
    }
    function checkResults() {
        let mat = '';
        let count = 1;
        for (let i = 0; i < $('.row li').length; i++) {
            $('.row li')[i].classList.contains('green') ? mat += '✅' : '';
            $('.row li')[i].classList.contains('orange') ? mat += '🟧' : '';
            $('.row li')[i].classList.contains('grey') ? mat += '⬜️' : '';
            if (i % 5 === 0 && i !== 0) {
                let list = document.createElement('li');
                let text = document.createTextNode(`${count++}.`);
                console.log(text);
                list.innerText = text;
                console.log(list);
                $('.pop-up--copy-result ul').append(list);
                list.innerText = mat;
                mat += `\n`;
                mat = '';
            }
        }
    }
    function checkWin() {
        if (checkInput()) {
            $('.current li').addClass('green');
            checkKeyboard();
            checkResults();
            setTimeout(function () { $('.board, .keyboard').fadeOut() }, 3000);
            setTimeout(popUp, 3500);
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
        if (userInput.length === $('.current li').length && !gameOver) {
            if ($('.row').last().hasClass('current')) {
                gameOver = true;
                status = 'You lose!';
                $('.pop-up').css('position', 'absolute');
                checkResults();
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
        $('.pop-up').fadeIn();
        $('.pop-up--status').text(status);
        $('.pop-up--wordle span').text('The word was ');
        $('.pop-up--wordle strong').text(wordle);
    }

    function incorrectPopUp() {
        userInput ? $('.incorrect-pop-up').text(`${userInput} is not a valid word`) : $('.incorrect-pop-up').text('Please enter a word');
        $('.incorrect-pop-up').fadeIn('fast');
        $('.incorrect-pop-up').fadeOut(3000);
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

    $('.copy-link').on('click', function () {
        var $temp = $('<input>');
        $('body').append($temp);
        if ($(this).parent().hasClass('pop-up')) {
            $temp.val($('.pop-up--copy-result ul li').text()).select();
            $('.pop-up .copy-link').text('Copied!').css('background-color', 'grey');
        } else {
            $temp.val($('#link a').text()).select();
            $('.challenge .copy-link').text('Copied!').css('background-color', 'grey');
        }
        document.execCommand('copy');
        $temp.remove();
    });

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});