$(document).ready(function () {
    let words = ['TASTE', 'WASTE', 'PESTY'];
    // let currentWord = words[getRandomInt(0, words.length - 1)];
    let wordle = words[0];
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
        return userInput === wordle;
    }

    function checkWin() {
        if (checkInput()) {
            $('.current li').addClass('green');
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
            if (letterCounter[char] || letterCounter[char] > 0) {
                $(getEl(i)).addClass('orange');
                letterCounter[char]--;
            }
            else if (char !== '#') {
                $(getEl(i)).addClass('grey');
            }
        });
        if (userInput.length === 5 && !gameOver) {
            if ($('.row').last().hasClass('current')) {
                gameOver = true;
                console.log(`
                "Based"? Are you fucking kidding me? I spent a decent portion of my life writing all of that and your response to me is "Based"? Are you so mentally handicapped that the only word you can comprehend is "Based" - or are you just some fucking asshole who thinks that with such a short response, he can make a statement about how meaningless what was written was? Well, I'll have you know that what I wrote was NOT meaningless, in fact, I even had my written work proof-read by several professors of literature. Don't believe me? I doubt you would, and your response to this will probably be "Based" once again. Do I give a fuck? No, does it look like I give even the slightest fuck about five fucking letters? I bet you took the time to type those five letters too, I bet you sat there and chuckled to yourself for 20 hearty seconds before pressing "send". You're so fucking pathetic. I'm honestly considering directing you to a psychiatrist, but I'm simply far too nice to do something like that. You, however, will go out of your way to make a fool out of someone by responding to a well-thought-out, intelligent, or humorous statement that probably took longer to write than you can last in bed with a chimpanzee. What do I have to say to you? Absolutely nothing. I couldn't be bothered to respond to such a worthless attempt at a response. Do you want "Based" on your gravestone?`);
            }
            let current = $('.current');
            current.removeClass('current');
            current.next().addClass('current');
            userInput = '';
            filledTiles = [];
        }
    }

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
