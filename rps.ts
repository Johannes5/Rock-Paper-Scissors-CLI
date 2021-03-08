const prompts = require('prompts');

const choices = ["rock", "paper", "scissors"];

let currentRound = 3;
let currentPlayerScore = 0;
let currentOpponentScore = 0;
let matchOverview = {wins: 0, losses: 0};

const completeMatch = (playerChoice) =>{
    const opponentChoice = choices[Math.floor(Math.random() * choices.length)];
    switch(playerChoice) {
        case "rock":
            if("rock" == opponentChoice){
                return "it's a tie! do it again"
            } else if(opponentChoice == "paper"){
                currentOpponentScore++;
                return "You lost this round! 🪨 got covered by 📄"
            } else {
                currentPlayerScore++;
                return "Score! 🪨 crushed ✂️"
            }
        case  "paper":
            if("paper" == opponentChoice){
                return "it's a tie! do it again"
            } else if(opponentChoice == "scissors"){
                currentOpponentScore++;
                return "You lost this round! 📄 got shredded by ✂️"
            } else {
                currentPlayerScore++;
                return "Score! 📄️ covered 🪨"
            }
        case "scissors":
            if("scissors" == opponentChoice){
                return "it's a tie! do it again"
            } else if(opponentChoice == "rock"){
                currentOpponentScore++;
                return "You lost this round! ✂️ got crushed by 🪨"
            } else {
                currentPlayerScore++;
                return "Score! ✂️ shredded 📄"
            }
    }
}

const resetValues = () => {
     currentRound = 3;
     currentPlayerScore = 0;
     currentOpponentScore = 0;
}
async function startOptions(){
    const questions = [
        {
            type: 'select',
            name: 'startOptions',
            message: 'Welcome to the Rock Paper Scissors CLI game',
            choices: [
                { title: 'Start game 🚀', value: 'start' },
                { title: 'Show Match Overview 🏆', description: 'the wins and losses you obtained previously', value: 'overview' },
                { title: 'Quit' , value: 'quit' }
            ]
        }
    ];

    const result = await prompts(questions);
    switch (result.startOptions) {
        case "start":
            await recursiveRounds()
            break;
        case "overview":
            console.log(matchOverview);
            await startOptions();
            break;
        case "quit":
            console.log("Bye 👋",);
    }


};

async function recursiveRounds(){

    const questions = [
        {
            type: 'select',
            name: 'choice',
            message: 'X rounds left. What`s it gonna be? (will be overridden)',
            onRender(color) {
                this.no = currentRound;
                this.msg = `${color.cyan(this.no)} rounds left. What\'s it gonna be?)`;
                this.render;
            },
            choices: [
                { title: 'Rock 🪨', description: 'love scissors ✂️, hate paper 📄.', value: 'rock' },
                { title: 'Paper 📄', description: 'love rock 🪨, hate scissors ✂️.', value: 'paper' },
                { title: 'Scissors ✂️', description: 'love paper 📄, hate rock 🪨.', value: 'scissors' }
            ]
        }

    ];
    const onSubmit = () => currentRound--;

    const result = await prompts(questions, {onSubmit});

    console.log(completeMatch(result.choice));
    const matchIncomplete = (currentOpponentScore <= 2) || (currentPlayerScore <= 2)
    if (currentRound > 0 && (matchIncomplete)){
        await recursiveRounds();
    } else if (currentOpponentScore > currentPlayerScore){
        matchOverview.losses++;
        console.log("The computer won 😫", currentOpponentScore + "<" + currentPlayerScore)
        resetValues();
        await startOptions();
    } else if (currentOpponentScore + currentPlayerScore === 0) {
        console.log("Only ties! let's try it one more time");
        await recursiveRounds();
    } else {
        matchOverview.wins--;
        console.log("You won the match! 🤗", currentPlayerScore + ">" + currentOpponentScore)
        resetValues();
        await startOptions();
    }
}

(async function(){await startOptions()})();

