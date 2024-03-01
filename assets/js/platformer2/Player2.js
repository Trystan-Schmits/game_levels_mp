    import GameEnv from './GameEnv.js';
    import Character from './Character.js';
    import playSound from './Audio.js';
    import GameControl from './GameControl.js';

    /**
     * @class Player class
     * @description Player.js key objective is to eent the user-controlled character in the game.   
     * 
     * The Player class extends the Character class, which in turn extends the GameObject class.
     * Animations and events are activated by key presses, collisions, and gravity.
     * WASD keys are used by user to control The Player object.  
     * 
     * @extends Character
     */

    /*
        created for boss fight, no goomba interaction, tree interaction, or pipe interaction
    */
    export class Player2 extends Character {
        // instantiation: constructor sets up player object 
        constructor(canvas, image, data, widthPercentage = 0.3, heightPercentage = 0.8) {
            super(canvas, image, data, widthPercentage, heightPercentage);
            // Player Data is required for Animations
            this.playerData = data;
            GameEnv.invincible = false; 

            // Player control data
            this.moveSpeed = this.speed * 3;
            this.pressedKeys = {};
            this.movement = {up: true, down: true, left: true, right: true};
            this.isIdle = true;
            this.directionKey = "d"; // initially facing right

            // Store a reference to the event listener function
            this.keydownListener = this.handleKeyDown.bind(this);
            this.keyupListener = this.handleKeyUp.bind(this);

            // Add event listeners
            document.addEventListener('keydown', this.keydownListener);
            document.addEventListener('keyup', this.keyupListener);

            GameEnv.player = this;
            this.transitionHide = false;
            this.shouldBeSynced = true;
            this.isDying = false;
            this.isDyingR = false;
            this.timer = false;

            this.name = GameEnv.userID;

            window.addEventListener("death",function(){
                this.death();
            }.bind(this))
        }

        /**
         * Helper methods for checking the state of the player.
         * Each method checks a specific condition and returns a boolean indicating whether that condition is met.
         */

        // helper: player facing left
        isFaceLeft() { return this.directionKey === "a"; }
        // helper: left action key is pressed
        isKeyActionLeft(key) { return key === "a"; }
        // helper: player facing right  
        isFaceRight() { return this.directionKey === "d"; }
        // helper: right action key is pressed
        isKeyActionRight(key) { return key === "d"; }
        // helper: dash key is pressed
        isKeyActionDash(key) { return key === "s"; }

        // helper: action key is in queue 
        isActiveAnimation(key) { return (key in this.pressedKeys) && !this.isIdle; }
        // helper: gravity action key is in queue
        isActiveGravityAnimation(key) {
            var result = this.isActiveAnimation(key) && (this.bottom <= this.y || this.movement.down === false);
        
            // return to directional animation (direction?)
            if (this.bottom <= this.y || this.movement.down === false) {
                this.setAnimation(this.directionKey);
            }
        
            return result;
        }

        /**
         * This helper method that acts like an animation manager. Frames are set according to player events.
         *  - Sets the animation of the player based on the provided key.
         *  - The key is used to look up the animation frame and idle in the objects playerData.
         * If the key corresponds to a left or right movement, the directionKey is updated.
         * 
         * @param {string} key - The key representing the animation to set.
         */
        setAnimation(key) {
            // animation comes from playerData
            var animation = this.playerData[key]
            // direction setup
            if (this.isKeyActionLeft(key)) {
                this.directionKey = key;
                this.playerData.w = this.playerData.wa;
            } else if (this.isKeyActionRight(key)) {
                this.directionKey = key;
                this.playerData.w = this.playerData.wd;
            }
            // set frame and idle frame
            this.setFrameY(animation.row);
            this.setMaxFrame(animation.frames);
            if (this.isIdle && animation.idleFrame) {
                this.setFrameX(animation.idleFrame.column)
                this.setMinFrame(animation.idleFrame.frames);
            }
        }
    
        /**
         * gameloop: updates the player's state and position.
         * In each refresh cycle of the game loop, the player-specific movement is updated.
         * - If the player is moving left or right, the player's x position is updated.
         * - If the player is dashing, the player's x position is updated at twice the speed.
         * This method overrides Character.update, which overrides GameObject.update. 
         * @override
         */

        update() {
            //Update the Player Position Variables to match the position of the player
            GameEnv.PlayerPosition.playerX = this.x;
            GameEnv.PlayerPosition.playerY = this.y;

            // Player moving right 
            if (this.isActiveAnimation("a")) {
                if (this.movement.left) this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left
            }
            // Player moving left
            if (this.isActiveAnimation("d")) {
                if (this.movement.right) this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
            }
            // Player moving at dash speed left or right 
            if (this.isActiveAnimation("s")) {}

            // Player jumping
            if (this.isActiveGravityAnimation("w")) {
                playSound.playJump();
                if (this.gravityEnabled) {
                    // Vertical jump height calculation
                    let verticalJumpHeight;
                    if (GameEnv.difficulty === "easy") {
                        verticalJumpHeight = this.bottom * 0.50;  // bottom jump height
                    } else if (GameEnv.difficulty === "normal") {
                        verticalJumpHeight = this.bottom * 0.40;
                    } else {
                        verticalJumpHeight = this.bottom * 0.30;
                    }
        
                    // Horizontal jump distance calculation based on jump time
                    const jumpTime = 3;
                    const horizontalSpeed = 40;
                    const horizontalJumpDistance = horizontalSpeed * jumpTime;
        
                    // Update player position
                    this.y -= verticalJumpHeight;
                    if (this.directionKey === "a") {
                        this.x -= horizontalJumpDistance;
                    } else if (this.directionKey === "d") {
                        this.x += horizontalJumpDistance;
                    }
                } else if (this.movement.down === false) {
                    this.y -= (this.bottom * .15);  // platform jump height
                }
            }
            //Prevent Player from Leaving from Screen
            if (this.x < 0) {
                this.x = 1;

                GameEnv.backgroundHillsSpeed = 0;
                GameEnv.backgroundMountainsSpeed = 0;
            }
            if (this.x > GameEnv.innerWidth) {
                this.x = GameEnv.innerWidth;

                GameEnv.backgroundHillsSpeed = 0;
                GameEnv.backgroundMountainsSpeed = 0;
            }

            // Perform super update actions
            super.update();
        }


    /**
     * gameloop:  responds to level change and game over destroy player object
     * This method is used to remove the event listeners for keydown and keyup events.
     * After removing the event listeners, it calls the parent class's destroy player object. 
     * This method overrides GameObject.destroy.
     * @override
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);
        // Call the parent class's destroy method
        super.destroy();
    }

    death(){
        this.canvas.style.transition = "transform 0.5s";
        this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
        playSound.playPlayerDeath();

        if (this.isDying == false) {
            this.isDying = true;
            setTimeout(async() => {
            await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            console.log("level restart")
            }, 900); 
        }
    }
    /**
     * gameloop: performs action on collisions
     * Handles the player's actions when a collision occurs.
     * This method checks the collision, type of game object, and then to determine action, e.g game over, animation, etc.
     * Depending on the side of the collision, it performs player action, e.g. stops movement, etc.
     * This method overrides GameObject.collisionAction. 
     * @override
     */
    collisionAction() {
        // Block collision check
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.this.top) {
                this.movement.down = false; // enable movement down without gravity
                this.gravityEnabled = false;
                this.setAnimation(this.directionKey); // set animation to direction
            }
        }
        // Fall Off edge of Jump platform
        else {
            this.movement.down = true;          
            this.gravityEnabled = true;
        }

        if (this.collisionData.touchPoints.other.id.includes("rocket")) {
            this.death();
        }

        if (this.collisionData.touchPoints.other.id.includes("disk")) {
            this.death();
        }

        if (this.collisionData.touchPoints.other.id == "dog"){
                window.dispatchEvent(new Event("dog"));
                this.x = 0
        }
    }


        /**
         * Handles the keydown event.
         * This method checks the pressed key, then conditionally:
         * - adds the key to the pressedKeys object
         * - sets the player's animation
         * - adjusts the game environment
         *
         * @param {Event} event - The keydown event.
         */    
        
    handleKeyDown(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                //If both 'a' and 'd' are pressed, then only 'd' will be inputted
                //Originally if this is deleted, player would stand still. 
                if (this.pressedKeys['a'] && key === 'd') {
                    delete this.pressedKeys['a']; // Remove "a" key from pressedKeys
                    return; //(return) = exit early
                } else if (this.pressedKeys['d'] && key === 'a') {
                    // If "d" is pressed and "a" is pressed afterward, ignore "a" key
                    return;
                }
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.isIdle = false;
                GameEnv.transitionHide = true;
            }
            // dash action on
            if (this.isKeyActionDash(key)) {
                GameEnv.dash = true;
                this.canvas.style.filter = 'invert(1)';
            }
            // parallax background speed starts on player movement
            if (this.isKeyActionLeft(key) && this.x > 2) {
                GameEnv.backgroundHillsSpeed = -0.4;
                GameEnv.backgroundMountainsSpeed = -0.1;
            } else if (this.isKeyActionRight(key)) {
                GameEnv.backgroundHillsSpeed = 0.4;
                GameEnv.backgroundMountainsSpeed = 0.1;
            } 
            /* else if (this.isKeyActionDash(key) && this.directionKey === "a") {
                GameEnv.backgroundHillsSpeed = -0.4;
                GameEnv.backgroundMountainsSpeed = -0.1;
            } else if (this.isKeyActionDash(key) && this.directionKey === "d") {
                GameEnv.backgroundHillsSpeed = 0.4;
                GameEnv.backgroundMountainsSpeed = 0.1;
            } */ // This was unnecessary, and broke hitboxes / alloswed diffusion through matter
            this.pressedKeys[event.key] = this.playerData[key];
            this.setAnimation(key);
            // player active
            this.isIdle = false;
            GameEnv.transitionHide = true;
        }
    }


    /**
     * Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * *
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            this.setAnimation(key);  
            // player idle
            this.isIdle = true;
            // dash action off
            if (this.isKeyActionDash(key)) {
                this.canvas.style.filter = 'invert(0)';
                GameEnv.dash = false;
            } 
            // parallax background speed halts on key up
            if (this.isKeyActionLeft(key) || this.isKeyActionRight(key) || this.isKeyActionDash(key)) {
                GameEnv.backgroundHillsSpeed = 0;
                GameEnv.backgroundMountainsSpeed = 0;

            }
        }
    }
}

    export default Player2;