// global variables
let totalTime = 0;      // total time for all rounds
let totalGames = 0;     // number of completed games
let fastestTime = Infinity; // fastest round time (seconds)
let level, answer, score, playerName;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const giveUpBtn = document.getElementById("giveUpBtn");
const roundTimeDisplay = document.getElementById("roundTime");
const fastestTimeDisplay = document.getElementById("fastest");
const avgTimeDisplay = document.getElementById("avgTime");
date.textContent = time();
 

//add event listeners
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

window.onload = function() {
    while (true) {
        playerName = prompt("What is your name?");
        if (playerName !== null) {
            playerName = playerName.trim();
            if (playerName.length > 0) {
                playerName = formatName(playerName);
                break; 
            }
        }
    
        alert("Please enter a valid name!");
    }

    msg.textContent = "Welcome, " + playerName + "! Select a level to start.";
    date.textContent = formatDateTime();
};

function formatName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUpBtn.disabled = false;

    score = 0;

    startMs = Date.now();


    for(let i = 0; i < levelArr.length; i++){
        if(levelArr[i].checked){
            level = levelArr[i].value;
        }
        levelArr[i].disabled = true;
    }
    msg.textContent = playerName + ", Guess a number from 1 to " + level;
    answer = Math.floor(Math.random()*level) + 1;
    guess.placeholder = answer;
}

function giveUp() {
    score = parseInt(level);
    msg.textContent = playerName + ", you gave up! The correct number was " + answer +
                        ". Your score is set to " + score + " for this round. Press play to try again.";
    updateTimers();
    updateScore();  
    reset();      
}

function makeGuess() {
    let userGuess = parseInt(guess.value);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > level) {
        msg.textContent = "Enter a VALID number from 1 to " + level;
        return;
    }

    score++; 

    let diff = Math.abs(userGuess - answer);
    let temperature = "";

    if (diff >= 10) {
        temperature = " Cold!";
    } else if (diff >= 5) {
        temperature = " Warm!";
    } else if (diff >= 1) {
        temperature = " Hot!";
    }

    if (userGuess > answer) {
        msg.textContent = playerName + ", " + userGuess + " is too high!" + temperature;
    } else if (userGuess < answer) {
        msg.textContent = playerName + ", " + userGuess + " is too low!" + temperature;
    } else {
        let rating = rateScore(score, level);
            let guessWord = (score === 1) ? "guess" : "guesses";
            msg.textContent = playerName + ", " + userGuess + " is correct! You took " + score + " " + guessWord + ". " + rating;

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
            
        updateTimers();
        updateScore();
        reset();
    }
}

function reset(){
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    playBtn.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr.push(score);
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

function rateScore(score, level) {
    let ratio = score / level;
    if (ratio <= 0.25) {
        return "Excellent!";
    } else if (ratio <= 0.5) {
        return "Good.";
    } else if (ratio <= 0.75) {
        return "Okay.";
    } else {
        return "Horrible.";
    }
}


const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function time() {
let d = new Date();

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let month = months[d.getMonth()];
let day = d.getDate();
let year = d.getFullYear();


function getSuffix(n) {
    if (n % 10 === 1 && n % 100 !== 11) {
        return n + "st";
    }
    if (n % 10 === 2 && n % 100 !== 12) {
        return n + "nd";
    }
    if (n % 10 === 3 && n % 100 !== 13) {
        return n + "rd";
    }
    return n + "th";
}

let hour = d.getHours();
let min = d.getMinutes().toString().padStart(2, "0");
let sec = d.getSeconds().toString().padStart(2, "0");

let ampm = hour >= 12 ? "PM" : "AM";
hour = hour % 12;
if (hour === 0) {
    hour = 12;
}


return month + " " + getSuffix(day) + ", " + year + ", " +
       hour + ":" + min + ":" + sec + " " + ampm;


}

setInterval(function() {
    date.textContent = time();
}, 1000);

function updateTimers() {
    let endMs = Date.now();
    let roundTime = (endMs - startMs) / 1000;

    totalTime += roundTime;
    totalGames++;

    if (roundTime < fastestTime) {
        fastestTime = roundTime;
    }

    roundTimeDisplay.textContent = "Last round time: " + roundTime.toFixed(2) + "s";
    fastestTimeDisplay.textContent = "Fastest round: " + fastestTime.toFixed(2) + "s";

    avgTimeDisplay.textContent = "Average time: " + (totalTime / totalGames).toFixed(2) + "s";
    checkAchievements(roundTime, score);
}

function checkAchievements(roundTime, score) {
    if (level === "100" && !achievements.speedDemon && roundTime < 5) {
        achievements.speedDemon = true;
        document.getElementById("speedDemon").textContent = "🥇 Speed Demon – Earned!";
        alert("Achievement Unlocked: Speed Demon! ⚡");
    }

    if (level === "100" && !achievements.sharpshooter && score === 1) {
        achievements.sharpshooter = true;
        document.getElementById("sharpshooter").textContent = "🎯 Sharpshooter – Earned!";
        alert("Achievement Unlocked: Sharpshooter! 🎯");
    }

    if (!achievements.neverGiveUp && scoreArr.length >= 5) {
        achievements.neverGiveUp = true;
        document.getElementById("neverGiveUp").textContent = "💪 Never Give Up – Earned!";
        alert("Achievement Unlocked: Never Give Up! 💪");
    }
}

let achievements = {
  speedDemon: false,
  sharpshooter: false,
  neverGiveUp: false
};