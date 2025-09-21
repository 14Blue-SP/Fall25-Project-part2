const DEBUG = false;
const board=document.getElementById("chessBoard");
const GM=GameModel.getInstance();
var possibleSquares=[];
const squares=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");
const sprites = document.getElementsByTagName("img");

var latestMove=null;
document.addEventListener('keyup', UndoMove);

game = new Chess();

// Create squares
function createBoard(){
  for(let rank=0; rank<GM.ranks; rank++){
    for(let file=0; file<GM.files; file++){
      let square = document.createElement("div");
      square.id = getCoordinate(file, rank)
      square.addEventListener("dragover", endDrag);
      square.addEventListener("drop", drop);
      square.className="square";
      if((file+rank)%2===0)square.classList.add("light");
      else square.classList.add("dark");
      square.style.width=100/GM.files+"%";
      square.style.height=100/GM.ranks+"%";
      board.appendChild(square);
    }
  }
}

// Display pieces
function createPieces(){
  const _squares = Array.from(squares);
  GM.getPieces().forEach(p => MakePiece(p, _squares));
}

function MakePiece(p, _squares){
  let piece = document.createElement("div");
    piece.className="piece";
    piece.addEventListener("dragstart", drag);
    piece.setAttribute("draggable", true);
    _squares.find(square => square.id === getCoordinate(p.col, p.row)).appendChild(piece);
    piece.id =`${p.type} ${piece.parentElement.id}`;

    // add sprites to element
    let icon = document.createElement("img");
    icon.src=p.img;
    icon.alt=piece.id;
    icon.setAttribute("draggable", false);
    piece.appendChild(icon);
}

function isUpperCase(str) {
  return str === str.toUpperCase();
}

function getType(str){
  str = str.toLowerCase();
  switch(str.charCodeAt(0)){
    case 98 : return "bishop"; break;
    case 107 : return "king"; break;
    case 110 : return "knight"; break;
    case 112 : return "pawn"; break;
    case 113 : return "queen"; break;
    case 114 : return "rook"; break;
    default : return null;
  }
}

function getCoordinate(col, row){
  return `${String.fromCharCode(97+col)}${GM.ranks-row}`;
}

function isVerticalCollision(move) {
  if (move.col === move.newCol) {
    let start = Math.min(move.row, move.newRow) + 1;
    let end = Math.max(move.row, move.newRow);
    for (let r = start; r < end; r++) {
      if (GM.getChessBoard()[GM.getIndex(move.col, r)]!==" ") {
        return true;
      }
    }
  }
  return false;
}

function isHorizontalCollision(move) {
  if (move.row === move.newRow) {
    let start = Math.min(move.col, move.newCol) + 1;
    let end = Math.max(move.col, move.newCol);
    for (let c = start; c < end; c++) {
      if (GM.getChessBoard()[GM.getIndex(c, move.row)]!==(" ")) {
        return true;
      }
    }
  }
  return false;
}

function isDiagonalCollision(move) {
  if (Math.abs(move.col-move.newCol) === Math.abs(move.row-move.newRow)) {
    colStep = (move.newCol-move.col) / Math.abs(move.newCol-move.col);
    rowStep = (move.newRow-move.row) / Math.abs(move.newRow-move.row);
    steps = Math.abs(move.col-move.newCol);
    for (let i = 1; i < steps; i++) {
      if (GM.getChessBoard()[GM.getIndex(move.col + i * colStep, move.row + i * rowStep)]!==" ") {
        return true;
      }
    }
  }
  return false;
}

//#region event functions
function UndoMove(ev){
  if(ev.key === ' '){
    const _pieces = Array.from(pieces);
    const _squares = Array.from(squares);
    if(latestMove !== null){
      GM.undoMove(latestMove);
      let s1 = getCoordinate(latestMove.newCol, latestMove.newRow);
      let s2 = getCoordinate(latestMove.col, latestMove.row);
      const piece = _pieces.find(piece => piece.id.split(" ")[1] === s1);
      const square = _squares.find(square => square.id === s2)
      square.replaceChildren(piece);
      piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;
      if(latestMove.capture !== " "){
        let piece = GM.getPieces().find(piece => piece.col===move.newCol && piece.row===move.newRow);
        MakePiece(piece, _squares);
      }
    }
    latestMove = null;
  }
}

function endDrag(ev){
  ev.preventDefault();
}

function drag(ev){
  const piece=ev.target;
  ev.dataTransfer.setData("text",piece.id);
}

function drop(ev){
  ev.preventDefault();
  const _target = ev.currentTarget;
  const data = ev.dataTransfer.getData("text");
  const piece=document.getElementById(data);
  let position = data.split(" ")[1];
  position = position.split(""); 
  position[0] = position[0].charCodeAt(0)-97;
  position[1] = parseInt(GM.ranks-position[1]);
  let target = _target.id;
  target = target.split("");
  target[0] = target[0].charCodeAt(0)-97;
  target[1] = parseInt(GM.ranks-target[1]);

  move = new Move(position[0],position[1],target[0],target[1],GM.getChessBoard()[GM.getIndex(target[0],target[1])]);
  if(GM.makeMove(move)){
    _target.replaceChildren(piece);
    piece.id =`${data.split(" ")[0]} ${piece.parentElement.id}`;
    latestMove=move;
  }
}
//#endregion