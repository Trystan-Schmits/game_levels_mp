import GameEnv from "./GameEnv.js";
import Character from "./Character.js";

class Rocket extends Character{
    // constructors sets up Character object 
    constructor(canvas, image, data, xPercentage, yPercentage, name, minPosition){
        super(canvas, image, data, 0.0, 0.2);

        this.gravityEnabled = false; //rocket, doesn't fall

        this.y = yPercentage;

        //Initial Position of Rocket
        this.x = -1000; //offscreen

        //Access in which a Goomba can travel    
        this.minPosition = minPosition * GameEnv.innerWidth;
        this.maxPosition = this.x + xPercentage * GameEnv.innerWidth;

        //Define Speed of Enemy
        if (["easy", "normal"].includes(GameEnv.difficulty)) {
            this.speed = this.speed * Math.floor(Math.random() * 1.5 + 2);
        } else if (GameEnv.difficulty === "hard") {
            this.speed = this.speed * Math.floor(Math.random() * 3 + 3);
        } else {
            this.speed = this.speed * 5
        }

        this.id = this.canvas.id;

        window.addEventListener("fireRocket",function(e){
            if (e.detail.rocket == this.id){
                console.log("fired")
                this.x = xPercentage * GameEnv.innerWidth;
                this.y = GameEnv.innerHeight/2 + (Math.random() - .5)*GameEnv.innerHeight
            }
        }.bind(this))
    }

    update() {
        super.update();

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

         //Chance for Goomba to turn Gold
         if (["normal","hard"].includes(GameEnv.difficulty)) {
            if (Math.random() < 0.00001) {
                this.canvas.style.filter = 'brightness(1000%)';
                this.immune = 1;
            }
        }
        
        //Immunize Goomba & Texture It
        if (GameEnv.difficulty === "hard") {
                this.canvas.style.filter = "invert(100%)";
                this.canvas.style.scale = 1.25;
        } else if (GameEnv.difficulty === "impossible") {
            this.canvas.style.filter = 'brightness(1000%)';
        }

        // Move the enemy
        this.x -= this.speed;

        this.playerBottomCollision = false;
    }
    
    // Player action on collisions
    collisionAction() {
    }
}
export default Rocket;