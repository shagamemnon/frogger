var layout = '<div class="game-title" style="position:fixed;left:0;right:0;top:100px;text-align:center"><h1>Frogger</h1><h3>Click a character to get started.</h3></div><div class="player-selection"> <img class="player" src="https://shagamemnon.github.io/frogger/images/char-boy.png" id="hero" alt="char-boy"><img class="player" src="https://shagamemnon.github.io/frogger/images/char-princess-girl.png" alt="char-princess-girl"> <img class="player" src="https://shagamemnon.github.io/frogger/images/char-pink-girl.png" alt="char-pink-girl"> </div><img id="enemy" src="https://shagamemnon.github.io/frogger/images/enemy-bug.png" style="display:none" alt="enemy"> <canvas id="canvas" class="game-canvas" style="margin-top:5px"></canvas> <div id="scoreboard" class="game-scoreboard"> <div class="row"><span>Level</span> <br><span id="level" tabindex="1">1</span> </div><div class="row"><span>Score</span> <br><span id="counter" class="game-score" tabindex="0">0</span> </div></div><div class="pause pause-button"></div><div class="play play-button"></div><div class="html-space"><input id="message-input" placeholder="enter message">';

// NOTE: innerHTML is an insecure technique for populating the DOM and should not be used in production environments. it is used here for convenience
document.body.innerHTML = layout;

// UTILITIES
var randomInteger = {
    inRange: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    inArray: function(array) {
        var theValues = Array.from(array);
        return theValues[Math.floor(theValues.length * Math.random())];
    }
};


// GAME SETUP
var layout = {
    boundaryLeft: function() {
        // Return left boundary between window edge and canvas
        return -((window.innerWidth - layout.cWidth) / 2);
    },

    cHeight: 606,

    cWidth: 505,

    homeX: 202,

    homeY: 480,

    pause: '.pause-button',

    play: '.play-button',

    playerImg: function() {
        return document.querySelector('img.player')
    },

    updateCounter: function(newScore, selector) {
        var scoreCounter = document.querySelector("" + selector + "");
        scoreCounter.textContent = newScore;
        scoreCounter.tabIndex = newScore;
    },

    waterBreak: {
        end: function() {
            layout.pause.className = 'pause-button is-visible';
            layout.play.className = 'play-button';
        },

        start: function() {
            layout.play.className = 'play-button is-visible';
            layout.pause.className = 'pause-button';
        }
    }
};

var score = 0,
    level = 1,
    moveX = layout.cHeight / 6,
    moveY = layout.cWidth / 5;


// Create Game object, define number of enemies to be created at specified interval.
var Game = function(enemyCount) {
    this.enemyCount = enemyCount;

    // enemyInterval is set here in the Game constructor
    // but not invoked until generateEnemies()
    this.enemyInterval = randomInteger.inRange(500, 670);
    this.score = score = 0;
    this.level = level = 1;
};
Game.prototype = Object.create(Game.prototype);
Game.prototype.constructor = Game;


// Use browser size to set initial enemy x and y coordinates
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


// Character constructor
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


// Set enemy movement across x-axis to a random number of pixels between 4 and 7.
// Multiply movement by dt (Date time) function to ensure cross-OS consistency.
Enemy.prototype.update = function(dt) {
    this.x = this.x + (this.speed * dt);
};


Enemy.prototype.render = function(x, y, avatar) {
    ctx.drawImage(this.avatar, this.x, this.y);
};


var Player = function(x, y) {
    Character.call(this, x, y, document.querySelector('#hero'), this.height, this.width);
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





// Show canvas, selected avatar and enable keyboard direction keys
Game.prototype.start = function() {
    var canvas = document.getElementById('canvas');
    canvas.classList += ' active';
    document.addEventListener("keyup", this.toggleKeys);
    layout.waterBreak.end();
    this.enemyCount = 3;
};

Game.prototype.pause = function() {
    document.removeEventListener("keyup", this.toggleKeys);
    layout.waterBreak.start();
    this.enemyCount = 0;
};


// Hide canvas, allow re-selection of avatar and disable keyboard direction keys
Game.prototype.levelUp = function() {
    return layout.updateCounter(level++, '#level');
};



// INITALIZE GAME
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


var heroes = document.querySelectorAll('.player');
var heroContainer = document.querySelector('.player-selection');
var gameTitle = document.querySelector('.game-title');

heroes.forEach(function(elem) {
    elem.addEventListener('click', function() {
        choosePlayer(this);
        setTimeout(game.start(), 450);
    })
});


var choosePlayer = function(selector) {
    heroes.forEach(function(elem) {
        if (elem !== selector) {
            elem.id = "";
        } else {
            selector.id = "hero";
        }
    })
    selector.classList += ' moveDown';
    heroContainer.classList += ' game-active';
    gameTitle.style.display = 'none';
    player = new Player(layout.homeX, layout.homeY);
};


function pauseGame() {
    return game.pause();
}
document.querySelector(layout.pause).addEventListener('click', pauseGame);


function resumeGame() {
    return game.start();
}
document.querySelector(layout.play).addEventListener('click', resumeGame);


// Detect collisions using axis-aligned bounding box technique
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

// Control key input
Game.prototype.toggleKeys = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
};
