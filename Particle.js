class Particle{

    constructor(x,y){
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;
    }

    desenhar(ctx){

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();

    }




}