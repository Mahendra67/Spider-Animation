const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var frames = 0;

var particlesNo = 76;

var mouseX = undefined;
var mouseY = undefined;

// ctx.fillStyle = "white"
// ctx.fillRect(0, 0, canvas.width, canvas.height);


class Particle{
    constructor({x, y, radius, velocityX, velocityY, color}){
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.velocityX = velocityX,
        this.velocityY = velocityY,
        this.color = "white",
        this.changeX = (Math.random()-0.5)*100,
        this.changeY = (Math.random()-0.5)*100,
        this.changeX2 = (Math.random()-0.5)*200,
        this.changeY2 = (Math.random()-0.5)*200
    }

    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    }

    update(){
        this.draw();
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}

var particles = []

function addParticle(){
    var x = Math.random()*canvas.width;
    var y = Math.random()*canvas.height;
    var radius = 4;
    var velocityX = (Math.random() - 0.5)*0.8;
    var velocityY = (Math.random() - 0.5)*0.8;
    var color = "white";
    particles.push(new Particle({x, y, radius, velocityX, velocityY, color}));
}

function addClickParticle({x, y}){
    var radius = 4;
    var velocityX = (Math.random() - 0.5)*0.8;
    var velocityY = (Math.random() - 0.5)*0.8;
    var color = "white";
    particles.push(new Particle({x, y, radius, velocityX, velocityY, color}));
}

function animate(){
    frames++;
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    for(var i=0; i<particles.length; i++){
        particles[i].update();

        for(var j=0; j<particles.length; j++){
            var dist = Math.sqrt((particles[i].x - particles[j].x)**2 + (particles[i].y - particles[j].y)**2);
            var alpha1 = 0.6 - (dist/230); 
            if(alpha1 < 0){
                alpha1 = 0;
            }

            if(dist < 230){
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = "white";
                ctx.globalAlpha = alpha1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
        
        if(mouseX != undefined && mouseY != undefined){
            var dist2 = Math.sqrt((particles[i].x - mouseX)**2 + (particles[i].y - mouseY)**2);
            var alpha2 = 1 - dist2/230;
            if(alpha2 < 0){
                alpha2 = 0;
            }

            var ctrPointx1 = particles[i].x+particles[i].changeX;
            var ctrPointy1 = particles[i].y+particles[i].changeY;
            var ctrPointx2 = particles[i].x+particles[i].changeX2;
            var ctrPointy2 = particles[i].y+particles[i].changeY2;

            var gradientCol = ctx.createLinearGradient(particles[i].x, particles[i].y, mouseX, mouseY);
            gradientCol.addColorStop(0, "rgb(177, 19, 19)");
            gradientCol.addColorStop(0.3, "rgb(223, 31, 45)");
            gradientCol.addColorStop(0.6, "rgb(68, 123, 190)");
            gradientCol.addColorStop(0.9, "rgb(43, 55, 132)");

            if(dist2 < 360){
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = gradientCol;
                ctx.lineWidth = 6;
                ctx.globalAlpha = alpha2;
                ctx.moveTo(particles[i].x, particles[i].y);
                // ctx.lineTo(mouseX, mouseY);
                ctx.bezierCurveTo(ctrPointx1, ctrPointy1, ctrPointx2, ctrPointy2, mouseX, mouseY);
                ctx.stroke();
                ctx.restore();
            }
        }

        if(particles[i].x > canvas.width+10 || particles[i].y > canvas.height+10 || particles[i].x < -10 || particles[i].y < -10){
            particles.splice(i, 1);

            addParticle();
        }
    }

    if(mouseX != undefined && mouseY != undefined){
        ctx.save();
        ctx.beginPath();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = "rgb(223, 31, 45)"
        ctx.arc(mouseX, mouseY, 6, 0, Math.PI*2, false);
        ctx.fill();
        ctx.restore();
    }

}

for(var i=0; i<particlesNo; i++){
    addParticle();
}
animate();

//For tracking mouse position
addEventListener('mousemove', (event) => {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
})


//For adding particles on mouseClick
addEventListener('mousedown', (event) => {
    addClickParticle({x:event.offsetX, y:event.offsetY});
})


//For resizing the canvas on window resize
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})