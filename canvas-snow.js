let canvas;
let ctx;
let particleArray = [];
var mouse = {
	x: null,
	y: null,
};

function init(amount) {
	for (let i = 0; i < amount; i++) {
		// add particle to array
		let size = Math.random() * 5;
		size = size > 9.6 ? size * 1.8 : size;
		let x = Math.random() * canvas.width * 2 - canvas.width / 2;
		let y = Math.random() * -canvas.height;
		let image =
			"https://static.wixstatic.com/media/2cd43b_57438aebde5a4b0fa20c6880a9fafabf~mv2.png/v1/fill/w_320,h_272,q_90/2cd43b_57438aebde5a4b0fa20c6880a9fafabf~mv2.png";

		let particle = new Particle(i, x, y, size, image);
		particleArray.push(particle);
		// console.table(particle);
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas before new frame
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].update(); //update all particles
	}
	requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
	clearTimeout(window.resizeFinished);
	window.resizeFinished = setTimeout(() => {
		setCanvasSize();
		init(initArray);
	}, 150);
});

function setCanvasSize() {
	ctx.canvas.width = canvas.offsetWidth;
	ctx.canvas.height = canvas.offsetHeight;
    console.log(canvas.width, canvas.height);
}

function start() {
	canvas = document.querySelector("#canvas-snow");
	ctx = canvas.getContext("2d");
	setCanvasSize();
	init(100);
	animate();
    setCanvasSize();

	canvas.addEventListener("mousemove", (e) => {
		mouse.x = e.x;
		mouse.y = e.y;
	});
}

const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => {
	const bg = document.createElement("div");
	bg.classList.add("bg");
	button.appendChild(bg);

	button.addEventListener("mouseenter", (e) => {
		const canvas = document.createElement("canvas");
		canvas.id = "snow";
		button.appendChild(canvas);
		start();
	});
	button.addEventListener("mouseleave", (e) => {
		button.removeChild(document.querySelector("#snow"));
		particleArray = [];
	});
});

class Particle {
	constructor(id, x, y, size, image) {
		(this.id = id),
			(this.x = x),
			(this.y = y),
			(this.size = size),
			(this.image = image);
	}

	update() {
		if (this.y - this.size > canvas.height) {
			this.y = -20;
			// this.x = Math.random() * canvas.width * 2 - canvas.width / 2;
			this.x = Math.random() * canvas.width;
		}
		this.y = this.y + 0.001*canvas.height;

		this.draw();
	}

	draw() {
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(this.x, this.y, this.size, this.size);
	}
}

start();