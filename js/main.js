$(document).ready(function () {
    let words = ['PASTE', 'WASTE', 'PESTY'];
    // let currentWord = words[getRandomInt(0, words.length - 1)];
    let currentWord = words[0];
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
            ($('.erase').trigger('click'));
            quickColor($('.erase'));
        }
        if (e.keyCode === 13) {
            ($('.submit').trigger('click'));
            quickColor($('.submit'));
        }
    });
    function checkWin() {
        console.log('checking win');
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentWord[i]) {
                $(colorEl(userInput[i])).addClass('correct-index-letter');
                console.log('entered');
            } else {
                $(colorEl(userInput[i])).addClass('incorrect-letter');
                console.log('entered two');
            }
        }
        if (userInput.length === 5) {
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }
    function colorEl(el) {
        for (let element of $('.current li')) {
            if ($(element).text() === el) {
                return element;
            }
        }
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
