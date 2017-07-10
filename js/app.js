"use strict;"

var randomInteger = {
    inRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    inArray: function(array) {
        var theValues = Array.from(array);
        return theValues[Math.floor(theValues.length * Math.random())];
    }
};

var score = 0,
    level = 1,
    pause = $('#pause'),
    play = $('#play'),
    playerImg = $('img.player');

var layout = {
    cHeight: 606,
    cWidth: 505,
    homeX: 202,
    homeY: 480,
    updateCounter: function(newScore, selector) {
        return $(""+selector+"").hide().delay(50).fadeIn(250).attr('tabindex', newScore).text(newScore);
    },
    // Return left boundary between window edge and canvas
    boundaryLeft: function() {
        return -((window.innerWidth - layout.cWidth) / 2);
    }
};

var moveX = layout.cHeight / 6,
    moveY = layout.cWidth / 5;

// Create Game object, define number of enemies to be created at specified interval. enemyInterval is set here in the Game object but not referenced until the generateEnemies function at the end of this file.
var Game = function(enemyCount) {
    this.enemyCount = enemyCount;
    this.enemyInterval = randomInteger.inRange(500, 670);
    this.score = score = 0;
    this.level = level = 1;
};

Game.prototype = Object.create(Game.prototype);
Game.prototype.constructor = Game;

// Use brower size to set initial enemy x and y coordinates
Game.prototype.enemyRangeX = function() {
    return randomInteger.inRange(layout.boundaryLeft() * 1.5, layout.boundaryLeft() * 0.5);
};

Game.prototype.enemyRangeY = function() {
    return randomInteger.inArray([102, 169, 270]);
};

// Increment HTML counter every time player reaches water
Game.prototype.updateScore = function(counter) {
    if (counter === 'add') {
        score++;
    }
    if (counter === 'remove' && (score > 0)) {
        score--;
    }
    if (score / level === 10) {
        level++;
        layout.updateCounter(level, '#level');
    }
    return layout.updateCounter(score, '#counter');
};


// Create Character constructor
var Character = function(x, y, avatar, height, width) {
    this.x = x;
    this.y = y;
    this.avatar = avatar;
    this.height = avatar.height;
    this.width = avatar.width;
};


var Enemy = function(x, y, avatar, height, width, speed) {
    Character.call(this, x, y, document.getElementById('enemy'), this.height, this.width);
    this.speed = randomInteger.inRange(125, 150);
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

// Set enemy movement across x-axis to a random number of pixels between 4 and 7. Multiply movement by dt (Date time) function to ensure cross-browser and cross-OS consistency
Enemy.prototype.update = function(dt) {
    this.x = this.x + (this.speed * dt);
};

Enemy.prototype.render = function(x, y, avatar) {
    ctx.drawImage(this.avatar, this.x, this.y);
};

var Player = function(x, y) {
    Character.call(this, x, y, document.getElementById('hero'), this.height, this.width);
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// Return player to initial position set in layout data
Player.prototype.squareOne = function() {
    ctx.clearRect(0, 0, layout.cWidth, layout.cHeight);
    this.x = layout.homeX;
    this.y = layout.homeY;
    return;
};

Player.prototype.render = function() {
    ctx.drawImage(this.avatar, this.x, this.y);
};

Player.prototype.handleInput = function(input) {
    // Respond to keyup event by moving left, right, up, or down.
    switch (input) {
        case 'up':
            this.y -= moveY
            break;
        case 'down':
            this.y += moveY
            break;
        case 'left':
            this.x -= moveX
            break;
        case 'right':
            this.x += moveX
            break;
        default:
            return;
    }

    // If player moves off map, return to home position
    if (this.x < -10 || this.x > 415 || this.y > (layout.homeY + 20)) {
        return this.squareOne();
    }
    // If player reaches water, return to home position and increment game score
    if (this.y < 90) {
        return this.squareOne(), game.updateScore('add');
    }
};

// Initialize Game, Player and allEnemies. Game and Player Parameters are defined in toggleCanvas
Game.prototype.toggleKeys = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};

// Show canvas, selected avatar and enable keyboard direction keys
Game.prototype.turnOn = function() {
    $('.player-selection').hide();
    $('#canvas').addClass('active');
    document.addEventListener("keyup", this.toggleKeys);
    pause.show();
    play.hide();
    this.enemyCount = 3;
};

Game.prototype.pause = function() {
    document.removeEventListener("keydown", this.toggleKeys);
    pause.hide();
    play.show();
    this.enemyCount = 0;
};

// Hide canvas, allow re-selection of avatar and disable keyboard direction keys
Game.prototype.levelUp = function() {
    return layout.updateCounter(level++, '#level');
};

var game = new Game(),
    player = new Player(),
    allEnemies = [];

// Generate number of enemies specified in game params, and place each enemy
// at x and y coordinates specified in Game.prototype object
function generateEnemies() {
    var enemy = new Enemy(game.enemyRangeX(), game.enemyRangeY());

    for (var i = 0; i < game.enemyCount; i++) {
        allEnemies.push(enemy);

        // Regularly dump enemies from allEnemies array to prevent memory leak
        if (allEnemies.length > game.enemyCount * 6) {
            return allEnemies.splice(0, game.enemyCount);
        }
    }
}
setInterval(generateEnemies, game.enemyInterval);


function choosePlayer(e) {
    $(this).attr('id', 'hero').addClass('moveDown').siblings().removeAttr('id').hide();
    setTimeout(game.turnOn(), 450);
    player = new Player(layout.homeX, layout.homeY);
}
playerImg.on('click', choosePlayer);


function pauseGame() {
    return game.pause();
}
pause.on('click', pauseGame);

function resumeGame() {
    return game.turnOn();
}
play.on('click', resumeGame);

// Check collisions using Axis-Aligned Bounding Box method for collision detection
var checkCollisions = function() {
    allEnemies.forEach(function(elem, i, arr) {

        var characterArr = [player.width, player.height, elem.width, elem.height];
        var charBubbles = characterArr.map(function(num) {
            return num * 0.75;
        });

        if (elem.x > 0 && elem.x < 500) {
            if (elem.x < player.x + charBubbles[0] &&
                elem.x + charBubbles[2] > player.x &&
                elem.y < (player.y) + (charBubbles[1]) &&
                charBubbles[3] + elem.y > (player.y)) {
                    return player.squareOne(), game.updateScore("remove");
            }
        }
    });
};
