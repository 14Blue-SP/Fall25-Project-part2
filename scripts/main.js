const board=document.getElementById("chessBoard");
const GM=GameModel.getInstance();

game = new Chess();

// Create squares
function createBoard(){
  for(let rank=0; rank<GM.files; rank++){
    for(let file=0; file<GM.ranks; file++){
      let square = document.createElement("div");
      square.className="square";
      if((file+rank)%2===0)square.classList.add("light");
      else square.classList.add("dark");
      square.style.width=100/GM.files+"%";
      square.style.height=100/GM.ranks+"%";
      square.id = getCoordinate(file, rank)
      //square.dataset.file=file;
      //square.dataset.rank=rank;
      spaces.push(square);
      board.appendChild(square);
    }
  }
  //console.log(spaces);
}

// Display pieces
function placePieces(){
  pieces=[];
  GM.makePieces();
  GM.getPieces().forEach(piece => {
    let div = document.createElement("div");
    div.id = `${piece.isWhite?"white":"black"} ${piece.type}`;
    div.className="piece";
    div.dataset.type = piece.type;
    div.dataset.isWhite = piece.isWhite;
    div.dataset.position = getCoordinate(piece.col, piece.row);
    let icon = document.createElement("img");
    icon.src=piece.img;
    icon.alt=div.id;
    div.appendChild(icon);
    pieces.push(div);
    spaces.find(space => space.id === div.dataset.position).appendChild(div);
  });
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