var MAX_DEPTH = 3;

class GameModel {
  static #INSTANCE = new GameModel();
  #moves = [];

  boardModel = new BoardModel();
  playerIsWhite=true; isPlaying=true;
  computerGame=false;
  isWhiteTurn = true;
  checks = [false, false];

  static getInstance(){
    return this.#INSTANCE;
  }

  newGame() {
    this.boardModel.newStandardChessBoard();
    this.isWhiteTurn = true;
    this.#moves = [];
    this.checks = [false, false];
    Scorer.FlipTables();
  }

  makeMove(move) {
    this.boardModel.makeMove(move);
    this.#moves.unshift(move);
    this.getState();
    MovePiece(move, false);

    // Pawn Promotion
    if (move.special.startsWith("=")) {
      const temp = move.target.piece;
      move.target.piece =  move.initial.piece
      BoardView.makePiece(move.target);
      move.target.piece = temp;
    }

    // enPassant
    if (move.special==="e.p.") {
      let direction = move.initial.piece.dir;
      BoardView.clearPiece(this.boardModel.getElement(move.target.col, move.target.row-direction));
    }

    // Castling
    if(move.special==="0-0") {
      let rook = this.boardModel.getElement(GM.playerIsWhite ? 7:0, move.initial.row);
      let square = this.boardModel.getElement(move.target.col-(GM.playerIsWhite ? 1:-1), move.target.row);
      BoardView.makePiece(square)
      BoardView.clearPiece(rook)
    }
    if(move.special==="0-0-0"){
      let rook = this.boardModel.getElement(GM.playerIsWhite ? 0:7, move.initial.row);
      let square = this.boardModel.getElement(move.target.col+(GM.playerIsWhite ? 1:-1), move.target.row);
      BoardView.makePiece(square)
      BoardView.clearPiece(rook)
    }
  }

  undoMove() {
    if (this.#moves.length!==0) {
      let lastMove = this.#moves.shift();
      this.boardModel.undoMove(lastMove);
      this.getState();

      // undo promotion
      if (lastMove.special.startsWith("=")) {
        BoardView.makePiece(lastMove.initial);
      }

      // undo enPassant
      if(lastMove.special==="e.p.")  {
        let direction = lastMove.initial.piece.dir;
        BoardView.makePiece(this.boardModel.getElement(lastMove.target.col, lastMove.target.row-direction));
      }

      // Undo Castling
    if(lastMove.special==="0-0"){
      let square = this.boardModel.getElement(GM.playerIsWhite ? 7:0, lastMove.initial.row);
      let rook = this.boardModel.getElement(lastMove.target.col-(GM.playerIsWhite ? 1:-1), lastMove.target.row);
      BoardView.makePiece(square)
      BoardView.clearPiece(rook)
    } else if(lastMove.special==="0-0-0"){
      let square = this.boardModel.getElement(GM.playerIsWhite ? 0:7, lastMove.initial.row);
      let rook = this.boardModel.getElement(lastMove.target.col+(GM.playerIsWhite ? 1:-1), lastMove.target.row);
      BoardView.makePiece(square)
      BoardView.clearPiece(rook)
    }

      console.log(`Undo Move:`);
      this.boardModel.printBoard();
      return lastMove;
    } 
  }

  getMoves() {
    return this.#moves;
  }

  nextTurn() {
    this.isWhiteTurn = !this.isWhiteTurn;
  }

  promotionSelection(move) {
    let promPiece = parseInt(prompt("Select Promotion:\n0:Queen, 1:Rook, 2:Bishop, 3:Knight", "0"));
    switch (promPiece) {
      case 0: move.special = "=Q"; break;
      case 1: move.special = "=R"; break;
      case 2: move.special = "=B"; break;
      case 3: move.special = "=N"; break;
      default: move.special = "=Q"; break;
    }
  }

  getState() {
    let state = this.boardModel.getState();
    if (state != 0) {
      this.isPlaying = false;
      let message;
      switch (state) {
        case 1: message = "White Has Won the Game."; break;
        case 2: message = "Black Has Won the Game."; break;
        case 3: message = "The Game Has ended in a Draw."; break;
        default: message = "This is an informational message."; break;
      }
      alert(message);
    }
  }

  //#region Move Methods
  computerMove(){
    if (this.isPlaying && (this.isWhiteTurn===!this.playerIsWhite)) {
      let s = this.boardModel.getElement(0,0);
      console.info("Computer is thinking...");
      console.time("Computer Move Time");
      this.makeMove((this.MinMax(MAX_DEPTH, Number.MAX_VALUE, Number.MIN_VALUE, new Move(s,s), this.isWhiteTurn)));
      console.timeEnd("Computer Move Time");
      this.nextTurn();
      console.info("Computer has moved. ", this.#moves[0].toString());
      //this.boardModel.printBoard();
    }
  }

  sortMoves(list) {
    for (let move of list) {
      this.boardModel.makeMove(move);
      move.score = Scorer.score(-1, 0)*(move.isWhite ? 1:-1);
      this.boardModel.undoMove(move);
    }
    list.sort((a,b) => b.score - a.score);
    return list;
  }

  MinMax(depth, min, max, move, isMaximizingPlayer) {
    let list = this.boardModel.getPossibleMoves(isMaximizingPlayer);
    if (depth===0 || list.length===0) {return new MinMaxMove(move, Scorer.score(list.length, depth)*(isMaximizingPlayer ? 1:-1));}

    // shuffle moves to add variability
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    // sort moves by score value
    list = this.sortMoves(list);

    for (let iteration of list) {
      this.boardModel.makeMove(iteration);
      var bestScore = this.MinMax(depth-1, min, max, iteration, !isMaximizingPlayer).score;
      this.boardModel.undoMove(iteration);

      if (!isMaximizingPlayer) {
        min = Math.min(min, bestScore);
        if (depth===MAX_DEPTH) {move = iteration;}
        if (max <= min) { break; }
      } else {
        max = Math.max(max, bestScore);
        if (depth===MAX_DEPTH) {move = iteration;}
        if (max >= min) { break; }
      }
    }
    if (!isMaximizingPlayer) {return new MinMaxMove(move, min); }
    else { return new MinMaxMove(move, max); }
  }
  //#endregion
}