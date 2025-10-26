class CheckScanner {
  Alliance(s1, s2) {
    if (s1===undefined || s2===undefined) {
      return false;
    }
    if (s1.isEmpty() || s2.isEmpty()) {
      return false;
    }
    return s1.piece.isWhite == s2.piece.isWhite;
  }

  isLegalMove(move) {
    if (this.Alliance(move.initial, move.target)) { return false;}
    if (!move.initial.piece.isValidMove(move)) { return false;}
    if (move.initial.piece.pieceCollision(move)) { return false;}
    return true;
  }

  isSafeMove(move) {
    let king;
    let board = GM.boardModel;
    board.setElement(new Square(move.initial.col, move.initial.row));
    board.setElement(new Square(move.target.col, move.target.row, move.initial.piece));
    if (move.isWhite) {
      king = board.whiteKing;
    } else {
      king = board.blackKing;
    }
    if (move.initial.piece instanceof King) {
      if (move.isWhite) {
        board.whiteKing = board.getElement(move.target.col, move.target.row);
      } else {
        board.blackKing = board.getElement(move.target.col, move.target.row);
      }
    }
    let isSafe = !this.isCheck(move.isWhite);
    board.setElement(move.initial);
    board.setElement(move.target);
    if (move.initial.piece instanceof King) {
      if (move.isWhite) {
        board.whiteKing = king;
      } else {
        board.blackKing = king;
      }
    }
    return isSafe
  }

  isCheck(isWhite) {
    let board = GM.boardModel;
    let king = isWhite ? board.whiteKing:board.blackKing;
    
    // Check Diagonals
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece instanceof Bishop || square.piece instanceof Queen) {
          let move = new Move(square, king);
          if (this.isLegalMove(move)) { return true; }
        }
      }
    }

    // Check Horizontals and Verticals
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece instanceof Rook || square.piece instanceof Queen) {
          let move = new Move(square, king);
          if (this.isLegalMove(move)) { return true; }
        }
      }
    }

    // Check Knight
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece instanceof Knight) {
          let move = new Move(square, king);
          if (this.isLegalMove(move)) { return true; }
        }
      }
    }

    // Check Pawn
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece instanceof Pawn) {
          let move = new Move(square, king);
          if (this.isLegalMove(move)) { return true; }
        }
      }
    }

    // Check King
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece instanceof King) {
          if (king.equals(square)) {continue;}
          let move = new Move(square, king);
          if (this.isLegalMove(move)) { return true; }
        }
      }
    }
    return false;
  }
}