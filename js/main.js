
var directions = {
	"n": new Vector(0,-1),
	"w": new Vector(-1,0),
	"s": new Vector(0, 1),
	'e': new Vector(1,0)
},
KEY_CODE = {
	'w': 37,
	'n': 38,
	'e': 39,
	's': 40
};

function Vector(x,y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(vect){
	return new Vector(this.x + vect.x, this.y + vect.y);
}

Vector.prototype.randomVector = function(world){
	var x = Number((Math.random()*(world[0].length-1)).toFixed(0));
	var y = Number((Math.random()*(world.length-1)).toFixed(0));
	return new Vector(x,y);
}

var body = document.body;

var world = function(){
	var finArr = [];
	var table = document.getElementsByTagName('table')[0].childNodes[1];

	for(var i = 0; i < table.children.length; i++){
		var innerFinArr = [];
		for(var j = 0; j < table.children[i].children.length; j++){
			innerFinArr.push(table.children[i].children[j]);
		}
		finArr.push(innerFinArr);
	}

	return finArr;
}();


// CLASS SNAKE

function Snake(vect){
	this.coord = vect;
}
Snake.prototype.changeDirection = function(e) {
	for(var prop in KEY_CODE){
		if(e.keyCode === KEY_CODE[prop]){
			snakeParts[0].direction = prop;
			break;
		}
	}
}

// SUBCLASS HEAD. SNAKE INHERIT

function Head(vect, direction){
	Snake.call(this,vect);
	this.direction = direction;
}
Head.prototype.look = function(){
	var s = this.coord.plus(directions[this.direction]);
	if(s.x === apple.coord.x && s.y === apple.coord.y)
		return "apple";
	if(world[s.x] === undefined)
		return world[s.x];
	return world[s.x][s.y];
}
Head.prototype.move = function(){
	var nextDir = this.look();
	if(nextDir === "apple"){
		snakeParts.push(new Body(new Vector(snakeParts[snakeParts.length - 1].coord.x, snakeParts[snakeParts.length - 1].coord.y)));
		apple = new Apple(Vector.prototype.randomVector(world));
		apple.be();
	}
	if(snakeParts.length !== 1){
		snakeParts[1].futureCoord = this.coord;
	}
	world[this.coord.y][this.coord.x].style.backgroundColor = 'green';
	this.coord = this.coord.plus(directions[this.direction]);
	if(nextDir === undefined)
		this.changeCoordinates();
	world[this.coord.y][this.coord.x].style.backgroundColor = 'red';
}
Head.prototype.changeCoordinates = function(){
	if(this.coord.x === world[0].length)
		this.coord.x = 0;
	else if(this.coord.x === -1)
		this.coord.x = world[0].length -1;
	if(this.coord.y === world.length)
		this.coord.y = 0;
	else if(this.coord.y === -1)
		this.coord.y = world.length -1;
}

// SUBCLASS BODY. SNAKE INHERIT

function Body(vect){
	Snake.call(this,vect);
	this.futureCoord = vect;
}
Body.prototype.move = function(i, ev){
	if(ev){
		console.log("tail coord: "+ this.coord);
		world[this.coord.y][this.coord.x].style.backgroundColor = 'green';
	} else {
		snakeParts[i+1].futureCoord = this.coord;
	}
		world[this.futureCoord.y][this.futureCoord.x].style.backgroundColor = 'red';
		this.coord = this.futureCoord;
}

// APPLE CONSTRUCTOR

function Apple(vect){
	console.log('new V: '+ vect);
	this.coord = vect;
}

Apple.prototype.be = function (){
	for(var i = 0; i<snakeParts.length; i++){
		if(snakeParts[i].coord.x === this.coord.x && snakeParts[i].coord.y === this.coord.y) {
			apple = new Apple(Vector.prototype.randomVector(world));
			apple.be();
		}
	}
	world[this.coord.y][this.coord.x].style.backgroundColor = 'yellow';
}

// MAKING WORLD ALIFE

function turn(){

	var s = snakeParts;
	var len = s.length;
	for(var i = 0; i < len; i++){
		if(i===len-1)
			s[i].move(i,true);
		else
			s[i].move(i);
	}
}

var snakeParts = [new Head(Vector.prototype.randomVector(world), 's')];


var apple = new Apple(Vector.prototype.randomVector(world));
apple.be();



body.addEventListener('keyup', Snake.prototype.changeDirection, false);

var k = setInterval(turn, 1500);