class Animation{
    constructor(canvas,image,animationData){
        this.canvas = canvas;
        this.image = image;
        this.animationData = animationData;
        this.row = 0;
        this.frame = 0;
        this.maxFrames = 0;
        this.frameRate = 60;
        this.SpriteSize = animationData.size;
        this.animationFrameId = "";
        this.animationNumber = 0;
    }

    drawFrame(){
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        ctx.drawImage(this.image,this.frame*this.SpriteSize[0],this.row*this.SpriteSize[1],this.SpriteSize[0],this.SpriteSize[1],0,0,this.canvas.width,this.canvas.height);
    }

    updateFrame(){
        this.frame = (this.frame+1)%this.maxFrames;
        this.drawFrame();
    }

    runAnimation(number){
        setTimeout(function(){
                this.animationFrameId = window.requestAnimationFrame(this.updateFrame.bind(this));
                if(this.animationNumber == number){
                    this.runAnimation(number);
                }
        }.bind(this),1000/this.frameRate)
    }

    stopAnimation(){
        window.cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = "";
        this.animationNumber += 1;
    }

    changeAnimation(key){
        this.stopAnimation();
        this.frame = 0;
        this.row = this.animationData[key].row;
        this.maxFrames = this.animationData[key].maxFrames;
        this.frameRate = this.animationData[key].frameRate;
        this.runAnimation(this.animationNumber.valueOf());
    }
}
export default Animation;