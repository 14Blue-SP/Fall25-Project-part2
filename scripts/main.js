document.addEventListener('keyup', UndoMove);
game = new Chess();

function isUpperCase(str) {
  str = String(str)
  return str === str.toUpperCase();
}

function toBoolean(s){
  return s==="true";
}

function getType(str){
  str = str.toLowerCase();
  switch(str.charAt(0)){
    case 'b' : return "bishop"; break;
    case 'k' : return "king"; break;
    case 'n' : return "knight"; break;
    case 'p' : return "pawn"; break;
    case 'q' : return "queen"; break;
    case 'r' : return "rook"; break;
  }
}

function getCoordinate(col, row){
  return `${String.fromCharCode(97+col)}${GM.ranks-row}`;
}

//#region Collision Functions
function isVerticalCollision(move) {
  if (move.coords[0]===move.coords[2]) {
    let start = Math.min(move.coords[1], move.coords[3]) + 1;
    let end = Math.max(move.coords[1], move.coords[3]);
    for (let r=start; r<end; r++) {
      if (GM.getChessBoard()[GM.getIndex(move.coords[0], r)]!==' ') {
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
      if (GM.getChessBoard()[GM.getIndex(c, move.coords[1])]!==' ') {
        return true;
      }
    }
  }
  return false;
}

function isDiagonalCollision(move) {
  if(Math.abs(move.coords[0]-move.coords[2]) == Math.abs(move.coords[1]-move.coords[3])) {
    let colStep = (move.coords[2]-move.coords[0]) / Math.abs(move.coords[2]-move.coords[0]);
    let rowStep = (move.coords[3]-move.coords[1]) / Math.abs(move.coords[3]-move.coords[1]);
    let steps = Math.abs(move.coords[0]-move.coords[2]);
    for (let i = 1; i < steps; i++) {
      if (GM.getChessBoard()[GM.getIndex(move.coords[0] + i * colStep, move.coords[1] + i * rowStep)]!==' ') {
        return true;
      }
    }
  }
  return false;
}
//#endregion

//#region Event Functions
function drag(ev){
  const _squares = Array.from(squares);
  const piece = ev.target;
  if(GM.isWhiteTurn === toBoolean(piece.dataset.isWhite)){
    ev.dataTransfer.setData("text",piece.id);
  }
  piece.parentElement.classList.remove("hover");
  let position = piece.parentElement.id.split(""); 
  position[0] = position[0].charCodeAt(0)-97;
  position[1] = parseInt(GM.ranks-position[1]);
  var moves = Array.from(GM.GetPossibleMoves());
  moves = moves.filter(s => s.coords[0]===position[0] && s.coords[1] === position[1])
  moves.forEach(m=> legalSquares.push(_squares.find(s=> s.id === getCoordinate(m.coords[2], m.coords[3]))));
}

function endDrag(ev){
  ev.preventDefault();
  legalSquares.forEach(s => s.classList.add("selected"));
}

function drop(ev){
  ev.preventDefault();
  const _target = ev.currentTarget;
  const data = ev.dataTransfer.getData("text");
  if(data===""){return}
  const piece=document.getElementById(data);
  let position = data.split(" ")[1];
  position = position.split(""); 
  position[0] = position[0].charCodeAt(0)-97;
  position[1] = parseInt(GM.ranks-position[1]);
  let target = _target.id;
  target = target.split("");
  target[0] = target[0].charCodeAt(0)-97;
  target[1] = parseInt(GM.ranks-target[1]);

  let move = new Move(position[0],position[1],target[0],target[1]);
  if(true){
    GM.MakeBoardMove(move);
  }
  legalSquares.forEach(s => s.classList.remove("selected"));
  legalSquares=[];
}

function UndoMove(ev){
  if(ev.key === ' '){
    if(GM.lastMove !== null){
      GM.UndoBoardMove(GM.lastMove);
      GM.lastMove = null;
    }
  }
}
//#endregion