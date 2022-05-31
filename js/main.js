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
        return userInput === currentWord;
    }

    function checkWin() {
        if (checkInput()) {
            $('.current li').addClass('green');
            gameOver = true;
        }
        const elements = [];
        userInput.split('').forEach(function (x, i) {
            elements[x] = (elements[x] || 0) + 1;
        });
        userInput.split('').forEach((char, i) => {
            if (currentWord[i] === char) {
                $(getEl(i)).addClass('green');
            }
            else if (currentWord.includes(char)) {
                $(getEl(i)).addClass('orange');
                console.log(elements[char], currentWord[i].length);
                if (elements[char] > currentWord[i].length) {
                    $(getEl(i)).addClass('grey');
                    // $(getEl(elements[char])).addClass('orange');
                    // console.log($(getEl(currentWord[0])));
                }
            }
            else {
                $(getEl(i)).addClass('grey');
            }
        });
        if (userInput.length === 5 && !gameOver) {
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }
    // if (letters[char] === elements[char]) {
    // $(getEl(elements[char])).addClass('orange');
    // }
    // console.log(currentWord.indexOf(currentWord[i]));
    // console.log(currentWord[i]);
    // console.log(letters[char], elements[char]);
    // if (letters[char] < elements[char] && elements.keys() === char && letters.keys() === char) {
    //     console.log('amin');
    //     console.log(elements[char], char);
    //     console.log($(getEl(elements[char])));
    //     $(getEl(elements[char])).addClass('green');
    // }
    // if (currentWord[char] < elements[`index-${char}-${j++}`]) {
    // console.log('amin');
    // $(getEl(elements[char])).addClass('green');
    // }
    function getEl(index) {
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
