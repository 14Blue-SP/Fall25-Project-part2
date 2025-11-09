document.addEventListener('keyup', UndoMove);
game = new BoardView();

function isUpperCase(str) {
  str = String(str)
  return str === str.toUpperCase();
}

function toBoolean(s){
  return s==="true";
}

function getCoordinates(str){
  str = str.split("");
  if (!GM.playerIsWhite) {return {File: GM.boardModel.ranks-(str[0].charCodeAt(0)-97)-1, Rank: str[1]-1}}
  return {File: str[0].charCodeAt(0)-97, Rank: GM.boardModel.ranks-str[1]}
}

//#region Event Handlers
function UndoMove(ev) {
  if (!GM.isPlaying) {return;}
  if(ev.key === ' ') {
    if (GM.getMoves().length===0) {return;}
    let move = GM.undoMove();
    MovePiece(move, true);
    if (GM.computerGame) {
      move = GM.undoMove();
      if (move !== undefined) {MovePiece(move, true);}
      if (GM.getMoves().length===0) {GM.isWhiteTurn=true; GM.computerMove();}
      return;
    }
  }
  GM.nextTurn();
}
function dragStart(ev) {
  const piece = ev.target;
  if (!GM.isPlaying) {return;}
  if (GM.isWhiteTurn === toBoolean(piece.dataset.isWhite)) {
    if (GM.computerGame) {
      if (GM.isWhiteTurn != GM.playerIsWhite) {return;}
    }
    ev.dataTransfer.setData("text", piece.id);
    //console.log("Drag Start", piece.id);

    let select = getCoordinates(piece.dataset.position);
    let square = GM.boardModel.getElement(select.File, select.Rank);
    GM.boardModel.findMoves(square);

    const _squares = Array.from(squares);
    let moves = Array.from(GM.boardModel.getElement(select.File, select.Rank).piece.moves);
    moves.forEach(m=> legalSquares.push(_squares.find(s=> s.id === getSquareCoordinate(m.target.col, m.target.row))));
  }
}
function dragOver(ev) {
  ev.preventDefault();
  legalSquares.forEach(s => s.classList.add("selected"));
}
function drop(ev) {
  ev.preventDefault();
  var pieceId = ev.dataTransfer.getData("text");
  if(pieceId==="") {return}
  const piece = document.getElementById(pieceId);
  const targetSquare = ev.target.closest('.square');
  piece.parentElement.classList.remove("hover");
  
  var from = getCoordinates(piece.dataset.position);
  var to = getCoordinates(targetSquare.id);
  from = GM.boardModel.getElement(from.File, from.Rank);
  to = GM.boardModel.getElement(to.File, to.Rank);
  var move = new Move(from, to);

  let isValid = from.piece.moves.some(m => {if(m.equals(move)) {move = m; return true;} return false;})

  if(isValid) {
    console.log(`Move: ${pieceId} to ${targetSquare.id} -- ${move}`);
    if (move.special.startsWith("=")) {GM.promotionSelection(move);}
    GM.makeMove(move);
    GM.nextTurn();
    GM.boardModel.printBoard();
  }
  from.piece.moves = [];
  legalSquares.forEach(s => s.classList.remove("selected"));
  legalSquares=[];

  if (GM.computerGame && GM.isWhiteTurn==!GM.playerIsWhite) {GM.computerMove();}
}
//#endregion

function MovePiece(move, undo) {
  const _pieces = Array.from(pieces);
  const _squares = Array.from(squares);

  var from, to;
  if (!undo) {from = move.initial, to = move.target;}
  else {from = move.target, to = move.initial;}

  if (undo) {
    if (!from.isEmpty()){
      BoardView.makePiece(from);
    }

    if (move.special.startsWith("=")) {
      BoardView.makePiece(to);
      console.log(`Undo special move:}`, from, to);
      return;
    }
  }
  
  
  from = _pieces.find(p=>p.id.split(" ")[1]===getSquareCoordinate(from.col,from.row)).id;
  to = _squares.find(s=>s.id===getSquareCoordinate(to.col,to.row));

  from = _pieces.find(p=>p.id===from);
  to.replaceChildren(from);
  from.dataset.position = from.parentElement.id;
  from.id = `${from.id.split(" ")[0]} ${from.parentElement.id}`;
}