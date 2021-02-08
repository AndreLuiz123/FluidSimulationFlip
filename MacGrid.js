class MacGrid{

    constructor(N, dt){

        this.N = N;
        this.linhas = N;
        this.colunas = N;

        this.dt = dt;
        this.dx = 500/N;

        this.celulas = this.criarGrade(N, N);

        this.u = this.criarGrade(N+1, N);
        this.v = this.criarGrade(N, N+1);

        this.u_saved = this.criarGrade(N+1, N);
        this.v_saved = this.criarGrade(N, N+1);

        this.p = this.criarGrade(N, N);

        this.phi = this.criarGrade(N,N);

        this.particulas = [];

        this.alpha = 0.5;

        this.gravityValue = 10;

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
            //ctx.fillStyle = "pink";
            //ctx.fillText(this.u[i][j],i*this.dx-1.5,j*this.dx-1.5+this.dx/2);
            ctx.fillStyle = "pink";
            ctx.fillRect(i*this.dx-1.5,j*this.dx-1.5+this.dx/2,3,3);
        }    

        for(var i=0; i<this.v.length; i++)
        for(var j=0; j<this.v[i].length; j++)
        {
            //ctx.fillStyle = "green";
            //ctx.fillText(this.v[i][j],i*this.dx-1.5+this.dx/2,j*this.dx-1.5);
            ctx.fillStyle = "green";
            ctx.fillRect(i*this.dx-1.5+this.dx/2,j*this.dx-1.5,3,3);
        }    

        /*ctx.fillStyle = "yellow";
        ctx.fillText(Math.floor(this.phi[5][5]),5*this.dx+this.dx/2 - this.dx/4,5*this.dx+this.dx/2);
        */
        for(var i=0; i<this.N; i++)
        for(var j=0; j<this.N; j++)
        {
            ctx.fillStyle = "yellow";
            ctx.fillText(Math.floor(this.phi[i][j]),i*this.dx+this.dx/2 - this.dx/4,j*this.dx+this.dx/2);
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

    applyExternalForces(){

        for(var i=0; i<this.N+1; i++)
        for(var j=0; j<this.N+1; j++)
        {
            
            if(i<this.N)
            {
                this.v[i][j] += this.dt*this.gravityValue;
            }
        }

    }

    createParticles(x,y,r){
        var newParticleX = 0;
        var newParticleY = 0;
        
        for(var i=0; i<this.colunas; i++)
        for(var j=0; j<this.linhas; j++)
        {
            for(var c=0; c<4; c++)
            {

                newParticleX =  this.dx*i + Math.random()*this.dx;
                newParticleY =  this.dx*j + Math.random()*this.dx;
                
                
                if(Math.sqrt((newParticleX - x)*(newParticleX - x) + (newParticleY - y)*(newParticleY - y)) <= r)
                {           
                    var novaParticula = new Particle(newParticleX, newParticleY);
                    this.particulas.push(novaParticula);
                }
            }

        }
    }


    transferParticleToGrid(){

        var numeradorU = this.criarGrade(this.N+1, this.N);
        var denominadorU = this.criarGrade(this.N+1, this.N);
        var numeradorV = this.criarGrade(this.N, this.N+1);
        var denominadorV = this.criarGrade(this.N, this.N+1);

        var weight = 0;

        for(var i=0; i<this.particulas.length; i++)
        {
            for(var j=0; j<2;j++)
            {
                weight = this.K(this.particulas[i].x - (Math.floor(this.particulas[i].x/this.dx)+j)*this.dx + this.dx/2, this.particulas[i].y - Math.floor(this.particulas[i].y/this.dx)*this.dx);
                numeradorU[Math.floor(this.particulas[i].x/this.dx)+j][Math.floor(this.particulas[i].y/this.dx)] += weight*this.particulas[i].u;
                denominadorU[Math.floor(this.particulas[i].x/this.dx)+j][Math.floor(this.particulas[i].y/this.dx)] += weight;
            }

            for(var j=0; j<2;j++)
            {
                weight = this.K(this.particulas[i].x - Math.floor(this.particulas[i].x/this.dx)*this.dx, this.particulas[i].y - Math.floor(this.particulas[i].y/this.dx+j)*this.dx + this.dx/2);
                numeradorV[Math.floor(this.particulas[i].x/this.dx)+j][Math.floor(this.particulas[i].y/this.dx)] += weight*this.particulas[i].v;
                denominadorV[Math.floor(this.particulas[i].x/this.dx)+j][Math.floor(this.particulas[i].y/this.dx)] += weight;
            }
        }

        for(var i=0; i<this.N+1; i++)
        for(var j=0; j<this.N+1; j++)
        {
            if (j < this.N) {
                if (denominadorU[i][j] != 0.0) {
                    
                    this.u[i][j] = numeradorU[i][j] / denominadorU[i][j];
                }
            }
            if (i < this.N) {
                if (denominadorV[i][j] != 0.0) {
                    this.v[i][j] = numeradorV[i][j] / denominadorV[i][j];
                }
            }
        }

    }

    transferGridToParticle(){
        
        var difU = this.criarGrade(this.N+1,this.N);
        var difV = this.criarGrade(this.N,this.N+1);
        
        for(var i=0; i<this.N+1; i++)
        for(var j=0; j<this.N; j++)
        {
            difU[i][j] = this.u[i][j] - this.u_saved[i][j];
        }
        
        for(var i=0; i<this.N; i++)
        for(var j=0; j<this.N+1; j++)
        {
            difV[i][j] = this.v[i][j] - this.v_saved[i][j];
        }
        
        for(var i=0; i<this.particulas.length; i++)
        {
            this.particulas[i].u = this.vel(this.u,difU,this.particulas[i].x,this.particulas[i].y,this.particulas[i].u);
            this.particulas[i].v = this.vel(this.v,difV,this.particulas[i].x,this.particulas[i].y,this.particulas[i].v);
        }
    }   
    
    
    advection(){
        
        for(var i=0; i<this.particulas.length; i++)
        {
            this.particulas[i].x += this.particulas[i].u*this.dt;
            this.particulas[i].y += this.particulas[i].v*this.dt;
        }
        
    }

    markCellsFluid(){

        for(var i=0; i<this.N; i++)
        for(var j=0; j<this.N; j++)
        {
            this.celulas[i][j] = 0;
        }

        for(var i=0; i<this.particulas.length; i++)
        {
            this.celulas[Math.floor(this.particulas[i].x/this.dx)][Math.floor(this.particulas[i].y/this.dx)] = 1;
        }

    }

    initializeLevelSet(){

        var inside = -0.5*this.dx;
        var outside = 1000*this.dx;

        for(var i=0; i<this.N; i++)
        for(var j=0; j<this.N; j++)
        {
            if(this.celulas[i][j]===1)
            {
                this.phi[i][j] = inside;
            }else{
                this.phi[i][j] = outside;
            }    
        }
    }

    reinitializeLevelSet(){
        //Left to Right; Bottom to Top
        for(var i=1; i<this.N; i++)
        for(var j=1; j<this.N; j++)
        {
            this.phi[i][j] = this.updatePhi(i,j,i-1,j-1);
        }

        //Left to Right; Top to Bottom
        for(var i=1; i<this.N; i++)
        for(var j=this.N-2; j>=0; j--)
        {
            this.phi[i][j] = this.updatePhi(i,j,i-1,j+1);
        }
        
        //Right to Left; Bottom to Top
        for(var i=this.N-2; i>=0; i--)
        for(var j=1; j<this.N; j++)
        {
            this.phi[i][j] = this.updatePhi(i,j,i+1,j-1);
        }
        
        //Right to Left; Top do Bottom
        for(var i=this.N-2; i>=0; i--)
        for(var j=this.N-2; j>=0; j--)
        {
            this.phi[i][j] = this.updatePhi(i,j,i+1,j+1);
        }
    }

    extrapolateVelocities(){

        //Left to Right; Bottom to Top
        for(var i=1; i<this.N; i++)
        for(var j=1; j<this.N; j++)
        {
            this.u[i][j] = -1*((this.u[i-1][j]*(-this.phi[i][j] + this.phi[i-1][j])) + (this.u[i][j-1]*(-this.phi[i][j] + this.phi[i][j-1])))/
            (2*this.phi[i][j] - this.phi[i-1][j] - this.phi[i][j-1]);
        }

        //Left to Right; Top to Bottom
        for(var i=1; i<this.N; i++)
        for(var j=this.N-2; j>=0; j--)
        {
            this.u[i][j] = -1*((this.u[i-1][j]*(-this.phi[i][j] + this.phi[i-1][j])) + (this.u[i][j+1]*(-this.phi[i][j] + this.phi[i][j+1])))/
            (2*this.phi[i][j] - this.phi[i-1][j] - this.phi[i][j+1]);
        }

        //Right to Left; Bottom to Top
        for(var i=this.N-2; i>=0; i--)
        for(var j=1; j<this.N; j++)
        {
            this.u[i][j] = -1*((this.u[i+1][j]*(-this.phi[i][j] + this.phi[i+1][j])) + (this.u[i][j-1]*(-this.phi[i][j] + this.phi[i][j-1])))/
            (2*this.phi[i][j] - this.phi[i+1][j] - this.phi[i][j-1]);
        }

        //Right to Left; Top do Bottom
        for(var i=this.N-2; i>=0; i--)
        for(var j=this.N-2; j>=0; j--)
        {
            this.u[i][j] = -1*((this.u[i+1][j]*(-this.phi[i][j] + this.phi[i+1][j])) + (this.u[i][j+1]*(-this.phi[i][j] + this.phi[i][j+1])))/
            (2*this.phi[i][j] - this.phi[i+1][j] - this.phi[i][j+1]);
        }
    }

    updatePhi(i1,j1,i2,j2){

        var b =  -1*(this.phi[i2][j1] + this.phi[i1][j2]); 
        var c =  (this.phi[i2][j1]*this.phi[i2][j1] + this.phi[i1][j2]*this.phi[i1][j2] - this.dx*this.dx)*0.5;

        var newPhi = this.equacaoSegundoGrau(1, b, c);

        if(!isNaN(newPhi) && newPhi < this.phi[i1][j1])
        {
            return newPhi;
        }

        return this.phi[i1][j1];
    }

    equacaoSegundoGrau(a,b,c){

        var retorno = {x1:0, x2:0};
        var delta = b*b - 4*a*c;
        
        if(delta>=0)
        {
            retorno.x1 = (-b + Math.sqrt(delta))/(2*a);
            retorno.x2 = (-b - Math.sqrt(delta))/(2*a);
            
            if(retorno.x1<retorno.x2)
            {
                return retorno.x1;
            }
            else
            {
                return retorno.x2;
            }
        }

        return 0/0;
    }

    solucaoArtigo(a,b,c){
        var retorno = {x1:0, x2:0};
        var delta = b*b - c;
        
        if(delta>=0)
        {
            retorno.x1 = b*0.5 + Math.sqrt(delta);
            retorno.x2 = b*0.5 - Math.sqrt(delta);
            
            if(retorno.x1>retorno.x2)
            {
                console.log("x1");
                return retorno.x1;
            }
            else
            {
                console.log("x2");
                return retorno.x2;
            }
        }

        return 0/0;
    }

    vel(grade,gradeDiferenca,x,y,velVelha){
        return (this.alpha)*this.interpolacaoBilinear(grade,x,y) + (1 - this.alpha)*(velVelha + this.interpolacaoBilinear(gradeDiferenca,x,y));         
    }
    
    K(distX, distY){
       
        return this.H(distX/this.dx)*this.H(distY/this.dx);
    }

    H(r){
        if(r>0 && r<=1)
            return 1-r;
        if(r>=-1 && r<0)
            return 1+r;
        return 0;
    }

    interpolacaoLinear(grade,x,y){
        
        var coluna = Math.floor(x/this.dx);
        var linha = Math.floor(y/this.dx);
        
        var pontox1 = coluna*this.dx;
        var pontox2 = coluna*this.dx + this.dx;
        
        var beta = (x - pontox1)/(pontox2 - pontox1);//Calcula a distância entre x e o ponto1 e já faz a escala de 0 a 1
        
        return grade[coluna][linha]*beta + grade[coluna+1][linha]*(1 - beta);
    }
    
    interpolacaoBilinear(grade,x,y){
        
        var coluna = Math.floor(x/this.dx);
        var linha = Math.floor(y/this.dx);
        
        var pontox1 = coluna*this.dx;
        var pontox2 = coluna*this.dx + this.dx;

        var pontoy1 = linha*this.dx;
        var pontoy2 = linha*this.dx + this.dx;

        var beta = Math.abs(x - pontox1)/Math.abs(pontox2 - pontox1);//Calcula a distância entre x e o pontox1 e já faz a escala de 0 a 1
        var omega = Math.abs(y - pontoy1)/Math.abs(pontoy2 - pontoy1);//Calcula a distância entre y e o pontoy1 e já faz a escala de 0 a 1
        

        return  (grade[coluna][linha]*beta + grade[coluna+1][linha]*(1 - beta))*omega + (grade[coluna][linha+1]*beta + grade[coluna+1][linha+1]*(1 - beta))*(1 - omega);  
    }

    atualizaGradesAuxiliares(){

        for(var i=0; i<this.N+1; i++)
        for(var j=0; j<this.N; j++)
        {
            this.u_saved[i][j] = this.u[i][j];
        }
        
        for(var i=0; i<this.N; i++)
        for(var j=0; j<this.N+1; j++)
        {
            this.v_saved[i][j] = this.v[i][j];
        }


    }


}