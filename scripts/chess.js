const CS = new CheckScanner();
const spaces=[]
var pieces=[];

class Chess{
  constructor(){
    console.log("Chess Game");
    createBoard();
    GM.newStandardChessBoard();
    

    GM.setPiece(3,5,"R");

    GM.printBoard();
    placePieces();

    console.group("Possible Moves:");
    console.log(GM.getPossibleMoves().toString());
    console.groupEnd();
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