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
  }
}

function getCoordinate(col, row){
  return `${String.fromCharCode(97+col)}${GM.ranks-row}`;
}