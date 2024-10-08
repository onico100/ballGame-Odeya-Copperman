var WALL = "WALL";
var FLOOR = "FLOOR";
var BALL = "BALL";
var GAMER = "GAMER";

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';

var numOfBalls = 0;
var gBoard;
var gGamerPos;
let gInterval;
let gBalls = 2;
function initGame() {
  gGamerPos = { i: 2, j: 9 };
  gBoard = buildBoard();
  renderBoard(gBoard);

  gInterval = setInterval(addBall, 5000);
}

function buildBoard() {
  // Create the Matrix
  // var board = createMat(10, 12)
  var board = new Array(10);
  for (var i = 0; i < board.length; i++) {
    board[i] = new Array(12);
  }

  // Put FLOOR everywhere and WALL at edges
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      // Put FLOOR in a regular cell
      var cell = { type: FLOOR, gameElement: null };

      // Place Walls at edges
      if (
        i === 0 ||
        i === board.length - 1 ||
        j === 0 ||
        j === board[0].length - 1
      ) {
        cell.type = WALL;
      }
      //add holes
      if (
        (i == 0 && j == 6) ||
        (i == board.length - 1 && j == 6) ||
        (i == 4 && j == 0) ||
        (i == 4 && j == board[0].length - 1)
      ) {
        cell.type = FLOOR;
      }
      // Add created cell to The game board
      board[i][j] = cell;
    }
  }

  // Place the gamer at selected position
  board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

  // Place the Balls (currently randomly chosen positions)
  board[3][8].gameElement = BALL;
  board[7][4].gameElement = BALL;

  console.log(board);
  return board;
}

// Render the board to an HTML table
function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });

      // TODO - change to short if statement
      if (currCell.type === FLOOR) cellClass += " floor";
      else if (currCell.type === WALL) cellClass += " wall";

      //TODO - Change To ES6 template string
      strHTML +=
        '\t<td class="cell ' +
        cellClass +
        '"  onclick="moveTo(' +
        i +
        "," +
        j +
        ')" >\n';

      // TODO - change to switch case statement
      if (currCell.gameElement === GAMER) {
        strHTML += GAMER_IMG;
      } else if (currCell.gameElement === BALL) {
        strHTML += BALL_IMG;
      }

      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }

  console.log("strHTML is:");
  console.log(strHTML);
  var elBoard = document.querySelector(".board");
  elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
  var hall = true;
  if (i === -1 && j === 6) i = gBoard.length - 1;
  else if (i === gBoard.length && j === 6) i = 0;
  else if (i === 4 && j === -1) j = gBoard[0].length - 1;
  else if (i === 4 && j === gBoard[0].length) j = 0;
  else hall = false;

  var targetCell = gBoard[i][j];
  console.log(targetCell.type);
  if (targetCell.type === WALL) return;

  // Calculate distance to make sure we are moving to a neighbor cell
  var iAbsDiff = Math.abs(i - gGamerPos.i);
  var jAbsDiff = Math.abs(j - gGamerPos.j);

  // If the clicked Cell is one of the four allowed
  if (
    hall ||
    (iAbsDiff === 1 && jAbsDiff === 0) ||
    (jAbsDiff === 1 && iAbsDiff === 0)
  ) {
    if (targetCell.gameElement === BALL) {
      increaseNumberOfBalls();
      setTimeout(() => {
        checkIfWin();
      }, "100");
    }

    // MOVING from current position
    // Model:
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
    // Dom:
    renderCell(gGamerPos, "");

    // MOVING to selected position
    // Model:
    gGamerPos.i = i;
    gGamerPos.j = j;
    console.log("Moved to: " + gGamerPos.i + "," + gGamerPos.j);
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    // DOM:
    renderCell(gGamerPos, GAMER_IMG);
  } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
  var i = gGamerPos.i;
  var j = gGamerPos.j;

  switch (event.key) {
    case "ArrowLeft":
      moveTo(i, j - 1);
      break;
    case "ArrowRight":
      moveTo(i, j + 1);
      break;
    case "ArrowUp":
      moveTo(i - 1, j);
      break;
    case "ArrowDown":
      moveTo(i + 1, j);
      break;
  }
}

// Returns the class name for a specific cell
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  console.log("cellClass:", cellClass);
  return cellClass;
}

// Increase the number of balls
function increaseNumberOfBalls() {
  ++numOfBalls;
  renderNumberOfBalls(numOfBalls);
}

// Render the number of balls
function renderNumberOfBalls(numOfBalls) {
  var elNumOfBalls = document.querySelector("#numOfBalls");
  elNumOfBalls.innerHTML = `balls: ${numOfBalls}`;
}

// Add a ball to the board
function addBall() {
  var emptyCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].gameElement === null && gBoard[i][j].type !== WALL) {
        emptyCells.push({ i: i, j: j });
      }
    }
  }
  if (emptyCells.length === 0) return;

  var randomIdx = Math.floor(Math.random() * emptyCells.length);
  var randomEmptyCell = emptyCells[randomIdx];

  gBoard[randomEmptyCell.i][randomEmptyCell.j].gameElement = BALL;
  renderCell(randomEmptyCell, BALL_IMG);
  gBalls++; // increment
}

function checkIfWin() {
  if (gBalls !== numOfBalls) return;
  clearInterval(gInterval);
  alert("Congratulations! You win!");
}

function restart() {
  numOfBalls = 0;
  renderNumberOfBalls(numOfBalls);
  gBalls = 2;
  clearInterval(gInterval);
  initGame();
}

function isHall(i, j) {}
