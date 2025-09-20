const CS = new CheckScanner();
const spaces=[]
var pieces=[];

class Chess{
  constructor(){
    console.log("Chess Game");
    createBoard();
    GM.newStandardChessBoard();
    

    GM.setPiece(4,5,"K");
    GM.setPiece(4,7," ");
    GM.whiteKingIndex = GM.getIndex(4,5);
    //GM.setPiece(5,4,"p");
    GM.setPiece(6,1,"P");
    GM.setPiece(2,6,"P");

    GM.printBoard();
    placePieces();

    if(DEBUG){
      console.group("Possible Moves:");
      console.log(GM.getPossibleMoves().toString());
      console.groupEnd();
    }
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