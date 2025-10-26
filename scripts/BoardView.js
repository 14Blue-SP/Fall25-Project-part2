const GM=GameModel.getInstance();

const board=document.getElementById("chessBoard");
const squares=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");

var legalSquares=[];

class BoardView {
  constructor() {
    this.board = GM.boardModel;
    this.init();
  }

  init() {
    let result = parseInt(prompt("What kind of game do you want to play?\n0:Player vs Player -- 1:Player vs Computer"));
    if (result===1) {GM.computerGame=true;} else {GM.computerGame=false;}

    if (GM.computerGame) {
      result = parseInt(prompt("Do you want to play as 0:White or 1:Black?"));
      if (result===1) {GM.playerIsWhite=false;} else {GM.playerIsWhite=true;}
    }

    this.createBoard();
    this.drawCorodinates();
    GM.newGame();
    this.createPieces();
    if (GM.computerGame && GM.isWhiteTurn===!GM.playerIsWhite) {GM.computerMove();}
  }
  
  //#region Display functions
  createBoard() {
    for (let i=0; i<this.board.getBoard().length; i++) {
      let coord = this.board.getCoordinates(i);
      let square = document.createElement("div");
      square.id = getSquareCoordinate(coord.File, coord.Rank);
      square.className = "square";
      square.style.width = 100/GM.boardModel.files+"%";
      square.style.height = 100/GM.boardModel.ranks+"%";
      if ((coord.File+coord.Rank)%2===0 === GM.playerIsWhite) { square.classList.add("light"); }
      else { square.classList.add("dark");}
      board.appendChild(square);

      square.addEventListener("dragover", dragOver);
      square.addEventListener("drop", drop);
      square.addEventListener('mouseenter', function(){square.classList.add("hover")});
      square.addEventListener('mouseleave', function(){square.classList.remove("hover")})
    }
  }

  drawCorodinates(){
    let coord = document.getElementById("vertical");
    for (let i=0; i<GM.boardModel.ranks; i++){
      let text = document.createElement("p");
      text.className = "coordinate";
      text.innerHTML = GM.boardModel.ranks-i;
      if (!GM.playerIsWhite) {text.innerHTML = i+1;}
      coord.appendChild(text);
    }
    coord = document.getElementById("horizontal");
    for (let i=0; i<GM.boardModel.files; i++){
      let text = document.createElement("p");
      text.className = "coordinate";
      text.innerHTML = String.fromCharCode(97+i);
      if (!GM.playerIsWhite) {text.innerHTML = String.fromCharCode(97+(GM.boardModel.files-1)-i);}
      coord.appendChild(text);
    }
  }

  createPieces() {
    GM.boardModel.getBoard().forEach( square => {
      if (!square.isEmpty()){
        BoardView.makePiece(square);
      }
    });
  }

  static makePiece(square){
    let piece = square.piece;
    piece.img = `pieceImages/${piece.isWhite?"white":"black"}-${piece.name}.png`
    const _squares = Array.from(squares);
    let p = document.createElement("div");
    p.className = "piece";
    p.setAttribute("draggable", true);
    p.addEventListener('dragstart', dragStart);
    _squares.find(sq => sq.id === getSquareCoordinate(square.col, square.row)).replaceChildren(p);
    p.dataset.isWhite = square.piece.isWhite;
    p.dataset.position = p.parentElement.id;

    // Set piece image
    let img = document.createElement("img");
    img.src = square.piece.img;
    img.alt = square.piece.type;
    img.setAttribute("draggable", false);
    p.appendChild(img);
    p.id = `${square.piece.name} ${p.parentElement.id}`;
  }

  static clearPiece(square) {
    let piece = square.piece;
    const _squares = Array.from(squares);
    const s = _squares.find(sq => sq.id === getSquareCoordinate(square.col, square.row));
    s.replaceChildren();
  }
  //#endregion
}

function getSquareCoordinate(col, row){
  if (!GM.playerIsWhite){
    col = (GM.boardModel.files-1)-col;
    row = (GM.boardModel.ranks-1)-row;
  }
  return `${String.fromCharCode(97+col)}${GM.boardModel.ranks-row}`;
}