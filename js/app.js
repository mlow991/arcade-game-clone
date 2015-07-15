var yOffset = -28;
var gridX = 101;
var gridY = 83;
var hitBox = 55;
var heartNum = 1;
var lives = heartNum;
var score = {val : 0, string : "00000"};
var start = 0;
var enSpeed = [50, 300];
var keys;

var Entity = function() {

}

// Returns the player back to origin if he has collided with an enemy
Entity.prototype.collision = function() {
    allEnemies.forEach(function(enemy) {
            if (enemy.y == player.y && Math.abs(enemy.x - player.x) <= hitBox) {
               move.x = playerStart[0];
               move.y = playerStart[1];
               lives--;
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
    this.x = -gridX;
    this.y = randomNum(range);
    this.y = (this.y * gridY) + yOffset;
    this.speed = randomNum(enSpeed);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x = this.x + (dt * this.speed);
    if (this.x > 5 * gridX) {
        this.x = -gridX;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    gameScore();
    if (lives <= 0) {
        roundedRectFilled();
        ctx.font = "50px Verdana";
        ctx.fillStyle = "red";
        ctx.fillText("GAME OVER", 100, 300);
        endPrompt();
    }
    playerLives(lives);
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

Player.prototype.update = function() {
    //Use the handleInput function to update current position from keystrokes.
    //Bounds are (x: 0 to 404), (y: 55 to 387).
    //Global object 'move' holds the values for keys pressed.
    //When 'move' encounters a value that is offscreen, it does not update the player object.
    //It then resets its value to the bound of stoppage.
//   console.log(move);
    player.collision();
    if (move.x >= 0 && move.x <= 4 * gridX) {
        this.x = move.x;
    } else {
        move.x = this.x;
    }
    //If the player has scored send him back to the origin and reset the global move variable
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


Player.prototype.handleInput = function(key) {
    //The input variable is a string left, right, up, down.
    //It adds or subtracts from the global position variable for the player.
    //The logic for player movement is within the update function.
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

var rectX = 50;
var rectY = 250;
var rectW = 420;
var rectH = 120;
var rectR = 15;

function roundedRectFilled () {
    ctx.fillStyle = "blue";
    ctx.beginPath();
 
    ctx.moveTo(rectX+rectR, rectY);
 
    ctx.lineTo(rectX+rectW-rectR, rectY);
 
    ctx.quadraticCurveTo(rectX+rectW, rectY, rectX+rectW, rectY+rectR);
 
    ctx.lineTo(rectX+rectW, rectY+rectH-rectR);
 
    ctx.quadraticCurveTo(rectX+rectW, rectY+rectH, rectX+rectW-rectR, rectY+rectH);
 
    ctx.lineTo(rectX+rectR, rectY+rectH);
 
    ctx.quadraticCurveTo(rectX, rectY+rectH, rectX, rectY+rectH-rectR);
 
    ctx.lineTo(rectX, rectY+rectR);
 
    ctx.quadraticCurveTo(rectX, rectY, rectX+rectR, rectY);
 
    ctx.fill();
}

function endPrompt() {
    ctx.font = "30px Verdana";
    ctx.fillText("Press SPACE to continue...", 60, 350);
    if (start > 0) {
        start = 0;
        lives = heartNum;
        score.val = 0;
        keySet();
    } else {
        for (var key in keys) {
            keys[key] = 'nothing';
        }
        keys.s = 'space';
    }
}

function gameScore() {
    var count = score.val.toString().length;
    ctx.font = "25px Consolas";
    ctx.fillStyle = "yellow";
    ctx.fillText(score.string.substring(0, score.string.length - count + 1) + score.val, 10, 80);
}

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
var allEnemies = [fred];

var test = Entity();

var playerStart = [2 * gridX, 4 * gridY + yOffset];
var move = {x : playerStart[0], y : playerStart[1]};
var player = new Player();
player.setup(playerStart);

function keySet() {
    keys = {'l' : 'left',
            'r' : 'right',
            'u' : 'up',
            'd' : 'down',
            's' : 'space'
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
        32: keys.s
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
