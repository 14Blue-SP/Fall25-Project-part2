const board=document.getElementById("chessBoard");
const GM=GameModel.getInstance();

const squares=document.getElementsByClassName("square");
var pieces=[];

class Chess{
  constructor(){
    console.info("New Chess Game: ");
    this.init();
  }

  init(){
    GM.newStandardChessBoard();
    this.createBoard();
    this.drawCorodinates();
    placePieces();
  }

  createBoard(){
    for (let rank=0; rank<GM.ranks; rank++) {
      for (let file=0; file<GM.files; file++) {
        let square = document.createElement("div");
        square.id = getCoordinate(file, rank);
        square.className = "square";
        square.style.width = 100/GM.files+"%";
        square.style.height = 100/GM.ranks+"%";
        if((file+rank)%2===0)square.classList.add("light");
        else square.classList.add("dark");
        board.appendChild(square);
      }
    }
  }

  drawCorodinates(){
    let coord = document.getElementById("vertical");
    for (let i=0; i<GM.ranks; i++){
      let text = document.createElement("p");
      text.className = "coordinate";
      text.innerHTML = GM.ranks-i;
      coord.appendChild(text);
    }
    coord = document.getElementById("horizontal");
    for (let i=0; i<GM.files; i++){
      let text = document.createElement("p");
      text.className = "coordinate";
      text.innerHTML = String.fromCharCode(97+i);
      coord.appendChild(text);
    }
  }

  static Piece(coords, piece){
    const Piece = {
      col: coords.file,
      row: coords.rank,
      isWhite: isUpperCase(piece),
      type: getType(piece),
      img: ""
    };
    return Piece;
  }
}

// Display pieces
function placePieces(){
  pieces=[];
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
    Array.from(squares).find(space => (space.id===div.dataset.position)).appendChild(div);
  });
}