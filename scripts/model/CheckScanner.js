class CheckScanner{
  Alliance(p1, p2){
    if(p1===' ' || p2===' '){
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
    var piece = GM.getElement(move.coords[0], move.coords[1]);
    var capture = GM.getElement(move.coords[2], move.coords[3]);
    GM.setBoard(move.coords[0], move.coords[1], ' ');
    GM.setBoard(move.coords[2], move.coords[3], piece);
    let tempPosition = GM.getIndex(move.coords[0], move.coords[1]);
    if(piece.toLowerCase()==='k'){
      if(move.isWhite){
        GM.whiteKingIndex = GM.getIndex(move.coords[2], move.coords[3]);
      } else {
        GM.blackKingIndex = GM.getIndex(move.coords[2], move.coords[3]);
      }
    }
    const isSafe = !this.isCheck(move.isWhite);
    GM.setBoard(move.coords[0], move.coords[1], piece);
    GM.setBoard(move.coords[2], move.coords[3], capture);
    if(piece.toLowerCase()==='k'){
      if(move.isWhite){
        GM.whiteKingIndex = tempPosition;
      } else {
        GM.blackKingIndex = tempPosition;
      }
    }
    return isSafe;
  }

  isCheck(isWhite){
    var king;
    if(isWhite){
      king = GM.getCoordinates(GM.whiteKingIndex);
    } else {
      king = GM.getCoordinates(GM.blackKingIndex);
    }

    // check Diagonals
    for(let i=0; i<GM.getBoard().length; i++){
      let square = GM.getCoordinates(i);
      let move = new BishopMove(king.col,king.row,square.col,square.row);
      if(this.isLegalMove(move)){
        let capture = GM.getElement(move.coords[2], move.coords[3]).toLowerCase();
        if(capture==='b' || capture==='q'){
          return true;
        }
      }
    }

     // Vertical and Horizontal
    for(let i=0; i<GM.getBoard().length; i++){
      let square = GM.getCoordinates(i);
      let move = new RookMove(king.col,king.row,square.col,square.row);
      if(this.isLegalMove(move)){
        let capture = GM.getElement(move.coords[2], move.coords[3]).toLowerCase();
        if(capture==='r' || capture==='q'){
          return true;
        }
      }
    }

    // check Knight
    for(let i=0; i<GM.getBoard().length; i++){
      let square = GM.getCoordinates(i);
      let move = new KnightMove(king.col,king.row,square.col,square.row);
      if(this.isLegalMove(move)){
        let capture = GM.getElement(move.coords[2], move.coords[3]).toLowerCase();
        if(capture==='n'){
          return true;
        }
      }
    }

    // check Pawn
    for(let i=0; i<GM.getBoard().length; i++){
      let square = GM.getCoordinates(i);
      let move = new PawnMove(king.col,king.row,square.col,square.row);
      if(this.isLegalMove(move)){
        let capture = GM.getElement(move.coords[2], move.coords[3]).toLowerCase();
        if(capture==='p'){
          return true;
        }
      }
    }

    // check King
    for(let i=0; i<GM.getBoard().length; i++){
      let square = GM.getCoordinates(i);
      let move = new KingMove(king.col,king.row,square.col,square.row);
      if(this.isLegalMove(move)){
        let capture = GM.getElement(move.coords[2], move.coords[3]).toLowerCase();
        if(capture==='k'){
          return true;
        }
      }
    }
    return false;
  }

  scanForCheck(){
    GM.checks.white=false;
    GM.checks.black=false;

    // Check if White King is in Check
    GM.GetPossibleMoves().forEach(move => {
      if(move.capture==='K'){
        GM.checks.white=true; return;
      }
    });
    // Check if White King is in Check
    GM.GetPossibleMoves().forEach(move => {
      if(move.capture==='k'){
        GM.checks.black=true; return;
      }
    });
  }
}