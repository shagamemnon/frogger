var Engine = (function(global) {

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    function main() {

        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;

        win.requestAnimationFrame(main);
    }

    function init() {
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }


    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'https://shagamemnon.github.io/frogger/images/water-block.png', // Top row is water
                'https://shagamemnon.github.io/frogger/images/stone-block.png', // Row 1 of 3 of stone
                'https://shagamemnon.github.io/frogger/images/stone-block.png', // Row 2 of 3 of stone
                'https://shagamemnon.github.io/frogger/images/stone-block.png', // Row 3 of 3 of stone
                'https://shagamemnon.github.io/frogger/images/grass-block.png', // Row 1 of 2 of grass
                'https://shagamemnon.github.io/frogger/images/grass-block.png' // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row,
            col;


        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }


    function renderEntities() {

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }


    Resources.load([
        'https://shagamemnon.github.io/frogger/images/stone-block.png',
        'https://shagamemnon.github.io/frogger/images/water-block.png',
        'https://shagamemnon.github.io/frogger/images/grass-block.png',
        'https://shagamemnon.github.io/frogger/images/enemy-bug.png',
        'https://shagamemnon.github.io/frogger/images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
