// boilerplate canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// set canvas to window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// configuration - tinker with these
var config = {
	particleNumber: 1500,
	maxParticleSize: 5,
	maxSpeed: 50,
	colorVariation: 30
};


// determine device size
// if mobile, show horizontal gradient || if web, show vertical gradient
var media = window.matchMedia( "(max-width: 700px)" );
var gradient;
if (media.matches) {
    gradient = ctx.createLinearGradient(0 - 200,0, canvas.width + 200,0);
} else {
    gradient = ctx.createLinearGradient(0,0 - 250, 0, canvas.height + 350);
}
//set background gradient color scheme
gradient.addColorStop(0, "#08021c"); // very dark blue/purple
gradient.addColorStop(1, "#352693"); // light blue/purple

// colors - tinker with these
var colorPalette = {
	matter: [
		{r:54,g:73,b:176},   // light blue
		{r:25,g:37,b:100},   // dark blue
		{r:255,g:197,b:53},  // light yellow
		{r:146,g:110,b:20}   // dark yellow
	]
};

// various variables
var particles = [];
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var drawBg;

// draws the background for the canvas
drawBg = function (ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(0,0,canvas.width,canvas.height);
};

// particle constructor
var Particle = function (x, y) {
	// x coordinate
	this.x = x || Math.round(Math.random() * canvas.width);
	// y coordinate
	this.y = y || Math.round(Math.random() * canvas.height);
	// radius of space dust
	this.r = Math.ceil(Math.random() * config.maxParticleSize);
	// color of the rock, given some randomness
	this.c = colorVariation(colorPalette.matter[Math.floor(Math.random() * colorPalette.matter.length)],true);
	// rock velocity
	this.s = Math.pow(Math.ceil(Math.random() * config.maxSpeed), .7);
	// rock direction
	this.d = Math.round(Math.random() * 360);
};

// provide color variation - accepts an rgba object
// returns modified rgba object or rgba string if true is passed for second arg
var colorVariation = function (color, returnString) {
	var r, g, b, a, variation;
	r = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.r);
	g = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.g);
	b = Math.round(((Math.random() * config.colorVariation) - (config.colorVariation/2)) + color.b);
	a = Math.random() + .5;
	if (returnString) {
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	} else {
		return {r,g,b,a};
	}
};

// used to find the rocks next point in space - accounting for speed & direction
var updateParticleModel = function (p) {
	var a = 180 - (p.d + 90); // find third angle
	p.d > 0 && p.d < 180 ? p.x += p.s * Math.sin(p.d) / Math.sin(p.s) : p.x -= p.s * Math.sin(p.d) / Math.sin(p.s);
	p.d > 90 && p.d < 270 ? p.y += p.s * Math.sin(a) / Math.sin(p.s) : p.y -= p.s * Math.sin(a) / Math.sin(p.s);
	return p;
};

// actually draw the particles on canvas
// takes in the: position, size, and color
var drawParticle = function (x, y, r, c) {
	ctx.beginPath();
	ctx.fillStyle = c;
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.closePath();
};

// remove particle that are not on canvas
var cleanUpArray = function () {
	particles = particles.filter((p) => {
		return (p.x > -100 && p.y > -100);
	});
};

var initParticles = function (numParticles, x, y) {
	for (let i = 0; i < numParticles; i++) {
		particles.push(new Particle(x, y));
	}
	particles.forEach((p) => {
		drawParticle(p.x, p.y, p.r, p.c);
	});
};

// call this when ready to update animation onscreen
// tells browser we wish to perform and animation
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     function(callback) {
        window.setTimeout(callback, 1000 / 60);
     };
})();


// frame function
var frame = function () {
  // draw background first
  drawBg(ctx, gradient)
  // update Particle models to new position
  particles.map((p) => {
    return updateParticleModel(p);
  });
  // draw them
  particles.forEach((p) => {
      drawParticle(p.x, p.y, p.r, p.c);
  });
  // repeat
  window.requestAnimFrame(frame);
};

function resizeCanvas() {
	window.addEventListener('resize', redrawBackground);
}

function redrawBackground() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	drawBg(ctx, gradient);
}

// first frame
frame();

// start particle splash
initParticles(config.particleNumber);

// resize canvas after a window resize
resizeCanvas();
