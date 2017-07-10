# A Clone of the Classic Arcade Game, Frogger

## Play Game

1. Download the `.zip` file for this repository.
2. Open `index.html`, choose a player from the home menu and the game will start automatically! Use your keyboard  keys ( ⬅️ ⬇️ ➡️  ⬆️ ) to move across the board.
3. Goal of the game: reach the water blocks at the top of the screen without getting eaten by a bug.

## Rules

* If your player and bug collide, player will lose a point and automatically return to home position.
* If your player reaches the water, he/she will gain a point and automatically return to home position
* Each time your player achieves 10 points, he/she moves up one level. Once your player reaches a new level, he/she retains that level permanently. However, you cannot save your progress if you close the browser window!

* * *

## Build

This game uses the Javascipt Canvas API and OOJS techniques to draw animation frames and trigger game events. If you want to change how the game operates, read further.

**Core Functionality**
`app.js` relies on `init.js` to determine the image that will represent the player on the canvas. Aside from that, `app.js` provides the majority of the app's functionality.

**Important notes about engine.js**
Note that `engine.js` loops through `checkCollisions()`, along with the `update` and `render` methods on the `allEnemies` array and the `Player` object *at `window.requestAnimationRate()`*. For this reason, the global `Game` object - which is used to control the number of enemies on the canvas - is separated from the `Player` and `Enemy` objects. The `Game` object controls memory leak by adding and removing enemies on the canvas every few seconds, instead of running calculations at `window.requestAnimationRate()`.
