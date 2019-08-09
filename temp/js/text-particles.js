var textcanvas = document.querySelector("#text"),
  textctx = textcanvas.getContext("2d"),
  textparticles = [],
  amount = 0,
  mouse = {x:0,y:0},
  radius = 1;

var colors = ["rgb(54, 73, 176)","rgb(25, 37, 100)", "rgb(255, 197, 53)","rgb(146, 110, 20)"];

var copy = document.querySelector("#title");

var ww = textcanvas.width = window.innerWidth;
var wh = textcanvas.height = window.innerHeight;

function Particle(x,y){
  this.x =  Math.random()*ww;
  this.y =  Math.random()*wh;
  this.dest = {
    x : x,
    y: y
  };
  // adjust particle size
  this.r =  Math.random()*1.5 + 2;
  this.vx = (Math.random()-0.5)*20;
  this.vy = (Math.random()-0.5)*20;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random()*0.05 + 0.94;

  this.color = colors[Math.floor(Math.random()*6)];
}

Particle.prototype.render = function() {

  this.accX = (this.dest.x - this.x)/1000;
  this.accY = (this.dest.y - this.y)/1000;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;

  this.x += this.vx;
  this.y +=  this.vy;

  textctx.fillStyle = this.color;
  textctx.beginPath();
  textctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  textctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt( a*a + b*b );
  if(distance<(radius*70)){
    this.accX = (this.x - mouse.x)/100;
    this.accY = (this.y - mouse.y)/100;
    this.vx += this.accX;
    this.vy += this.accY;
  }

}

function onMouseMove(e){
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function onTouchMove(e){
  if(e.touches.length > 0 ){
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
}

function onTouchEnd(e){
mouse.x = -9999;
mouse.y = -9999;
}

function initScene(){
  ww = textcanvas.width = window.innerWidth;
  wh = textcanvas.height = window.innerHeight;

  textctx.clearRect(0, 0, textcanvas.width, textcanvas.height);

  // set size for #title to provide text outline/stroke
  // fontStoke & font must match
  var stroke = document.querySelector("#title");
  stroke.style.fontSize = (ww/15)+"px";

  textctx.font = "bold "+(ww/15)+"px sans-serif";
  textctx.textAlign = "start";
  textctx.textBaseline = "top";
  // textctx.fillText(title.innerHTML, ww/2, wh/2);
  textctx.fillText(title.innerHTML, 50, 155);

  var data  = textctx.getImageData(0, 0, ww, wh).data;
  textctx.clearRect(0, 0, textcanvas.width, textcanvas.height);
  textctx.globalCompositeOperation = "screen";

  var d = document.getElementById('title');
    d.style.position = "absolute";
    d.style.left = 50+'px';
    d.style.top = 145+'px';

  // adjust particle amount
  textparticles = [];
  for(var i=0;i<ww;i+=Math.round(ww/250)){
    for(var j=0;j<wh;j+=Math.round(ww/250)){
      if(data[ ((i + j*ww)*4) + 3] > 150){
        textparticles.push(new Particle(i,j));
      }
    }
  }
  amount = textparticles.length;

}

function onMouseClick(){
  radius++;
  if(radius ===5){
    radius = 0;
  }
}

function render(a) {
  requestAnimationFrame(render);
  textctx.clearRect(0, 0, textcanvas.width, textcanvas.height);
  for (var i = 0; i < amount; i++) {
    textparticles[i].render();
  }
};

copy.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);
