const canvas = document.getElementById("canvas-petals");
const ctx = canvas.getContext("2d");
let particleArray = [];

function startCanvas() {
	const canvas = document.getElementById("canvas");
	setCanvasSize();
	init();
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
		this.currentSize = 1;
		this.alpha = 0.2;
		this.rotation = rotation;
		this.rotateSpeed = rotateSpeed;
		this.Sprite = new Image();
		this.Sprite.src = "img/canvas-petal.svg";
	}

	update() {
		if (this.x + this.size > canvas.width || this.x - this.size < 0) {
			this.directionX = -this.directionX;
		}
		if (this.y + this.size > canvas.height || this.y - this.size < 0) {
			this.directionY = -this.directionY;
		}
		this.x += this.directionX;
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
			this.x,
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

// create particle array
function init() {
	var amount = 4;
	var baseSize = 60;
	if (window.innerWidth >= 800) {
		amount = 8;
		baseSize = 80;
	}
	if (window.innerWidth >= 1200) {
		amount = 16;
		baseSize = 100;
	}

	// console.log("amount: " + amount);
	particleArray = [];
	for (let i = 0; i < amount; i++) {
		let size = (Math.floor(Math.random() * 4) + 1) * baseSize;
		let x = Math.random() * (innerWidth - size);
		let y = Math.random() * (innerHeight - size);
		let directionX = Math.random() * 0.4 - 0.2;
		let directionY = Math.random() * 0.4 - 0.2;
		let rotation = Math.random() * 360;
		let rotateSpeed = ((Math.random() - 0.5) * 0.5)*0.5;

		particleArray.push(
			new Particle(
				x,
				y,
				directionX,
				directionY,
				size,
				rotation,
				rotateSpeed
			)
		);
	}
}

// add one particle to canvas
function addParticle(mouseX, mouseY) {
	// console.log('trying to add a particle');
	let size = Math.random() * 200 + 100;
	let x = mouseX - size / 2;
	let y = mouseY - size / 2;
	let directionX = Math.random() * 0.4 - 0.2;
	let directionY = Math.random() * 0.4 - 0.2;
	let rotation = Math.random() * 360;
	let rotateSpeed = ((Math.random() - 0.5) * 0.5)*0.5;

	particleArray.push(
		new Particle(x, y, directionX, directionY, size, rotation, rotateSpeed)
	);
}

// animation loop
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before new frame
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].update(); //update all particles
	}
	requestAnimationFrame(animate);
}

// add new petal when clicking
canvas.addEventListener("click", (e) => {
	var rect = e.target.getBoundingClientRect();
	var x = e.clientX; //x position within the element.
	var y = e.clientY - rect.top; //y position within the element.
	addParticle(x, y);
});

// update mouse object on move
canvas.addEventListener("mousemove", (e) => {
	mouse.x = e.x;
	mouse.y = e.y;
	// console.log(mouse.x, mouse.y);
	// new Particle(mouse.x, mouse.y, 0, 0, mouse.size, 'white', 0, 0);
});

//resize canvas after window resize
window.addEventListener("resize", () => {
	clearTimeout(window.resizeFinished);
	window.resizeFinished = setTimeout(() => {
		setCanvasSize();
		init();
	}, 150);
});

// set canvas size to canvas size
function setCanvasSize() {
	// console.log('setting canvas size');
	ctx.canvas.width = canvas.offsetWidth;
	ctx.canvas.height = canvas.offsetHeight;
}

startCanvas();