class CheckScanner{
  Alliance(p1, p2){
    if(p1==" " || p2==" "){
      return false;
    }
    return isUpperCase(p1)===isUpperCase(p2);
  }

   isLegalMove(move){
    if(move.isWhite !== GM.isWhiteTurn){
      return false;
    }
    if(this.Alliance(move.piece, move.capture)){
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

  isSafeMove(move){
    return true;
  }
}