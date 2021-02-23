class Particle{

    constructor(x,y){
        this.x = x;
        this.y = y;

        this.u = 0;
        this.v = 0;
        this.cor = "blue"
    }

    desenhar(ctx){

        ctx.fillStyle = this.cor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fill();

    }




}