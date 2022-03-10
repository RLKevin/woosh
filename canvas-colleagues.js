const canvas = document.getElementById("canvas-colleagues");
const ctx = canvas.getContext("2d");
let particleArray = [];
let initArray;
let popupActive = false;

let columns = 5;
let rows = 3;

class Particle {
	constructor(
		id,
		x,
		y,
		directionX,
		directionY,
		size,
		rotation,
		rotateSpeed,
		image,
		active
	) {
		(this.id = id), (this.x = x);
		this.y = y;
		this.directionX = directionX;
		this.directionY = directionY;
		this.size = size;
		this.currentSize = size;
		this.alpha = 0.2;
		this.rotation = rotation;
		this.rotateSpeed = rotateSpeed;
		this.image = image;
		this.active = false;
		this.hover = false;
	}

	update() {
		if (this.x > canvas.width + canvas.width / columns) {
			this.x = -this.size;
		}
		this.x += this.directionX;
		this.y += this.directionY;
		this.rotation += this.rotateSpeed;
		if (this.hover) {
			this.currentSize = this.currentSize + 2;
		} else {
			this.currentSize = this.currentSize - 2;
		}
		if (this.currentSize < this.size) {
			this.currentSize = this.size;
		}
		if (this.currentSize > this.size + 10) {
			this.currentSize = this.size + 10;
		}
		// this.currentSize = this.currentSize + (this.size - this.currentSize) / 50;
		// if (this.currentSize > this.size) {
		// 	this.currentSize = this.size;
		// }

		this.draw();
	}

	draw() {
		// ctx.fillStyle = "#FF0000";
		// ctx.fillRect(this.x, this.y, this.size, this.size);

		var thumbImg = document.createElement("img");
		thumbImg.src = this.image;
		// if (!this.active) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		ctx.fillStyle = "#572c5c";
		ctx.fill();
		ctx.drawImage(
			thumbImg,
			this.x - this.currentSize,
			this.y - this.currentSize,
			this.currentSize * 2,
			this.currentSize * 2
		);

		ctx.beginPath();
		ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2, true);
		ctx.clip();
		ctx.closePath();
		ctx.restore();
		// }
	}
}

var people = [];
for (let index = 0; index < 20; index++) {
	people.push({
		id: index,
		img: "img/avatars/avataaars (" + index + ").png",
	});
}
startCanvas(people);
const canvasElement = document.querySelector("#canvas");

function showDiv(id, x, y) {
	const popup = document.querySelector("#person" + id);
	popup.setAttribute("active", true);
	canvasElement.setAttribute("active", true);
}
function hideDiv(id) {
	const popup = document.querySelector("#person" + id);
	popup.setAttribute("active", false);
	canvasElement.setAttribute("active", false);
}

function startCanvas(objects) {
	initArray = objects;
	// const hero = document.getElementById("hero");
	setCanvasSize();
	init(initArray);
	animate();
	setCanvasSize();
}



// mouse object
var mouse = {
	x: null,
	y: null,
	size: 30,
	hover: null,
};

// create particle array
function init(objects) {
	console.table(objects);
	var amount = objects.length;

	baseSize = Math.sqrt(canvas.width * canvas.height) * 0.2;

	console.log("amount: " + amount);
	particleArray = [];
	columnSize = canvas.width / (columns - 1);
	rowSize = canvas.height / rows;

	placeObjects(objects);

	function placeObjects(objects) {
		var i = 0;
		// rows
		for (let x = 0; x < columns; x++) {
			// colums
			for (let y = 0; y < rows; y++) {
				let o = objects[i % amount];

				let size = columnSize * 0.3;

				let ox = x * columnSize + columnSize * 0.5;
				let oy = y * rowSize + rowSize * 0.5;

				// every row, shift objects a bit to the left
				ox = ox - columnSize * 0.3333 * y;

				// add some variation
				ox = ox + (Math.random() - 0.5) * (size * 0.2);
				oy = oy + (Math.random() - 0.5) * (size * 0.2);

				let directionX = Math.random() * 0.4 - 0.2;
				directionX = Math.random() * 0.1 + 0.2;
				directionX = 0.2;
				let directionY = Math.random() * 0.4 - 0.2;
				directionY = 0;
				let rotation = 0;
				let rotateSpeed = 0;

				let image = o.img;
				let id = o.id;

				particleArray.push(
					new Particle(
						id,
						ox,
						oy,
						directionX,
						directionY,
						size,
						rotation,
						rotateSpeed,
						image
					)
				);

				i++; // next object
			}
		}
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
	let rotation = 0;
	let rotateSpeed = 0;

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

canvas.addEventListener("click", (e) => {
	// console.log("checking if we clicked a person");
	if (popupActive) {
		popupActive = false;
		particleArray.forEach((p) => {
			p.active = false;
			hideDiv(p.id);
		});
	} else {
		popupActive = true;
		particleArray.forEach((p) => {
			var a = e.layerX - p.x;
			var b = e.layerY - p.y;
			var c = Math.sqrt(a * a + b * b);
			if (c < p.size && !p.active) {
				showDiv(p.id, p.x, p.y);
				activeParticle = p;
				p.active = true;
			} else {
				// console.log(b + " " + p.size);
				hideDiv(p.id);
				p.active = false;
			}
		});
	}
});

var hover;
canvas.addEventListener("mousemove", (e) => {
	if (!popupActive) {
		hover = false;
		particleArray.forEach((p) => {
			p.hover = false;
		});
		particleArray.forEach((p) => {
			var a = e.layerX - p.x;
			var b = e.layerY - p.y;
			var c = Math.sqrt(a * a + b * b);
			if (c < p.size && !p.active) {
				p.hover = true;
				hover = true;
			}
		});
		if (hover) {
			document.getElementById("canvas-colleagues").style.cursor = "pointer";
		} else {
			document.getElementById("canvas-colleagues").style.cursor = "initial";
		}
	}
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
		init(initArray);
	}, 150);
});

// set canvas size
function setCanvasSize() {
	ctx.canvas.width = canvas.offsetWidth;
	ctx.canvas.height = canvas.offsetHeight;
}

startCanvas();
