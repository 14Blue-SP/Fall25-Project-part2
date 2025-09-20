class CheckScanner{

  Alliance(p1, p2){
    if(p1==" " || p2==" "){
      return false;
    }
    return isUpperCase(p1)===isUpperCase(p2);
  }

  isLegalMove(move){
    if(this.Alliance(GM.getChessBoard()[GM.getIndex(move.col, move.row)], move.capture)){
      return false;
    }
    if(!move.isValidMove()){
      return false;
    }
    if(move.pieceCollision()){
      return false;
    }
    return true;
  }

  checkMove(move, index){
    let piece = GM.getChessBoard()[GM.getIndex(move.col,move.row)];
    GM.setPiece(move.col, move.row, " ");
    GM.setPiece(move.newCol, move.newRow, piece);
    let kingTemp=index;
    if(piece === "K"){
      kingTemp = GM.whiteKingIndex;
    }
    let isCheck = this.isCheck(isUpperCase(piece));
    GM.setPiece(move.col, move.row, piece);
    GM.setPiece(move.newCol, move.newRow, move.capture);
    if(piece === "K"){
      GM.whiteKingIndex = kingTemp;
    }
    return isCheck;
  }

  isCheck(isWhite){
    return false;
  }
}