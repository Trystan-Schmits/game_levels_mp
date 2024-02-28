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

        var animationData = {size:[this.data.width,this.data.height],walk:{row:2,maxFrames:48,frameRate:24},bark:{row:1,maxFrames:48,frameRate:24}};
        this.Animation = new Animation(this.canvas,this.image,animationData)
        this.Animation.changeAnimation("walk");

        this.isMoving = true;

        this.odds = 500; //higher # == lower odds
        this.health = 3;
        this.immune = false;

        window.addEventListener("dog",function(){
            console.log("fired")
            if(this.immune == false){
                this.health -=1;
                this.immune = true;
                this.odds = 50;
                this.canvas.style.filter = "invert(100)";
                setTimeout(
                    function(){
                        this.canvas.style.filter = "invert(0)";
                        this.immune = false
                        this.odds = 500;
                    }.bind(this), 15000)
            } 
            else{
                window.dispatchEvent(new Event("death"));
            }
        }.bind(this))
    }

    update() {
        
        if (this.isMoving){
            // Check for boundaries
            if (this.x <= this.minPosition || (this.x + this.canvasWidth >= this.maxPosition)) {
                this.speed = -this.speed;
            };

            // Move the enemy
            this.x -= this.speed;

            this.playerBottomCollision = false;
            if (this.bottom > this.y && this.gravityEnabled){
                this.y += GameEnv.gravity;
            }
            if(Math.floor(Math.random()*this.odds)==1){ //begin bark attack
                this.isMoving = false;
                this.Animation.changeAnimation("bark");
                for (let i = 1;i<17;i++){
                    console.log("rocket"+String(i))
                    setTimeout(function(){
                        window.dispatchEvent(new CustomEvent("fireRocket",{detail:{rocket:"rocket"+String(i)}}))
                    },500*i)
                }
                setTimeout(function(){
                    this.Animation.changeAnimation("walk");
                    this.isMoving = true;
                }.bind(this),8000)
            }
        }
        this.collisionChecks();
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