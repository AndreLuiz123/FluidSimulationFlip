class MacGrid{

    constructor(N, dt){

        this.N = N;
        this.linhas = N;
        this.colunas = N;

        this.dt = dt;
        this.dx = 500/N;

        this.celulas = [];

        this.u = this.criarGrade(N+1, N);
        this.v = this.criarGrade(N, N+1);

        this.u_saved = this.criarGrade(N+1, N);
        this.v_saved = this.criarGrade(N, N+1);

        this.p = this.criarGrade(N, N);

        this.phi = this.criarGrade(N,N);

        this.particulas = [];

    }


    criarGrade(colunas, linhas){

        var novaGrade = [];

        for(var i=0 ; i<colunas; i++){
            novaGrade[i] = [];
            for(var j=0; j<linhas; j++){
                novaGrade[i][j] = 0;
            }
        }

        return novaGrade;
    }

    desenharVelocidades(ctx){
        for(var i=0; i<this.u.length; i++)
        for(var j=0; j<this.u[i].length; j++)
        {
            ctx.fillStyle = "pink";
            ctx.fillRect(i*this.dx-1.5,j*this.dx-1.5+this.dx/2,3,3);
        }    

        for(var i=0; i<this.v.length; i++)
        for(var j=0; j<this.v[i].length; j++)
        {
            ctx.fillStyle = "green";
            ctx.fillRect(i*this.dx-1.5+this.dx/2,j*this.dx-1.5,3,3);
        }    

    }


    desenhar(ctx){

        for(var i=0 ; i<this.N; i++){
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(i*this.dx,0);
            ctx.lineTo(i*this.dx,500);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0,i*this.dx);
            ctx.lineTo(500,i*this.dx);
            ctx.stroke();
        }

        this.desenharVelocidades(ctx);

        for(var i=0; i<this.particulas.length; i++)
            this.particulas[i].desenhar(ctx);

    }

    createParticles(x,y,r){
        var newParticleX = 0;
        var newParticleY = 0;
        
        for(var i=0; i<this.colunas; i++)
        for(var j=0; j<this.linhas; j++)
        {
            for(var c=0; c<4; c++)
            {

                newParticleX =  this.dx*i + (Math.random()*(2 + 1) - 1)*this.dx*0.5;
                newParticleY =  this.dx*j + (Math.random()*(2 + 1) - 1)*this.dx*0.5;
                console.log(newParticleX+", "+newParticleY+", "+i*this.dx+", "+j*this.dx)
                
                if(Math.sqrt((newParticleX - x)*(newParticleX - x) + (newParticleY - y)*(newParticleY - y)) <= r)
                {
                    var novaParticula = new Particle(newParticleX, newParticleY);
                    this.particulas.push(novaParticula);
                }
            }

        }





    }

}