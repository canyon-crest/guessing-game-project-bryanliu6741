// global variables
let level, answer, score;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
Date.textContent = time();

//add event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

function play(){
    score = 0; // sets score to 0 every new game
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = "Guess a number from 1 to " + level;
    answer = Math.floor(Math.random()*level) + 1;
    guess.placeholder = answer;
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "Enter a VALID number from 1 to " + level;
        return;
    }
    if(userGuess > answer){
        msg.textContent = userGuess + " is too high! Guess again."
    } else if (userGuess < answer){
        msg.textContent = userGuess + " is too low! Guess again."
    } else {
        msg.textContent = userGuess + " is correct! You got it! It took you " + (score+1) + " guesses. Press play to play again.";
        updateScore();
        reset();
    }
    score++;// valid guess add 1 to score
}

function reset(){
    guessBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr.push(score+1);
    scoreArr.sort((a, b) => a - b);
    let lb = document.getElementsByName("leaderboard");
    wins.textContent = "Total wins: " + scoreArr.length;
    let sum = 0;
    for(let i = 0; i < scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }
    let avg = sum/scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function time(){
    let d = new Date();
    return d;
}