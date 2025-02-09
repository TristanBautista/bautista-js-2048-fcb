// board will contain the current state of the board.
let board = [];
let score = 0;

let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// we are going to contain array of arrays or a matrix
// function that will set the gameboard:
function setGame(){
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	];

	// create the game board on the HTML document

	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			let tile = document.createElement("div");
			tile.id = r + "-" + c;
			//the two values [r] and [c] will locate the location of the element in the matrix
			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);
	}
}

	setOne();
	setOne();
}

// function to update appearance of a tile based on its number

function updateTile(tile, num){

	//clear the tile:
	tile.innerText = "";

	//clear the classlist to avoid multiple classes
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0){
		tile.innerText = num;

		if(num <= 4096){
			tile.classList.add("x" + num);
		}
			else{
			tile.classList.add("x8192")
			}
		
	}
}

// event that triggers when the webpage finishes loading. Its like saying "wait until everything on the page is ready."
window.onload = function(){
	setGame();
}

// function that handles the user's keyboard input when they press certain arrow keys.
function handleSlide(event){
	// console.log(event.code);
	event.preventDefault();

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){
		// If statement that will be based on which key was pressed
		if(event.code == "ArrowLeft" && canMoveLeft()){
			slideLeft();
			setOne();
		} else if (event.code == "ArrowRight" && canMoveRight()){
			slideRight();
			setOne();
		} else if (event.code == "ArrowUp" && canMoveUp()){
			slideUp();
			setOne();
		} else if (event.code == "ArrowDown" && canMoveDown()){
			slideDown();
			setOne();
		}
	}

	document.getElementById('score').innerText = score;

	setTimeout(()=> {
		if(hasLost()){
			alert("GAME OVER! You have lost the game. Game will restart.");
			restartGame();
			alert("Click any arrow key to start");
		}

		else{
			checkWin();
		}
	}, 100)
}

function restartGame(){
	score = 0;
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		];
	setOne(); 
}


// EventListener
document.addEventListener("keydown", handleSlide)

function slideLeft(){
	for(let r = 0; r < rows; r++){
		//current array from the row
		let row = board[r]; 
		let originalRow = row.slice();
		row = slide(row);

		// updating the current state of the board.
		board[r] = row;

		// add for loop that will change the tiles.
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalRow[c] != num && num != 0){
				tile.style.animation = "slide-from-right 0.3s"

					setTimeout(() => {
						tile.style.animation = ""
					}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideRight(){
	for(let r = 0; r < rows; r++){
		let row = board[r];
		let originalRow = row.slice();
		row = row.reverse();
		row = slide(row);
		row = row.reverse();
		board[r] = row;

		// update the tiles
		for(let c = 0; c < columns; c++){
			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}

			updateTile(tile, num);
		}
	}
}

function slideUp(){
	for(let c = 0; c < columns; c++){
		// the elements of the col from the current iteration
		let col = board.map(row => row[c]);
		let originalCol = col.slice();
		col = slide(col);
		for(let r = 0; r< rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];
			if(originalCol[r] !== num && num != 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() => {
					tile.style.animation = ""
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideDown(){
	for(let c = 0; c < columns; c++){
		let col = board.map(row => row[c]);
		let originalCol = col.slice();

		col = col.reverse();
		col = slide(col);
		col = col.reverse();
		for(let r = 0; r< rows; r++){
			board[r][c] = col[r]

			let tile = document.getElementById(r + "-" + c);
			let num = board[r][c];

			if(originalCol[r] !== num && num != 0){
				tile.style.animation = "slide-from-top 0.3s";

				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function filterZero(row){
	// this filter will remove the zero element from our array
	return row.filter(num => num != 0);
}

function slide (row){
	// getting rid of the zeros
	row = filterZero(row);

	// this for loop will check if there are 2 adjacent numbers that are equal and will combine them and change the value of the second number to zero.
	for(let i = 0; i < row.length; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2;
			row[i+1] = 0;
			score += row[i];
		}
	}

	row = filterZero(row);

	// add zeroes back
	while(row.length < columns){
		row.push(0);
	}

	return row;
}

// Create a function that will check if there are empty tiles or not
// Return boolean

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}

	return false;
}

// Create a functioin called setOne()
// It will randomly create/add a tile in the board
function setOne(){
	// early exit if there is no available slot for the tile:
	if(!hasEmptyTile()){
		return;
	}

	// found variable will tell if we are able to find a slot or position for the tile that will be added
	let found = false;

	while(!found){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);
		
		if(board[r][c] == 0){
			board[r][c] = 2;
			let tile = document.getElementById(r + "-" + c);
			updateTile(tile, board[r][c]);

			found = true
		}
	}

}

// function that will check if it is possible to move left.
function canMoveLeft(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			// console.log('${r}-${c}');

			if(board[r][c] != 0){
				// checks if the position to the left of the current tile is equal to itself
				if(board[r][c] == board[r][c-1] || board[r][c-1] == 0){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveRight(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if (board[r][c] != 0){
				if(board[r][c] == board[r][c+1] || board[r][c+1] == 0){
					return true;
				}
			}
		}
	}
	return false;
}

function canMoveUp(){
	for(let c = 0; c < columns; c++){
		for(let r = 1; r < rows; r++){
			if(board[r][c] != 0){
				if(board[r-1][c] == board[r][c] || board[r-1][c] == 0){
				}
				return true;
					
			}
		}
	}
	return false;
}
	
function canMoveDown(){
	for(let c = 0; c < columns; c++){
		for(let r = rows - 2; r >= 0; r--){
			if(board[r][c] != 0){
				if(board[r+1][c] == board[r][c] || board[r+1][c] == 0){
					return true;
				}
			}
		}
	}
	return false;
}

function checkWin(){
	for( let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert('You Win! You got the 2048!');
				is2048Exist = true;
			}else if(board[r][c] == 4096 && is4096Exist == false){
				alert('You are unstoppable at 4096! You are fantastically unstoppable!')
				is4096Exist = true;
			}else if(board[r][c] == 8192 && is8192Exist == false){
				alert('VICTORY! You have reached 8192! You are incredibly awesome!')
				is4096Exist = true;
			}
		}
	}
}

function hasLost(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return false;
			}

			let currentTile = board[r][c];
			if(r > 0 && board[r - 1][c] === currentTile ||
				r < rows - 1 && board[r+1][c] === currentTile ||
				c > 0 && board[r][c - 1] === currentTile ||
				c < columns - 1 && board[r][c + 1] === currentTile){
				return false
			}
		}
	}
	return true;
}