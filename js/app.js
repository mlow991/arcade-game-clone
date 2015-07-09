var Entity = function() {

}

Entity.prototype.init = function(loc) {
    this.x = loc[0];
    this.y = loc[1];
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
    this.sprite = 'images/enemy-bug.png';

    // Set enemy initial location, choose lane, set speed
    // x and y variables are set by the init function
    // lane and speed variables are randomly generated with randomNum fn
    var x;
    var y;
    var laneRange = [2, 4];
    var lane = randomNum(laneRange);
    var speedRange = [1, 50];
    var speed = randomNum(speedRange);
    var obj = Object.create(Enemy.prototype);
    return obj;
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.setup = function(obj, range) {
    obj.init(range);
    obj.speed = 10;
}

var fred = Enemy();
fred.setup(fred, [1,2]);


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
}

Player.prototype = Object.create(Enemy.prototype);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/*Instatiate an object like so:
    var dan = Enemy();
    dan.init(p1);
    where p1 is an array of x, y coordinates

*/


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
