function Vector(x,y){
	this.x = x;
	this.y = y;
}

Vector.prototype.plus = function(obj){
	return new Vector(this.x + obj.x, this.y + obj.y);
}

var KEY_CODE = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
};

function changeDirection(e){
	if(e.keyCode === KEY_CODE.LEFT)
		snake[0].direction = "w";
	else if(e.keyCode === KEY_CODE.UP)
		snake[0].direction = "n";
	else if(e.keyCode === KEY_CODE.RIGHT)
		snake[0].direction = "e";
	else if(e.keyCode === KEY_CODE.DOWN)
		snake[0].direction = "s";
}

var body = document.body;
body.addEventListener('keyup', changeDirection, false);

var directions = {
	"n": new Vector(0,-1),
	"w": new Vector(-1,0),
	"s": new Vector(0, 1),
	'e': new Vector(1,0)
};

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


function SnakePart(x,y,dir,type){
	this.direction = dir;
	this.coord = new Vector(x,y);
	this.type = type;
}

function changeCoordinate(context){
	if(context.coord.x === 10)
		context.coord.x = 0;
	if(context.coord.x === -1)
		context.coord.x = 9;
	if(context.coord.y === -1)
		context.coord.y = 9;
	if(context.coord.y === 10)
		context.coord.y = 0;
}

SnakePart.prototype.move = function(i){
	var nextDir = this.look();
	if(this.type === "head"){
		if(nextDir === "apple"){
			snake.push(new SnakePart(snake[snake.length - 1].coord.x, snake[snake.length - 1].coord.y, snake[snake.length - 1].direction, "tail"));
			apple = new Apple(Number((Math.random()*9).toFixed(0)), Number((Math.random()*9).toFixed(0)));
			apple.be();
		}
		world[this.coord.y][this.coord.x].style.backgroundColor = 'green';
		this.coord = this.coord.plus(directions[this.direction]);
		if(nextDir === undefined)
			changeCoordinate(this);
		world[this.coord.y][this.coord.x].style.backgroundColor = 'red';
	}
	else if (this.type === "tail"){
		this.direction = snake[i-1].direction;
		world[this.coord.y][this.coord.x].style.backgroundColor = 'green';
		this.coord = this.coord.plus(directions[this.direction]);
		if(nextDir === undefined)
			changeCoordinate(this);
		world[this.coord.y][this.coord.x].style.backgroundColor = 'red';
	}
}

SnakePart.prototype.look = function(){
	var s = this.coord.plus(directions[this.direction]);
	if(s.x === apple.coord.x && s.y === apple.coord.y)
		return "apple";
	if(world[s.x] === undefined)
		return world[s.x];
	return world[s.x][s.y];
}

var snake = [new SnakePart(0,0,'s', "head")];

function turn(){
	var s = snake;
	var len = s.length;
	(function(g){
		for(var i = 0; i < len; i++){
			g[i].move(i);
		}
	})(s);
}

var k = setInterval(turn, 1000);

function Apple(x,y){
	this.coord = new Vector(x,y);
}

Apple.prototype.be = function (){
	for(var i = 0; i<snake.length; i++){
		if(snake[i].coord.x === this.coord.x && snake[i].coord.y === this.coord.y) {
			apple = new Apple(Number((Math.random()*9).toFixed(0)), Number((Math.random()*9).toFixed(0)));
			apple.be();
		}
	}
	world[this.coord.y][this.coord.x].style.backgroundColor = 'yellow';
}

var apple = new Apple(Number((Math.random()*9).toFixed(0)), Number((Math.random()*9).toFixed(0)));
apple.be();
