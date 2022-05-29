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
                $(lettersEl[i]).parent().css('background-color', 'saddlebrown');
                $(document).on('keyup', function () {
                    $(lettersEl[i]).parent().css('background-color', '');
                });
            }
        }
        e.keyCode === 8 ? ($('.erase').trigger('click')) : '';
        e.keyCode === 13 ? ($('.submit').trigger('click')) : '';
    });
    function checkWin() {
        console.log('checking win');
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentWord[i]) {
                console.log(userInput.indexOf(userInput[i]));
                console.log(currentWord.indexOf(currentWord[i]));
                $(colorEl(userInput[i])).addClass('correct-index-letter');
            }
        }
        // if (currentWord.indexOf(currentWord[i]) === userInput.indexOf(userInput[i])) {
        // else {
        // $(colorEl(userInput[i])).addClass('correct-letter');
        // }
        // console.log(currentWord);
        // for (let i = 0; i < userInput.length; i++) {
        //     for (let j = 0; j < currentWord.length; j++) {
        //         if (userInput[i] === currentWord[j]) {
        //             if (currentWord.indexOf(currentWord[j]) === userInput.indexOf(userInput[i])) {
        //                 $(colorEl(userInput[i])).addClass('correct-index-letter');
        //                 break;
        //             } else {
        //                 $(colorEl(userInput[i])).addClass('correct-letter');
        //                 break;
        //             }
        //         }
        //         else {
        //             console.log('test');
        //             $(colorEl(userInput[i])).addClass('incorrect-letter');
        //             break;
        //         }
        //     }
        // }
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

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
});
