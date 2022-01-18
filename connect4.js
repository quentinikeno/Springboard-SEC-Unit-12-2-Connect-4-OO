/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Player {
	constructor(color) {
		this.color = color;
	}
}

class Game {
	constructor(p1, p2, HEIGHT, WIDTH) {
		this.players = [p1, p2];
		this.WIDTH = WIDTH;
		this.HEIGHT = HEIGHT;
		this.currPlayer = p1; // active player: 1 or 2
		this.board = []; // array of rows, each row is array of cells  (board[y][x])
		this.findSpotForCol = this.findSpotForCol.bind(this);
		this.placeInTable = this.placeInTable.bind(this);
		this.checkForWin = this.checkForWin.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.endGame = this.endGame.bind(this);
		this.makeBoard();
		this.makeHtmlBoard();
	}
	/** makeBoard: create in-JS board structure:
	 *   board = array of rows, each row is array of cells  (board[y][x])
	 */

	makeBoard() {
		const { WIDTH, HEIGHT, board } = this;
		for (let y = 0; y < HEIGHT; y++) {
			board.push(Array.from({ length: WIDTH }));
		}
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const { WIDTH, HEIGHT, handleClick } = this;
		const board = document.getElementById("board");
		board.innerHTML = "";

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", handleClick);

		for (let x = 0; x < WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < HEIGHT; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < WIDTH; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */
	findSpotForCol(x) {
		const { HEIGHT, board } = this;
		for (let y = HEIGHT - 1; y >= 0; y--) {
			if (!board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const { currPlayer } = this;
		const piece = document.createElement("div");
		piece.classList.add("piece");
		piece.style.backgroundColor = currPlayer.color;
		piece.style.top = -50 * (y + 2);

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	/** endGame: announce game end */

	endGame(msg) {
		const { handleClick } = this;
		const top = document.getElementById("column-top");
		top.removeEventListener("click", handleClick);
		alert(msg);
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		const {
			board,
			players,
			placeInTable,
			checkForWin,
			findSpotForCol,
			endGame,
		} = this;
		let { currPlayer } = this;
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		board[y][x] = currPlayer;
		placeInTable(y, x);

		// check for win
		if (checkForWin()) {
			return endGame(`The ${currPlayer.color} player won!`);
		}

		// check for tie
		if (board.every((row) => row.every((cell) => cell))) {
			return endGame("Tie!");
		}

		// switch players
		this.currPlayer = currPlayer === players[0] ? players[1] : players[0];
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		const { WIDTH, HEIGHT, board } = this;
		let { currPlayer } = this;
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < HEIGHT &&
					x >= 0 &&
					x < WIDTH &&
					board[y][x] === currPlayer
			);
		}

		for (let y = 0; y < HEIGHT; y++) {
			for (let x = 0; x < WIDTH; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

document.getElementById("startButton").addEventListener("click", (event) => {
	event.preventDefault();
	event.stopPropagation();
	const p1Color = document.getElementById("p1Color").value;
	const p2Color = document.getElementById("p2Color").value;
	const p1 = new Player(p1Color);
	const p2 = new Player(p2Color);
	new Game(p1, p2, 6, 7);
});
