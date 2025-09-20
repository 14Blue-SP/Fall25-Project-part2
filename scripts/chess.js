const CS = new CheckScanner();
const spaces=[]
var pieces=[];

class Chess{
  constructor(){
    console.log("Chess Game");
    createBoard();
    GM.newStandardChessBoard();
  }

  static Piece(col, row, isWhite){
    const Piece = {
      col: col,
      row: row,
      isWhite: isWhite,
      type: "",
      img: ""
    };
    return Piece;
  }
}

function GetPossibleMoves(){
  if(DEBUG){console.groupCollapsed("Possible Moves:");}
  const moves = GM.getPossibleMoves();
  if(DEBUG){
    console.log(moves.toString());
    console.groupEnd("Possible Moves:");
  }
  return moves;
}