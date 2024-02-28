import GameObject from './GameObject.js';
import GameEnv from './GameEnv.js';
import Animation from './Animation.js';
/*
    checklist:
    -giant dog as boss, gets larger with difficulty: _
    -Animation of walking in (level screen effect?): _
    -3 hit kill (level clear condition): _
    -death animation: _
    -death sound (slowed down meow): _
    -boss attacks: _
*/
export class Dog extends GameObject {
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data, 0.0, 0.2);

        this.data = data;
        this.scaleSize = data.scaleSize;
        // sprite sizes
        this.spriteWidth = data.width;
        this.spriteHeight = data.height;
        //canvasSizes
        var scaledCharacterHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        var canvasScale = scaledCharacterHeight/this.spriteHeight;
        this.canvasHeight = this.spriteHeight * canvasScale;
        this.canvasWidth = this.spriteWidth * canvasScale;
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.y = yPercentage;
        //Initial Position of Goomba
        this.x = xPercentage * GameEnv.innerWidth;

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = GameEnv.innerWidth;

        this.name = "dog"

        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.speed = this.speed * 5
        }

        var animationData = {size:[this.data.width,this.data.height],bark:{row:2,maxFrames:48,frameRate:24}};
        this.Animation = new Animation(this.canvas,this.image,animationData)
        this.Animation.changeAnimation("bark")
    }

    update() {
        super.update();
        
        // Check for boundaries
        if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
            this.speed = -this.speed;
        };

        // Every so often change direction
        switch(GameEnv.difficulty) {
            case "normal":
                if (Math.random() < 0.005) this.speed = -this.speed;
                break;
            case "hard":
                if (Math.random() < 0.01) this.speed = -this.speed;
                break;
            case "impossible":
                if (Math.random() < 0.02) this.speed = -this.speed;
                break;
        }

        // Move the enemy
        this.x -= this.speed;

        this.playerBottomCollision = false;
    }
    
    size() {
        // set Canvas scale,  80 represents size of Character height when inner Height is 832px
        var scaledCharacterHeight = GameEnv.innerHeight * (this.scaleSize / 832);
        var canvasScale = scaledCharacterHeight/this.spriteHeight;
        this.canvasHeight = this.spriteHeight * canvasScale;
        this.canvasWidth = this.spriteWidth * canvasScale;

        // set variables used in Display and Collision algorithms
        this.bottom = GameEnv.bottom - this.canvasHeight;
        this.collisionHeight = this.canvasHeight;
        this.collisionWidth = this.canvasWidth;

        // calculate Proportional x and y positions based on size of screen dimensions
        if (GameEnv.prevInnerWidth) {
            const proportionalX = (this.x / GameEnv.prevInnerWidth) * GameEnv.innerWidth;

            // Update the x and y positions based on the proportions
            this.setX(proportionalX);
            this.setY(this.bottom);
        } else {
            // First Screen Position
            this.setX(0);
            this.setY(this.bottom);
        }
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left || this.collisionData.touchPoints.other.right) {
                this.speed = -this.speed;            
            }
        }
    }

    update() {
        if (this.bottom > this.y && this.gravityEnabled){
            this.y += GameEnv.gravity;
        }
        this.collisionChecks();
    }

    draw(){
        this.canvas.style.width = `${this.canvas.width}px`;
        this.canvas.style.height = `${this.canvas.height}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.x}px`; // Set character horizontal position based on its x-coordinate
        this.canvas.style.top = `${this.y}px`; // Set character up and down position based on its y-coordinate
    }
}

export default Dog;