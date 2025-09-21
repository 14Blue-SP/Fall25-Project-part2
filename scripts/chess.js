var MAX_DEPTH = 4;
const CS = new CheckScanner();

class Chess{
  constructor(){
    console.log("Chess Game");
    createBoard();
    GM.newStandardChessBoard();

    let move = new Move(0,0,0,0," ");
    console.log(GM.MinMax(MAX_DEPTH, Number.MAX_VALUE, Number.MIN_VALUE, move, true).toString());
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