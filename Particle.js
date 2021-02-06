class Particle{

    constructor(x,y){
        this.x = x;
        this.y = y;

        this.u = 0;
        this.v = 0;
    }

    desenhar(ctx){

        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();

    }




}