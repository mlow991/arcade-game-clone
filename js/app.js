var yOffset = -28;

var Entity = function() {

}

Entity.prototype.init = function(loc) {
    this.x = loc[0];
    this.y = loc[1];
}

// Returns the player back to origin if he has collided with an enemy
Entity.prototype.collision = function() {
    allEnemies.forEach(function(enemy) {
            if (enemy.y == player.y && Math.abs(enemy.x - player.x) <= 20) {
               move.x = playerStart[0];
               move.y = playerStart[1]; 
            }
        });
}

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
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    // Set enemy initial location, choose lane, set speed
    // x and y variables are set by the init function
    // lane and speed variables are randomly generated with randomNum fn  
    this.sprite = 'images/enemy-bug.png';
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.setup = function(range) {
//    obj.init(range);
    this.x = -101;
    this.y = randomNum(range);
    this.y = (this.y * 83) + yOffset;
    this.speed = randomNum([50,300]);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
    if (this.x > 505) {
        this.x = -101;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    gameScore();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(Enemy.prototype);

Player.prototype.setup = function(loc) {
    this.x = loc[0];
    this.y = loc[1];
}

Player.prototype.update = function(dt) {
    //Use the handleInput function to update current position from keystrokes.
    //Bounds are (x: 0 to 404), (y: 55 to 387).
    //Global object 'move' holds the values for keys pressed.
    //When 'move' encounters a value that is offscreen, it does not update the player object.
    //It then resets its value to the bound of stoppage.
   console.log(move);
    player.collision();
    if (move.x >= 0 && move.x <= 404) {
        this.x = move.x;
    } else {
        move.x = this.x;
    }
    //If the player has scored send him back to the origin and reset the global move variable
    if (move.y < 55) {
        this.x = playerStart[0];
        this.y = playerStart[1];
        move.y = this.y;
        move.x = this.x;
        score++;
    } else if (move.y <= 387) {
        this.y = move.y;
    } else {
        move.y = this.y;
    }

}


Player.prototype.handleInput = function(key) {
    //The input variable is a string left, right, up, down.
    //It adds or subtracts from the global position variable for the player.
    //The logic for player movement is within the update function.
    if (key == 'left')
        move.x += -101;
    if (key == 'up')
        move.y += -83;
    if (key == 'right')
        move.x += 101;
    if (key == 'down')
        move.y += 83;
};

var score = 0;


function gameScore() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "yellow";
    ctx.fillText("Score: " + score, 10, 100);

}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/*Instatiate an object like so:
    var dan = Enemy();
    dan.init(p1);
    where p1 is an array of x, y coordinates
*/

var enemyRange = [1, 3];
var fred = new Enemy();
fred.setup(enemyRange);
var sam = new Enemy();
sam.setup(enemyRange);
var dave = new Enemy();
dave.setup(enemyRange);
var allEnemies = [fred, sam, dave];

var test = Entity();

var playerStart = [202, 332 + yOffset];
var move = {x : playerStart[0], y : playerStart[1]};
var player = new Player();
player.setup(playerStart);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
