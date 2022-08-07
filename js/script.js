// set object array to empty
var userHighscoreData = {};

// set timer start time
var startTime = 75;

//create questions array
var questions = [
    {
        q: 'Commonly used data types DO NOT include:',
        options: ['1. strings', '2. booleans', '3. alerts', '4. numbers'],
        a: '3. alerts'
    },
    {
        q: 'The condition in an if/else statement is enclosed with ________.',
        options: ['1. quotes', '2. curly brackets', '3. parenthesis', '4. square brackets'],
        a: '2. curly brackets'
    },
    {
        q: 'A very useful tool used during development and debugging for printing content to the debugger is:',
        options: ['1. JavaScript', '2. terminal/bash', '3. for loops', '4. console.log'],
        a: '4. console.log'
    },
    {
        q: 'Arrays in JavaScript can be used to store ________.',
        options: ['1. numbers and strings', '2. other arrays', '3. booleans', '4. all of the above'],
        a: '4. all of the above'
    },
    {
        q: 'String values must be enclosed within ________ when being assigned to variables.',
        options: ['1. commas', '2. curly brackets', '3. quotes', '4. parenthesis'],
        a: '3. quotes'
    }
]

function loadScores() {
    // get user high score info from local storage
    userHighscoreData = JSON.parse(localStorage.getItem('userScoreData'));

    //if nothing in localStorage, create a new object to track all user info
    if (!userHighscoreData) {
        userHighscoreData = {
            userInfo: [],
        };
    }

    // sort user high score info by value

    userHighscoreData.userInfo.sort(function (a, b) {
        return b.userScore - a.userScore;
    });

    // add user high score information to high score screen
    var userScoreLi = $('<ol>').addClass('score-list')

    $('#high-score-main').append(userScoreLi);

    for (var i = 0; i < userHighscoreData.userInfo.length; i++) {

        var indvScore = $('<li>').addClass('indv-score')
            .text(userHighscoreData.userInfo[i]['userInitials'] + ' : ' + userHighscoreData.userInfo[i]['userScore'])
        $(userScoreLi).append(indvScore).insertBefore('.buttons');

    }
}

// create function to save score
function saveScore() {
    localStorage.setItem('userScoreData', JSON.stringify(userHighscoreData));
};

//clear highscore list
$('#clear-high-scores').on('click', function () {
    $('.score-list').empty();
    userHighscoreData = {
        userInfo: [],
    };
    saveScore();
})

// function to clear the contents of main once the start button is clicked
function clearPage() {
    $('main').empty();
}

// function to start timer and iterate/validate through questions
function askQuestions() {

    //set timer to 75 seconds

    $('.time-remaining').text(startTime);

    //count down by 1 second
    var runClock = setInterval(function () {
        startTime--;
        $('.time-remaining').text(startTime);
    }, 1000);

    // check timer to see when it hits 0
    var checkTime = setInterval(function () {
        var retrieveTime = parseInt($('.time-remaining').text());
        if (retrieveTime <= 0) {
            clearInterval(runClock);
            parseInt($('.time-remaining').text(0))
            clearInterval(checkTime);
            endQuiz();
        }
    }, 1000)

    //set buttonId counter
    var buttonId = 0;
    var divId = 0;

    //to add question and options to main element
    for (var i = 0; i < questions.length; i++) {
        var newMain = $('main').addClass('question');

        //create question for user
        var questionContainer = $('<div>').addClass('questions').attr({
            id: 'div' + divId
        });
        $(newMain).append(questionContainer);

        divId++;

        var quizQuestion = $('<h1>')
            .addClass('title')
            .text(questions[i]['q']);

        $(questionContainer).append(quizQuestion);

        //create user options to select
        for (var y = 0; y < questions[i]['options'].length; y++) {
            var questionOptions = $('<button>')
                .addClass('button button-secondary')
                .text(questions[i]['options'][y])
                .attr({
                    type: 'button',
                    id: buttonId
                })
                .on('click', function () {
                    //validate user selection

                    var userSelection = ($(this)
                        .text()
                        .trim());

                    validator(userSelection, currentQuestion);
                    // on click fade current question out and increase index of object array by 1
                    $($questions.get(currentQuestion)).fadeOut(1000, function () {
                        currentQuestion = currentQuestion + 1;
                        //check to see if all questions were asked
                        if (currentQuestion == totalQuestions) {
                            clearInterval(runClock);
                            clearInterval(checkTime);
                            endQuiz();
                        }
                        //if not, fade in the next question
                        else {
                            $($questions.get(currentQuestion)).fadeIn();
                        }
                    });
                })
            $(questionContainer).append(questionOptions);

            buttonId++;

        }
    }

    // let function know when to break
    var totalQuestions = questions.length;

    //set index to new object array
    var currentQuestion = 0;

    //create new object array for dom generated questions
    $questions = $('.questions');

    //hide all the questions generated
    $questions.hide();

    //show first question
    $($questions.get(currentQuestion)).fadeIn();
}

function validator(userSelection, currentQuestion) {
    //pull correct choice from questions array
    var correctChoice = questions[currentQuestion]['a'];
    //if userselection does not equal the 'choice' value of currentQuestion
    if (userSelection !== correctChoice) {
        // create a message under buttons to say wrong
        var adjustedTime = parseInt($('.time-remaining').text()) - 10;
        startTime = adjustedTime;
        // add a <p> displaying the alert in the current question div
        var validateChoice = $('<p>')
            .addClass('validate-choice')
            .text("Wrong!")

        $('#div' + currentQuestion).append(validateChoice)
    }

    // else create a message under buttons to say correct
    else {
        var validateChoice = $('<p>')
            .addClass('validate-choice')
            .text("Correct!")

        $('#div' + currentQuestion).append(validateChoice)
    }
}

//create the 'end quiz' page where user can enter their initials
function endQuiz() {
    // clear page
    clearPage();
    // add 'all done' alert
    var newMain = $('main').addClass('main-end');
    var endQuizAlert = $('<h1>')
        .addClass('title')
        .text('All done!');

    $(newMain).append(endQuizAlert);

    // add final score alert
    var finalScoreAlert = $('<p>')
        .addClass('final-score')
        .text('Your final score is ' + $('.time-remaining').text() + '.');

    $(newMain).append(finalScoreAlert);

    // check if final score is 0. If true - try again to make the high score list and allow them to go back to the homepage
    // else - allow user to input initals and save to local storage as a ordered list
    if (parseInt($('.time-remaining').text()) === 0) {
        var noHighScore = $('<p>')
            .addClass('final-score')
            .text('Unfortunately you did not obtain a high score. Try again!');

        $(newMain).append(noHighScore);
        // create <a> to reference homepage
        var homePageLink = $('<a>').attr({
            href: './index.html'
        });

        $(newMain).append(homePageLink);
        // create go back button to homepage button
        var goBackBtn = $('<button>')
            .addClass('button')
            .text('Go back')
            .attr({
                type: 'button'
            });

        $(homePageLink).append(goBackBtn);
    }

    else {
        // create label & input to allow user to enter intials
        var highscoreForm = $('<form>')
            .addClass('highscore-form')

        $(newMain).append(highscoreForm);


        var enterInitials = $('<label>')
            .text('Enter initials: ')
            .addClass('enter-initials')
            .attr({
                for: 'name',
            })

        $(highscoreForm).append(enterInitials);

        var initials = $('<input>')
            .addClass('initials')
            .attr({
                type: 'text',
                placeholder: 'AAA',
                id: 'name',
                name: 'name'
            });
        $(highscoreForm).append(initials);

        var highscorePageLink = $('<a>').attr({
            href: './high-scores.html'
        });

        $(highscoreForm).append(highscorePageLink);

        // add submit button which will save user data to local storage
        var submitHighscore = $('<button>')
            .addClass('button')
            .text('Submit')
            .attr({
                type: 'button',
                id: 'submit'
            })
            .on('click', function () {
                var userInput = $('#name').val();
                var highscoreValue = parseInt($('.time-remaining').text());
                // check certain user input conditions and respond accordingly
                if (userInput === '') {
                    userInput = 'AAA'
                }
                else if (userInput.length > 3) {
                    userInput = userInput.substring(0, 3);
                }

                //save in userHighscoreData array
                userHighscoreData.userInfo.push({
                    userInitials: userInput.toUpperCase(),
                    userScore: highscoreValue
                });

                // save to local storage
                saveScore();
                // pring to high score page
                loadScores();
            })
        $(highscorePageLink).append(submitHighscore);
    }
}

//when user clicks start quiz button - start timer and show first question
$('#start-quiz').on('click', function () {
    clearPage();
    askQuestions();
})

// load tasks for the first time
loadScores();

