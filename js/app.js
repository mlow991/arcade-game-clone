// Y-axis offset amount found while drawing on canvas
var yOffset = -28;

// X and Y lane dimensions that are the same as in the engine.js
var gridX = 101;
var gridY = 83;

// Size of the collision box for the player and enemy
var hitBox = 55;

// Number of lives the player starts with in the game
var heartNum = 5;

// Actively keeps track of the number of lives curretly remaining
var lives = heartNum;

// Initial player starting point
var playerStart = [2 * gridX, 4 * gridY + yOffset];

// Keeps track of current player location
var move = {x : playerStart[0], y : playerStart[1]};

// Keeps track of score and also its format (the number of zeroes in the score ticker)
var score = {val : 0, string : "00000"};

// Keeps track of gamestate and whether or not the game has ended. Much like a boolean.
var start = 0;

// Range of variables for the enemy which randomizes the values within the ranges
var enemySpeed = [50, 300];
var enemyRange = [1, 3];

// Difficulty or number of enemies that spawn in the game
var enemyNum = 5;

// Controls the usage of the input keys for the game. Restricts usage depending on moment in game.
var keys;

/* Random number generator code reference:
   https://developer.mozilla.org/en-US/docs/Web/
   JavaScript/Reference/Global_Objects/Math/random 
*/
function randomNum(range) {
    var min = range[0];
    var max = range[1];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Set enemy initial location, choose lane, set speed
    // x and y variables are set by the setup function
    // lane and speed variables are randomly generated with randomNum fn  
    this.sprite = 'images/enemy-bug.png';
}

// Sets random initial location, and random speed
Enemy.prototype.setup = function() {
    this.x = -gridX;
    this.y = randomNum(enemyRange);
    this.y = (this.y * gridY) + yOffset;
    this.speed = randomNum(enemySpeed);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply movement by dt parameter to ensure consistent speed for all devices
    this.x = this.x + (dt * this.speed);
    if (this.x > 5 * gridX) {
        // When enemy reaches the end it is sent back to its origin
        this.x = -gridX;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    gameScore();
    // Game over condition check
    if (lives <= 0) {
        roundedRectFilled();
        ctx.globalAlpha = 1;
        ctx.font = "50px Verdana";
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER", 95, 300);
        endPrompt();
    }
    playerLives(lives);
}

// Player object that is controlled by the user
var Player = function() {
    this.sprite = 'images/char-boy.png';
}

// Player prototype inherits the Enemy prototype chain
Player.prototype = Object.create(Enemy.prototype);

// Sets player initial location at defined origin
Player.prototype.setup = function(loc) {
    this.x = loc[0];
    this.y = loc[1];
}

// Returns the player back to origin if he has collided with an enemy
Player.prototype.collision = function() {
    // Checks to see if each enemy is within the specified range of the Player
    // If so, a life/heart is subtracted
    allEnemies.forEach(function(enemy) {
            if (enemy.y == player.y && Math.abs(enemy.x - player.x) <= hitBox) {
               move.x = playerStart[0];
               move.y = playerStart[1];
               lives--;
            }
        });
}

// Updates the current position of the player
Player.prototype.update = function() {
    // Use the handleInput function to update current position from keystrokes.
    // Bounds are (x: 0 to 404), (y: 55 to 387).
    // Global object 'move' holds the values for keys pressed.
    // When 'move' encounters a value that is offscreen, it does not update the player object.
    // It then resets its value to the bound of stoppage.
    player.collision();
    if (move.x >= 0 && move.x <= 4 * gridX) {
        this.x = move.x;
    } else {
        move.x = this.x;
    }
    // If the player has scored send him back to the origin and reset the global move variable
    // Update the score
    if (move.y < gridY + yOffset) {
        this.x = playerStart[0];
        this.y = playerStart[1];
        move.y = this.y;
        move.x = this.x;
        score.val++;
    } else if (move.y <= 5 * gridY + yOffset) {
        this.y = move.y;
    } else {
        move.y = this.y;
    }

}

// Takes key press values and turns them into values of movement which specify direction
Player.prototype.handleInput = function(key) {
    // The input variable key is a string left, right, up, down. (Aand space for endgame scenario)
    // It adds or subtracts from the global position variable for the player.
    // The logic for player movement is within the update function.
    if (key == 'left')
        move.x += -gridX;
    if (key == 'up')
        move.y += -gridY;
    if (key == 'right')
        move.x += gridX;
    if (key == 'down')
        move.y += gridY;
    if (key == 'space')
        start++;
};

// Draws a rectangle with rounded corners and a translucent gradient
function roundedRectFilled () {
    var rectX = 45;
    var rectY = 250;
    var rectW = 420;
    var rectH = 120;
    var rectR = 15;
    var gradient = ctx.createRadialGradient(2.5 * gridX, 3.75 * gridY, 60, 2.5 * gridX, 3.75 * gridY, 210);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "gray");
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = gradient;
    // Rounded rectangle corners refernece: https://gmigdos.wordpress.com/2010/05/20/ja
    // vascript-draw-a-rounded-rectangle-on-an-html-5-canvas/
    ctx.beginPath();
    ctx.moveTo(rectX + rectR, rectY);
    ctx.lineTo(rectX + rectW - rectR, rectY);
    ctx.quadraticCurveTo(rectX + rectW, rectY, rectX + rectW, rectY + rectR);
    ctx.lineTo(rectX + rectW, rectY + rectH - rectR);
    ctx.quadraticCurveTo(rectX + rectW, rectY + rectH, rectX + rectW - rectR, rectY + rectH);
    ctx.lineTo(rectX + rectR, rectY + rectH);
    ctx.quadraticCurveTo(rectX, rectY + rectH, rectX, rectY + rectH - rectR);
    ctx.lineTo(rectX, rectY + rectR);
    ctx.quadraticCurveTo(rectX, rectY, rectX + rectR, rectY);
    ctx.fill();
}

// Prompts the user with a message whether or not to continue and restart the game
function endPrompt() {
    ctx.font = "30px Verdana";
    ctx.fillText("Press SPACE to continue...", 55, 350);
    // When space is pressed it increments this restart squence
    // The start variable is used to verify if the space key has been pressed during engame sequence
    if (start > 0) {
        start = 0;
        lives = heartNum;
        score.val = 0;
        keySet();
    } else {
        // If the game is not to be restarted then deactivate the arrow keys so that the player cannot move
        // Activate the space key so that it can be pressed
        for (var key in keys) {
            keys[key] = 'nothing';
        }
        keys.s = 'space';
    }
}

// Keeps track of score in the upper left hand corner of the game window
function gameScore() {
    // Uses the number of charaters in a number and subtracts it from the string of zeroes that the score contains
    var count = score.val.toString().length;
    ctx.font = "25px Consolas";
    ctx.fillStyle = "yellow";
    ctx.fillText(score.string.substring(0, score.string.length - count + 1) + score.val, 10, 80);
}

// Keeps track in upper right hand corner of game window the amount of remaining hearts/lives the player has
function playerLives(num) {
    var img = new Image();
    img.src = 'images/Heart.png';
    for (i = 0; i < num; i++) {
        ctx.drawImage(img, (470 - (i * 28)), 50, 27, 43);
    }
}



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Creates an array of X number of enemies
function enemyCreate(num) {
    var enemies = [];
    for (i = 0; i < num; i++) {
        var name = i;
        name = new Enemy();
        name.setup(enemyRange);
        enemies.push(name);
    }
    return enemies;
}

var allEnemies = enemyCreate(enemyNum);

// Instantiating the player object
var player = new Player();
player.setup(playerStart);

// Sets the keys for a normal game
function keySet() {
    // Only allows the arrow keys to function
    // The 's' or space key will activate during the endgame scenario
    keys = {'l' : 'left',
            'r' : 'right',
            'u' : 'up',
            'd' : 'down',
            's' : 'nothing'
            };
}

keySet();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: keys.l,
        38: keys.u,
        39: keys.r,
        40: keys.d,
        // Add space key used for endgame scenario
        32: keys.s
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
