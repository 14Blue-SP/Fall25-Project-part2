class Scorer {
  //#region Piece Square Tables
  static pawnTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5,-5,-10, 0, 0,-10,-5, 5,
    5, 10, 10,-20,-20, 10, 10, 5,
    0, 0, 0, 0, 0, 0, 0, 0
  ];

  static knightTable = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20, 0, 0, 0, 0,-20,-40,
    -30, 0, 10, 15, 15, 10, 0,-30,
    -30, 5, 15, 20, 20, 15, 5,-30,
    -30, 0, 15, 20, 20, 15, 0,-30,
    -30, 5, 10, 15, 15, 10, 5,-30,
    -40,-20, 0, 5, 5, 0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ];

  static bishopTable = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10, 0, 0, 0, 0, 0, 0,-10,
    -10, 0, 5, 10, 10, 5, 0,-10,
    -10, 5, 5, 10, 10, 5, 5,-10,
    -10, 0, 10, 10, 10, 10, 0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10, 5, 0, 0, 0, 0, 5,-10,
    -20,-10,-10,-10,-30,-10,-10,-20
  ];
  
  static rookTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, 10, 10, 10, 10, 5,
    -5, 0, 0, 0, 0, 0, 0,-5,
    -5, 0, 0, 0, 0, 0, 0,-5,
    -5, 0, 0, 0, 0, 0, 0,-5,
    -5, 0, 0, 0, 0, 0, 0,-5,
    -5, 0, 0, 0, 0, 0, 0,-5,
    0, 0, 0, 5, 5, 0, 0, 0
  ];

  static queenTable = [
    -20,-10,-10,-5,-5,-10,-10,-20,
    -10, 0, 0, 0, 0, 0, 0,-10,
    -10, 0, 5, 5, 5, 5, 0,-10,
    -5, 0, 5, 5, 5, 5, 0,-5,
    0, 0, 5, 5, 5, 5, 0,-5,
    -10, 5, 5, 5, 5, 5, 0,-10,
    -10, 0, 5, 0, 0, 0, 0,-10,
    -20,-10,-10,-5,-5,-10,-10,-20
  ];

  static kingTable = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20, 0, 0, 0, 0, 20, 20,
     20, 30, 10, 0, 0, 10, 30, 20
  ];

  static FlipTables() {
    Scorer.flipTable(Scorer.pawnTable);
    Scorer.flipTable(Scorer.knightTable);
    Scorer.flipTable(Scorer.rookTable);
    Scorer.flipTable(Scorer.bishopTable);
    Scorer.flipTable(Scorer.queenTable);
    Scorer.flipTable(Scorer.kingTable);
  }

  static flipTable(table){
    let start = 0;
    let end = table.length-1;

    while (start  < end) {
      let temp = table[start];
      table[start] = table[end];
      table[end] = temp;
      start++;
      end--;
    }
  }
  //#endregion

  static score(numMoves, depth) {
    let score=0, material=Scorer.calculateMaterial(true);
    score += Scorer.calculateAttack(true);
    score += material;
    score += Scorer.calculateMoveability(numMoves, depth, material, true);
    score += Scorer.calculatePosition(true);
    material=Scorer.calculateMaterial(false);
    score -= Scorer.calculateAttack(false);
    score += material;
    score -= Scorer.calculateMoveability(numMoves, depth, material, false);
    score -= Scorer.calculatePosition(false);
    return -(score + depth*50);
  }

  static calculateAttack(isWhite) {
    var board = GM.boardModel;
    let score=0;
    let temp = board.whiteKing;
    for (let i = 0; i < board.getBoard().length; i++) {
      let square = board.getBoard()[i]; 
      if (square.isEmpty()) { continue; }
      if (square.piece.isWhite===isWhite) {
        switch (square.piece.name) {
          case "pawn": {board.whiteKing=square; if(board.CS.isCheck(true)){score -= 65;}} break;
          case "knight": {board.whiteKing=square; if(board.CS.isCheck(true)){score -= 300;}} break;
          case "bishop": {board.whiteKing=square; if(board.CS.isCheck(true)){score -= 300;}} break;
          case "rook": {board.whiteKing=square; if(board.CS.isCheck(true)){score -= 500;}} break;
          case "queen": {board.whiteKing=square; if(board.CS.isCheck(true)){score -= 900;}} break;
        }
      }
    }
    board.whiteKing = temp;
    if (board.CS.isCheck(isWhite)){score -= 200;}
    return parseInt(score/2);
  }

  static calculateMaterial(isWhite) {
    var board = GM.boardModel;
    let score=0;
    for (let i=0; i<board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (!square.isEmpty()) {
        if (square.piece.isWhite == isWhite) {
          score += square.piece.value;
        }
      }
    }
    return score;
  }

  static calculatePosition(isWhite) {
    var board = GM.boardModel;
    let score=0;
    for (let i = 0; i < board.getBoard().length; i++) {
      let square = board.getBoard()[i];
      if (square.isEmpty()) { continue; }
      if (square.piece.isWhite == isWhite) {
        switch(square.piece.name) {
          case "pawn": score += Scorer.pawnTable[i]; break;
          case "knight": score += Scorer.knightTable[i]; break;
          case "bishop": score += Scorer.bishopTable[i]; break;
          case "rook": score += Scorer.rookTable[i]; break;
          case "queen": score += Scorer.queenTable[i]; break;
          case "king": score += Scorer.kingTable[i]; 
                       board.findMoves(square);
                       score += square.piece.moves.length*30;
                       square.piece.moves=[]; break;
        }
      }
    }
    return score;
  }

  static calculateMoveability(numMoves, depth, material, isWhite) {
    let state = GM.boardModel.getState();
    let score = 0;
    score+=numMoves*5;
    if (numMoves===0) {
      if ((state===1 && !isWhite) || (state===2 && isWhite)) {
        score -= 200000*depth;

      } else if (state===3) {
        score -= 150000*depth;
      }
    }
    return score;
  }
}