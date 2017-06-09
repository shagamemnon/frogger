// Initiate event listeners for mobile and desktop via jQuery
$(function(){
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        player.handleInput(allowedKeys[e.keyCode]);
    })
    $('#controls span').on("click", function(){
        var direction = $(this).attr('data-navigate');
        player.handleInput(direction);
    });
    $('#controls span').on("touchstart", function(e){
        e.preventDefault();
        var direction = $(this).attr('data-navigate');
        player.handleInput(direction);
    });
});


var util = {
    randomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    homeX: 210,
    homeY: 480
};


// Create Game object
var Game = function(enemyCount, speed) {
    this.enemyCount = enemyCount;
    this.speed = speed;
    this.score = score = 0;
};

Game.prototype = Object.create(Game.prototype);
Game.prototype.constructor = Game;


Game.prototype.addScore = function() {
    return $('#counter').hide().delay( 50 ).fadeIn( 250 ).attr('tabindex',score++).text(score);
};

// Create Character constructor
var Character = function(x, y, avatar, height, width) {
    this.x = x;
    this.y = y;
    this.avatar = avatar;
    this.height = avatar.height;
    this.width = avatar.width;
};


// Create Enemy object
var Enemy = function(x, y, avatar, height, width) {
    this.avatar = document.getElementById('enemy')
    Character.call(this, x, y, this.avatar, this.height, this.width);
}
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(x, y, dt) {
    var i = 0;
    var speed = util.randomNumber(1.75, 5.5);
    speed * dt;
    while (i < speed) {
        this.x++, i++;
    }
};

Enemy.prototype.render = function(x, y, avatar) {
    // !! Recommended Code
    ctx.drawImage(this.avatar, this.x, this.y);
};


var Player = function(x, y) {
    this.avatar = document.getElementById('hero');
    Character.call(this, x, y, this.avatar, this.height, this.width);
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;


Player.prototype.update = function() {
    return;
};


Player.prototype.squareOne = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.x = util.homeX;
    this.y = util.homeY;
    return;
};

// var score = 0;

Player.prototype.render = function() {
    ctx.drawImage(this.avatar, this.x, this.y);
};

Player.prototype.handleInput = function(input) {
    var distanceY = canvas.height / 6.3;
    var distanceX = canvas.width / 5;

    // Respond to keyup event by moving left, right, up, or down.
    switch (input) {
        case 'up':
            this.y -= distanceY;
            break;
        case 'down':
            this.y += distanceY;
            break;
        case 'left':
            this.x -= distanceX;
            break;
        case 'right':
            this.x += distanceX;
            break;
        default:
            return;
    }

    // If player moves off map, return to home position
    if (this.x < -10 || this.x > 415 || this.y > (util.homeY + 20)) {
        return this.squareOne();
    }
    if (this.y < -45) {
        return this.squareOne(), game.addScore();
    }
};


var game = new Game(3, util.randomNumber(400, 570)),
    player = new Player(util.homeX, util.homeY),
    allEnemies = [];

var checkCollisions = function() {
    allEnemies.forEach(function(elem, i, arr) {
        setTimeout(function(){
            if (elem.x > 0 && elem.x < 500) {
            if (elem.x < player.x + player.width &&
                elem.x + elem.width > player.x &&
                elem.y < (player.y) + (player.height) &&
                elem.height + elem.y > (player.y)) {
                    return player.squareOne();
            }
        }
    }, 100)
    })
};

function generateEnemies() {
    var enemy = new Enemy(util.randomNumber(-220, -300), util.randomNumber(120, 220));

    var cHeight = $('#canvas').height(),
        cWidth = $('#canvas').width(),
        offBoard = cWidth + enemy.avatar.height;

    for (var i = 0; i < game.enemyCount; i++) {
        allEnemies.push(enemy);
        console.log(allEnemies.length);
        if (allEnemies.length > game.enemyCount * 3) {
            return allEnemies.splice(0, game.enemyCount);
        }
    }
}
setInterval(generateEnemies, game.speed);
