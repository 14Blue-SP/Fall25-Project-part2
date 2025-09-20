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

  isSafeMove(move){
    let piece = GM.getChessBoard()[GM.getIndex(move.col,move.row)];
    GM.setPiece(move.col, move.row, " ");
    GM.setPiece(move.newCol, move.newRow, piece);
    let tempPosition=GM.getIndex(move.col,move.row);
    if(piece === "K"){
      tempPosition = GM.whiteKingIndex;
      GM.whiteKingIndex = GM.getIndex(move.newCol,move.newRow);
    }
    let isSafe = this.willCheck();
    console.log(`"Move: ${move.toString()} isSafe ? ${isSafe}`);
    GM.setPiece(move.col, move.row, piece);
    GM.setPiece(move.newCol, move.newRow, move.capture);
    if(piece === "K"){
      GM.whiteKingIndex = tempPosition;
    }
    return isSafe;
  }

  willCheck(){
    let king = GM.getCoordinates(GM.whiteKingIndex);

    // check Diagonals
    for(let i=0; i<GM.getChessBoard().length; i++){
      let square = GM.getCoordinates(i);
      var move = new BishopMove(king.file,king.rank,square.file,square.rank,GM.getChessBoard()[GM.getIndex(square.file,square.rank)]);
      if(this.isLegalMove(move)){
        if(move.capture=="b" || move.capture=="q"){
          return false;
        }
      }
    }

    // check Vertical and Horizontal
    for(let i=0; i<GM.getChessBoard().length; i++){
      let square = GM.getCoordinates(i);
      var move = new RookMove(king.file,king.rank,square.file,square.rank,GM.getChessBoard()[GM.getIndex(square.file,square.rank)]);
      if(this.isLegalMove(move)){
        if(move.capture=="r" || move.capture=="q"){
          return false;
        }
      }
    }

    // check Knight
    for(let i=0; i<GM.getChessBoard().length; i++){
      let square = GM.getCoordinates(i);
      var move = new KnightMove(king.file,king.rank,square.file,square.rank,GM.getChessBoard()[GM.getIndex(square.file,square.rank)]);
      if(this.isLegalMove(move)){
        if(move.capture=="n"){
          return false;
        }
      }
    }

    // check Pawn
    for(let i=0; i<GM.getChessBoard().length; i++){
      let square = GM.getCoordinates(i);
      var move = new PawnMove(king.file,king.rank,square.file,square.rank,GM.getChessBoard()[GM.getIndex(square.file,square.rank)]);
      if(this.isLegalMove(move)){
        if(move.capture=="p"){
          return false;
        }
      }
    }

    // check King
    for(let i=0; i<GM.getChessBoard().length; i++){
      let square = GM.getCoordinates(i);
      var move = new KingMove(king.file,king.rank,square.file,square.rank,GM.getChessBoard()[GM.getIndex(square.file,square.rank)]);
      if(this.isLegalMove(move)){
        if(move.capture=="k"){
          return false;
        }
      }
    }
    return true;
  }
}