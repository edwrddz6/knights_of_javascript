// these values are set at the beginning
// and then used throughout the game
let gameState = {
    players: 2,
    whoseTurn: 1,
    gameOver: false
}


// function that considers which player's turn it is and then
// changes the UI accordingly
/*function changePlayer() {
    // if the current player is player 1 at the end of a move
    if (gameState.whoseTurn === 1) {
        let playerTwoHealth = document.getElementById("playerTwoHealth");
        // converts the innerHTML from string to a number and stores it in a variable
        let playerTwoHealthNum = Number(playerTwoHealth.innerHTML);
        // reduces by 10
        playerTwoHealthNum -= 10;
        // resets the HTML to the new value
        playerTwoHealth.innerHTML = playerTwoHealthNum;

        // checks if the player has reached 0 health
        if (playerTwoHealthNum <= 0) {
            // ensures health does not dig into the negative
            playerTwoHealth = 0;
            // ends the game
            gameOver();
        }
        else {
            // switch to the next player and change the UI's display / behavior
            gameState.whoseTurn = 2;

            // grabs the 'playerName' element and changes the player's turn display
            let playerName = document.getElementById("playerName");
            playerName.innerHTML = `Player ${gameState.whoseTurn}`;
    }
        
    }
}*/

// Instead of hard coding another IF statement for player 2, I decided to create a conditional to determine if it is player 1 or 2's turn
function changePlayer() {
    let currentPlayerHealth; // I created this variable was created to determine the current health of each player before a turn is taken
    let currentPlayerHealthNum; // I created this variable to determine the health of each player after a turn. 

    // the conditional was placed here. 
    if (gameState.whoseTurn === 1) {
        currentPlayerHealth = document.getElementById("playerOneHealth"); // this will retrieve the HTML element with id playerOneHealth and store it as a variable, resulting the HTML element displaying player 1's health
    } else if (gameState.whoseTurn === 2) {
        currentPlayerHealth = document.getElementById("playerTwoHealth"); // this will retrieve the HTML element with id playerOneHealth and store it as a variable, resulting the HTML element displaying player 2's health
    } else {
        return; 
    }

    currentPlayerHealthNum = Number(currentPlayerHealth.textContent); // converts player's health from string (e.g. '89' from the innerHTML) into actual number variable that can be used using Number()

    // Instead of just having a predetermined damage number for all turns, I wrote a function that would generate a random damage number between 2 arguments
    function generateRandomDamage(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // math.random returns floating number between 0 and 1. math.floor rounds down. the expression adds 1 to ensure maximum value is inclusive. min is added at the end because I want to ensure that the range always starts from min
    }

    const damageRange = generateRandomDamage(10, 20); // I wanted damage to be between 10 and 20. this will call function generateRandomDamage using 10 & 20 as arguments 
    currentPlayerHealthNum -= damageRange; // uses the above binding to subtract players health

    // if player health goes below zero, this will ensure that player health stops at 0 or will always become equal to 0
    if (currentPlayerHealthNum <= 0) {
        currentPlayerHealthNum = 0;
    }

    currentPlayerHealth.innerHTML = currentPlayerHealthNum; // updates players' health with appropriate health number after damage is taken

    // once player health reaches 0, it will call on gameOver function; if not, the else statement asks whose turn was it and who is next
    if (currentPlayerHealthNum <= 0) {
        currentPlayerHealthNum = 0;
        gameOver();
    } else {
        gameState.whoseTurn = gameState.whoseTurn === 1 ? 2 : 1; // used a ternary operator to determine whose turn is it. ? converts into a boolean and checks if it is true that it is player 1 turn, it will update to player 2. : says if player 1 is not in turn (false), then it will change to player 1's turn

        // grabs the 'playerName' element and changes the player's turn display
        let playerName = document.getElementById("playerName"); 
        playerName.innerHTML = `Player ${gameState.whoseTurn}`;
    }
}

// if a player's health reaches 0 at the end of a turn, the game ends
// and the winner is announced
function gameOver() {
    let title = document.getElementById("title");
    title.style = "display: none;";
    let playerTurnDisplay = document.getElementById("playerTurn");
    playerTurnDisplay.style = "display: none;";

    let winningPlayer = document.getElementById("winningPlayer");
    winningPlayer.innerHTML = `Player ${gameState.whoseTurn} wins!`

    let gameOverScreen = document.getElementById("gameOverScreen");
    gameOverScreen.style = "display: flex; flex-direction: column;";
}

// function that allows the player two attack button to reduce the player two's
// health
function attackPlayerTwo() {
    // compartmentalized function that will switch the player 2 attack button to inactive
    // and player 1 attack button to active using DOM manipulation
    // this also DISABLES the button, meaning they are not interactable
    function changeButtonStatus() {
        let playerTwoAttackButton = document.getElementById("playerTwoAttack");
        playerTwoAttackButton.disabled = true;
        playerTwoAttackButton.classList.add("inactive");
        playerTwoAttackButton.classList.remove("active");

        let playerOneAttackButton = document.getElementById("playerOneAttack");
        playerOneAttackButton.disabled = false;
        playerOneAttackButton.classList.add("active");
        playerOneAttackButton.classList.remove("inactive");
    }

    // commpartmentalized function that changes the player 1's sprite using the array
    // containing multiple images
    function animatePlayer() {
        // an array containing the images using in player one's animation
        // the indices are later used to cycle / "animate" when the player attacks
        let playerOneFrames = [
            "./images/R_Idle.png",
            "./images/R_Attack.png"
        ];

        let playerSprite = document.getElementById("playerOneSprite");
        // function we will call in setTimeout, before the frames change back
        // the idle stance
        // in other words, we set to the attack sprite, wait 3 seconds,
        // then set it back to the idle sprite
        playerSprite.src = playerOneFrames[1];
        
        // removes the 'idle' class from the player sprite
        playerSprite.classList.remove("idle");
        // adds the 'attack' class to the player sprite
        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        playerSprite.classList.add("attack");

        // grabs the enemy sprite
        let enemySprite = document.getElementById("playerTwoSprite");
        let enemyDamage = document.getElementById("SFX_PlayerDamage");
        // removes the 'idle' class from the enemy sprite
        enemySprite.classList.remove("idle");
        // adds the 'attack' class to the enemy sprite
        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        enemySprite.classList.add("damage");
        // sound that plays when enemy takes damage
        enemyDamage.play();

        // the function we will call in the setTimeOut method below
        // after 350 milliseconds
        // this function will execute this block of code
        function changePlayerOneSprite() {
            enemySprite.classList.remove("damage");
            enemySprite.classList.add("idle");

            playerSprite.src = playerOneFrames[0];
            playerSprite.classList.remove("attack");
            playerSprite.classList.add("idle");
        }

        setTimeout(changePlayerOneSprite, 350);
    }

    // for easy reading,
    // we do not include ALL of the above code within this condition
    // instead, we create higher-order functions to keep the code neat and readable
    if (gameState.whoseTurn === 1) {
        animatePlayer();
        changeButtonStatus();
        changePlayer();
    }
}
// function that allows the player one attack button to reduce the player one's health
function attackPlayerOne() {
    // compartmentalized function that will switch the player 1 attack button to inactive
    // and player 2 attack button to active using DOM manipulation
    // this also DISABLES the button, meaning they are not interactable
    function changeButtonStatus() {
        let playerOneAttackButton = document.getElementById("playerOneAttack");
        playerOneAttackButton.disabled = true;
        playerOneAttackButton.classList.add("inactive");
        playerOneAttackButton.classList.remove("active");

        let playerTwoAttackButton = document.getElementById("playerTwoAttack");
        playerTwoAttackButton.disabled = false;
        playerTwoAttackButton.classList.add("active");
        playerTwoAttackButton.classList.remove("inactive");
    }

    // commpartmentalized function that changes the player 2's sprite using the array
    // containing multiple images
    function animatePlayer() {
        // an array containing the images using in player two's animation
        // the indices are later used to cycle / "animate" when the player attacks
        let playerTwoFrames = [
            "./images/L_Idle.png",
            "./images/L_Attack.png"
        ];

        // removes the 'idle' class from the player sprite
        let playerSprite = document.getElementById("playerTwoSprite");
        // function we will call in setTimeout, before the frames change back
        // the idle stance
        // in other words, we set to the attack sprite, wait 3 seconds,
        // then set it back to the idle sprite
        playerSprite.src = playerTwoFrames[1];
        

        playerSprite.classList.remove("idle");

        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        playerSprite.classList.add("attack");


        let enemySprite = document.getElementById("playerOneSprite");
        let enemyDamage = document.getElementById("SFX_PlayerDamage");

        enemySprite.classList.remove("idle");

        // ** CHECK THE CSS TO NOTE THE CHANGES MADE **
        enemySprite.classList.add("damage");
        // sound that plays when enemy takes damage
        enemyDamage.play();

        // the function we will call in the setTimeOut method below
        // after 350 milliseconds
        // this function will execute this block of code
        function changePlayerTwoSprite() {
            enemySprite.classList.remove("damage");
            enemySprite.classList.add("idle");

            playerSprite.src = playerTwoFrames[0];
            playerSprite.classList.remove("attack");
            playerSprite.classList.add("idle");
        }

        setTimeout(changePlayerTwoSprite, 350);
    }

    // for easy reading,
    // we do not include ALL of the above code within this condition
    // instead, we create higher-order functions to keep the code neat and readable
    if (gameState.whoseTurn === 2) {
        animatePlayer();
        changeButtonStatus();
        changePlayer();
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("background");

    const backImg = document.querySelector(`.background`);

    backImg.style.backgroundImage = `url(https://i.postimg.cc/TYsmTm8Z/istockphoto-657520770-612x612.jpg)`;
    backImg.style.backgroundSize = `cover`;
    backImg.style.backgroundRepeat = `no-repeat`;
    backImg.style.backgroundPosition = `center`;
    backImg.style.maxWidth = `auto`;
    backImg.style.height = `100%`;
});

