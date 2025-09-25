const GM=GameModel.getInstance();
const CS=new CheckScanner();

const board=document.getElementById("chessBoard");
const squares=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");
const sprites = document.getElementsByTagName("img");

var legalSquares=[];

class Chess{
  constructor(){
    console.info("New Chess Game: ");
    this.init();
  }

  init(){
    GM.newStandardChessBoard();
    this.createBoard();
    this.drawCorodinates();
    createPieces();
  }

  createBoard(){
    for (let rank=0; rank<GM.ranks; rank++) {
      for (let file=0; file<GM.files; file++) {
        let square = document.createElement("div");
        square.id = getCoordinate(file, rank);
        square.addEventListener("dragover", endDrag);
        square.addEventListener("drop", drop);
        square.className = "square";
        square.style.width = 100/GM.files+"%";
        square.style.height = 100/GM.ranks+"%";
        if((file+rank)%2===0)square.classList.add("light");
        else square.classList.add("dark");
        board.appendChild(square);

        square.addEventListener('mouseenter', function(){square.classList.add("hover")});
        square.addEventListener('mouseleave', function(){square.classList.remove("hover")});
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

  static makePiece(p, _squares){
    let piece = document.createElement("div");
    piece.className="piece";
    piece.addEventListener("dragstart", drag);
    piece.setAttribute("draggable", true);
    _squares.find(square => square.id === getCoordinate(p.col, p.row)).replaceChildren(piece);
    piece.id =`${p.type} ${piece.parentElement.id}`;
    piece.dataset.isWhite = Boolean(p.isWhite);

    // add sprites to element
    let icon = document.createElement("img");
    icon.src=p.img;
    icon.alt=piece.id;
    icon.setAttribute("draggable", false);
    piece.appendChild(icon);
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

function createPieces(){
  const _squares = Array.from(squares);
  GM.getPieces().forEach(p => Chess.makePiece(p, _squares));
}