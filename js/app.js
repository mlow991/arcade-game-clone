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

    // Set enemy initial location, choose lane, set speed
    // x and y variables are set by the init function
    // lane and speed variables are randomly generated with randomNum fn

    var obj = Object.create(Enemy.prototype);
    obj.sprite = 'images/enemy-bug.png';
    return obj;
}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.setup = function(obj, range) {
//    obj.init(range);
    obj.x = 1;
    obj.y = randomNum(range);
    obj.y = (obj.y * 83) - 28;
    obj.speed = randomNum([50,300]);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * this.speed);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    var obj = Object.create(Player.prototype);
    obj.sprite = 'images/char-boy.png';
    return obj;
}

Player.prototype = Object.create(Enemy.prototype);

Player.prototype.setup = function(obj, loc) {
    obj.x = loc[0];
    obj.y = loc[1];
}

Player.prototype.update = function(dt) {
    //Use the handleinput function to update current position
}

Player.prototype.handleInput = function(key) {
    if (key == 'left')
        return this.x - 101;
    if (key == 'up')
        return this.y - 83;
    if (key == 'right')
        return this.x + 101;
    if (key == 'down')
        return this.y +83;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/*Instatiate an object like so:
    var dan = Enemy();
    dan.init(p1);
    where p1 is an array of x, y coordinates
*/

var enemyRange = [1, 3];
var fred = Enemy();
fred.setup(fred, enemyRange);
var sam = Enemy();
sam.setup(sam, enemyRange);
var dave = Enemy();
dave.setup(dave, enemyRange);
var allEnemies = [fred, sam, dave];

var test = Entity();

var playerStart = [202, 332];
var player = Player();
player.setup(player, playerStart);


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
