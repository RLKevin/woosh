var canvas;
var ctx;
var hero;
let particleArray = [];

function startCanvas() {
	hero = document.querySelector("section.hero");
	canvas = document.getElementById("canvas-planes");
	ctx = canvas.getContext("2d");
	setCanvasSize();
	// init();
	animate();
	setCanvasSize();
}

class Particle {
	constructor(x, y, directionX, directionY, size, rotation, rotateSpeed) {
		this.x = x;
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.currentSize = size;
		this.alpha = 0.2;
		this.rotation = rotation;
		this.rotateSpeed = rotateSpeed;
		this.Sprite = new Image();
		this.Sprite.src = "./img/canvas-plane.svg";
	}

	update(i) {
		// if (this.x + this.size > canvas.width || this.x - this.size < 0) {
		if (this.x + this.size > canvas.width) {
			particleArray.splice(i, 1);
		}
		if (this.y + this.size > canvas.height || this.y - this.size < 0) {
			this.directionY = -this.directionY;
		}
		this.x += this.directionX * this.size * 0.01;
		this.y += this.directionY;
		this.rotation += this.rotateSpeed;
		this.currentSize =
			this.currentSize + (this.size - this.currentSize) / 50;
		if (this.currentSize > this.size) {
			this.currentSize = this.size;
		}

		this.draw();
	}

	draw() {
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.save();
		ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
		ctx.rotate((this.rotation / 180) * Math.PI);
		ctx.translate(-this.x - this.size / 2, -this.y - this.size / 2);
		// ctx.rect(this.x, this.y, this.size, this.size);
		ctx.drawImage(
			this.Sprite,
			this.x - window.pageYOffset * 0.5,
			this.y,
			this.currentSize,
			this.currentSize
		);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
	}
}

// mouse object
var mouse = {
	x: null,
	y: null,
	size: 30,
	hover: null,
};

function new_plane() {
	var baseSize = 12;
	if (window.innerWidth >= 800) {
		baseSize = 16;
	}
	if (window.innerWidth >= 1200) {
		baseSize = 20;
	}
	let size = Math.floor(Math.random() * 10) + 8 + baseSize;
	// size = baseSize;
	let x = -size;
	let y = Math.random() * (innerHeight - size * 2 - 128) + 128 + size;
	let directionX = Math.random() * 0.4 + 5;
	let directionY = Math.random() * 0.4 - 0.2;
	directionY = 0;
	let rotation = 90;
	let rotateSpeed = 0;

	particleArray.push(
		new Particle(x, y, directionX, directionY, size, rotation, rotateSpeed)
	);
}

// animation loop
let timer_default = 50 * 60; // 60fps
let timer = Math.floor(Math.random() * timer_default + 1000);
timer_default = 100; // dev
timer = 30; // dev
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before new frame
	ctx.font = "12px Arial";
	ctx.globalAlpha = 0.2;
	ctx.fillText(Math.round(timer / 60), 8, 48, 400);
	// draw rect
	// ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
	// ctx.fillRect(0, , canvas.width, 2);

	timer--;
	if (timer < 1) {
		timer = timer_default;
		new_plane();
	}
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].update(i); //update all particles
	}
	requestAnimationFrame(animate);
}

//resize canvas after window resize
window.addEventListener("resize", () => {
	clearTimeout(window.resizeFinished);
	window.resizeFinished = setTimeout(() => {
		setCanvasSize();
		// init();
	}, 150);
});

// update mouse object on mouse move
window.addEventListener("mousemove", function (e) {
	mouse.x = e.clientX;
	// mouse.y = e.clientY + window.pageYOffset;
	mouse.y = e.clientY;
});

// set canvas size to canvas size
function setCanvasSize() {
	ctx.canvas.width = canvas.offsetWidth;
	ctx.canvas.height = canvas.offsetHeight;
}

startCanvas();
