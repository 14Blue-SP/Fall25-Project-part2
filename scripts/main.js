document.addEventListener('keyup', UndoMove);
game = new Chess();

function isUpperCase(str) {
  str = String(str)
  return str === str.toUpperCase();
}

function toBoolean(s){
  return s==="true";
}

function getCoordinates(str){
  str = str.split("");
  return {file: str[0].charCodeAt(0)-97, rank: GM.ranks-str[1]}
}

//#region Collision Functions
function isVerticalCollision(move) {
  if (move.coords[0]===move.coords[2]) {
    let start = Math.min(move.coords[1], move.coords[3]) + 1;
    let end = Math.max(move.coords[1], move.coords[3]);
    for (let r=start; r<end; r++) {
      if (GM.getElement(move.coords[0], r)!==' ') {
        return true;
      }
    }
  }
  return false;
}

function isHorizontalCollision(move) {
  if (move.coords[1]==move.coords[3]) {
    let start = Math.min(move.coords[0], move.coords[2]) + 1;
    let end = Math.max(move.coords[0], move.coords[2]);
    for (let c=start; c<end; c++) {
      if (GM.getElement(c, move.coords[1])!==' ') {
        return true;
      }
    }
  }
  return false;
}

function isDiagonalCollision(move) {
  if(Math.abs(move.coords[0]-move.coords[2]) === Math.abs(move.coords[1]-move.coords[3])) {
    let colStep = (move.coords[2]-move.coords[0]) / Math.abs(move.coords[2]-move.coords[0]);
    let rowStep = (move.coords[3]-move.coords[1]) / Math.abs(move.coords[3]-move.coords[1]);
    let steps = Math.abs(move.coords[0]-move.coords[2]);
    for (let i = 1; i < steps; i++) {
      if (GM.getElement(move.coords[0] + i * colStep, move.coords[1] + i * rowStep)!==' ') {
        return true;
      }
    }
  }
  return false;
}
//#endregion

//#region Event Functions
function dragStart(ev){
  const piece = ev.target;
  if(GM.isWhiteTurn === toBoolean(piece.dataset.isWhite)){
    ev.dataTransfer.setData("text",piece.id);

    const _squares = Array.from(squares);
    let _piece = getCoordinates(piece.dataset.position);
    var moves = Array.from(GM.GetPossibleMoves()).filter(move => move.coords[0]===_piece.file && move.coords[1] === _piece.rank)
    moves.forEach(m=> legalSquares.push(_squares.find(s=> s.id === getSquareCoordinate(m.coords[2], m.coords[3]))));
  }
}
function dragOver(ev){
  ev.preventDefault();
  legalSquares.forEach(s => s.classList.add("selected"));
}
function drop(ev){
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  if(data==="") {return}
  const target = ev.currentTarget;
  const piece=document.getElementById(data);
  piece.parentElement.classList.remove("hover");

  let _piece = getCoordinates(piece.dataset.position);
  let _target = getCoordinates(target.id);
  let move = new Move(_piece.file,_piece.rank,_target.file,_target.rank);
  GM.MakeBoardMove(move);
  legalSquares.forEach(s => s.classList.remove("selected"));
  legalSquares=[];
}

function UndoMove(ev){
  if(ev.key === ' '){
    let latestMove = Chess.moves.pop();
    if(latestMove !== undefined){
      GM.UndoBoardMove(latestMove);
    }
  }
}
//#endregion
