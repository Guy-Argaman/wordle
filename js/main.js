$(document).ready(function () {
    let words = ['PASTE', 'WASTE', 'PESTY'];
    // let currentWord = words[getRandomInt(0, words.length - 1)];
    let currentWord = words[0];
    let gameOver = false;
    let boardTiles = [$('.row li')];
    let userInput = '';
    let filledTiles = [];
    let lettersEl = $('.letters-row li a');
    $('.letters-row li').on('click', function (e) {
        if ($(this).hasClass('submit') || $(this).hasClass('erase')) {
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
    $('.submit').on('click', function (e) {
        if (userInput.length === 5) { checkWin() };
    });
    $('.erase').on('click', function (e) {
        if (filledTiles[filledTiles.length - 1] === undefined) return;
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
        return userInput === currentWord;
    }
    function checkWin() {
        checkInput() ? $('.current li').addClass('correct-index-letter') : gameOver = true;
        userInput.split('').forEach((char, i) => {
            if (currentWord.charAt(i) === char) {
                $(colorEl(i)).addClass('correct-index-letter');
                if ($(colorEl(i)).hasClass('correct-index-letter')) {
                    console.log(char);
                }
            } else if (currentWord.includes(char)) {
                $(colorEl(i)).addClass('correct-letter');
            }
            else {
                $(colorEl(i)).addClass('incorrect-letter');
            }
        });
        if (userInput.length === 5) {
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }
    function colorEl(index) {
        return $('.current li')[index];
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
