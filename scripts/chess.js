const GM=GameModel.getInstance();
const CS=new CheckScanner();

const board=document.getElementById("chessBoard");
const squares=document.getElementsByClassName("square");
const pieces=document.getElementsByClassName("piece");

var legalSquares=[];

class Chess{
  static moves = [];
  constructor(){
    console.info("New Chess Game: ");
    this.init();
  }

  init(){
    this.createBoard();
    this.drawCorodinates();
    GM.newStandardChessBoard();
    this.createPieces();
  }

  createBoard(){
    for (let rank=0; rank<GM.ranks; rank++) {
      for (let file=0; file<GM.files; file++) {
        let square = document.createElement("div");
        square.id = getSquareCoordinate(file, rank);
        square.className = "square";
        square.style.width = 100/GM.files+"%";
        square.style.height = 100/GM.ranks+"%";
        if((file+rank)%2===0)square.classList.add("light");
        else square.classList.add("dark");
        board.appendChild(square);

        square.addEventListener("dragover", dragOver);
        square.addEventListener("drop", drop);
        square.addEventListener('mouseenter', function(){square.classList.add("hover")});
        square.addEventListener('mouseleave', function(){square.classList.remove("hover")})
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

  createPieces(){
    const _squares = Array.from(squares);
    GM.getPieces().forEach(p => Chess.makePiece(p, _squares));
  }

  static Piece(coords, piece){
    const Piece = {
      file: coords.col,
      rank: coords.row,
      isWhite: isUpperCase(piece),
      type: getType(piece),
      img: `pieceImages/${piece.isWhite?"white":"black"}-${piece.type}.png`
    };
    return Piece;
  }

  static makePiece(piece, _squares){
    let p = document.createElement("div");
    p.className="piece";
    p.setAttribute("draggable", true);
    p.addEventListener("dragstart", dragStart);
    _squares.find(square => square.id === getSquareCoordinate(piece.file, piece.rank)).replaceChildren(p);
    p.dataset.isWhite = piece.isWhite;
    p.dataset.position = p.parentElement.id;

    // add sprites to element
    let icon = document.createElement("img");
    icon.src=piece.img;
    icon.alt=p.id;
    icon.setAttribute("draggable", false);
    p.appendChild(icon);
    p.id =`${piece.type} ${p.parentElement.id}`;
  }

  static movePiece(move, undo){
    const _squares = Array.from(squares);
    const _pieces = Array.from(pieces);
    let _piece; let _square;
    if (undo){
      _piece = getSquareCoordinate(move.coords[2],move.coords[3]);
      _square = getSquareCoordinate(move.coords[0],move.coords[1]);
    } else {
      _piece = getSquareCoordinate(move.coords[0],move.coords[1]);
      _square = getSquareCoordinate(move.coords[2],move.coords[3]);
    }
    const piece = _pieces.find(p=>p.dataset.position===_piece);
    const target = _squares.find(s=>s.id===_square);
    if(move.special==="e.p."){
      let direction = move.isWhite ? 1:-1;
      let s = getSquareCoordinate(move.coords[2],move.coords[3]+direction);
      const en = _squares.find(square=>square.id===s);
      en.replaceChildren();
      if(undo){
        move.coords[3]+=direction;
      }
    }
    if(move.special.charAt(0)==="="){
      if (undo) {
        move.piece=move.isWhite ? 'P':'p';
      }
      piece.children[0].src=`pieceImages/${move.isWhite?"white":"black"}-${getType(move.piece)}.png`;
      piece.id = `${getType(move.piece)} ${piece.parentElement.id}`
    }
    if(move.special==="0-0"){
      let space; let _piece;
      var s; var p
      if(undo){
        space = getSquareCoordinate(7,move.coords[3]);
        _piece = getSquareCoordinate(move.coords[2]-1,move.coords[3]);
        s = _squares.find(square=>square.id===space);
        p = _pieces.find(piece=>piece.dataset.position===_piece);
        //console.log(space, s, _pieces)
      } else {
        space = getSquareCoordinate(move.coords[2]-1,move.coords[3]);
        _piece = getSquareCoordinate(7,move.coords[3]);
        s = _squares.find(square=>square.id===space);
        p = _pieces.find(piece=>piece.dataset.position===_piece);
        //console.log(space, s, p)
      }
      s.replaceChildren(p);
      p.dataset.position = p.parentElement.id;
      p.id =`${p.id.split(" ")[0]} ${p.parentElement.id}`;
    }
    if(move.special==="0-0-0"){
      let space; let _piece;
      var s; var p
      if(undo){
        space = getSquareCoordinate(0,move.coords[3]);
        _piece = getSquareCoordinate(move.coords[2]+1,move.coords[3]);
        s = _squares.find(square=>square.id===space);
        p = _pieces.find(piece=>piece.dataset.position===_piece);
        //console.log(space, s, _pieces)
      } else {
        space = getSquareCoordinate(move.coords[2]+1,move.coords[3]);
        _piece = getSquareCoordinate(0,move.coords[3]);
        s = _squares.find(square=>square.id===space);
        p = _pieces.find(piece=>piece.dataset.position===_piece);
        //console.log(space, s, p)
      }
      s.replaceChildren(p);
      p.dataset.position = p.parentElement.id;
      p.id =`${p.id.split(" ")[0]} ${p.parentElement.id}`;
    }
    target.replaceChildren(piece);
    if (undo){
      if(move.capture !== ' '){
      let p = GM.getPieces().find(piece => piece.file===move.coords[2] && piece.rank===move.coords[3]);
      if (p===undefined) {
        console.log(p);
        return;
      }
      Chess.makePiece(p, _squares);
      }
    }
    piece.dataset.position = piece.parentElement.id;
    piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;
  }
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

function getSquareCoordinate(col, row){
  return `${String.fromCharCode(97+col)}${GM.ranks-row}`;
}