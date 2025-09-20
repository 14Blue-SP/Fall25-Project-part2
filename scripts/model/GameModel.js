class GameModel {
  static #INSTANCE = new GameModel();
  files=8; ranks=8;
  whiteKingIndex; blackKingIndex;
  enPassantIndex = -1;

  #MG = new MoveGenerator();

  #chessBoard = new Array(this.files*this.ranks);
  #pieces = [];

  static getInstance(){
    return this.#INSTANCE;
  }

  //#region  Board Methods
  //Make new ChessBoard
  newStandardChessBoard(){
    this.clearBoard();
    for(let c=0; c<2; c++){
      // Place pawns
      for(let i=0; i<this.files; i++){
        this.setPiece(i, c%2==0 ? 6:1, c%2==0 ? "P":"p");
      }
      // Place rooks
      this.setPiece(0, c%2==0 ? 7:0, c%2==0 ? "R":"r");
      this.setPiece(7, c%2==0 ? 7:0, c%2==0 ? "R":"r");
      // Place knights
      this.setPiece(1, c%2==0 ? 7:0, c%2==0 ? "N":"n");
      this.setPiece(6, c%2==0 ? 7:0, c%2==0 ? "N":"n");
      // Place bishops
      this.setPiece(2, c%2==0 ? 7:0, c%2==0 ? "B":"b");
      this.setPiece(5, c%2==0 ? 7:0, c%2==0 ? "B":"b");
      // Place queens
      this.setPiece(3, c%2==0 ? 7:0, c%2==0 ? "Q":"q");
      // Place kings
      this.setPiece(4, c%2==0 ? 7:0, c%2==0 ? "K":"k");
      if(c%2==0){
        this.whiteKingIndex = this.getIndex(4,7);
      } else {
        this.blackKingIndex = this.getIndex(4,0);
      }
    }
    this.printBoard();
    placePieces();
  }

  getChessBoard(){
    return this.#chessBoard;
  }

  clearBoard(){
    this.#chessBoard.fill(" ");
  }

  printBoard(){
    let board = [];
    for(let i=0; i<this.#chessBoard.length; i+=this.files){
      board.push(this.#chessBoard.slice(i,i+this.files));
    }
    this.makePieces();
    console.table(board);
  }

  getIndex(file, rank){
    return rank*this.ranks + file;
  }

  getCoordinates(index){
    let col = index%this.files;
    let row = parseInt(index/this.ranks);
    return {file: col, rank: row};
  }
  //#endregion

  //#region Piece Methods
  setPiece(col, row, piece){
    this.#chessBoard[this.getIndex(col,row)] = piece;
  }

  //make pieces from board
  makePieces(){
    this.#pieces = [];
    for(let i=0; i<this.#chessBoard.length; i++){
      if(!(this.#chessBoard[i]===" ")){
        let square = this.getCoordinates(i);
        let piece = Chess.Piece(square.file, square.rank, isUpperCase(this.#chessBoard[i]))
        piece.type = getType(this.#chessBoard[i]);
        if(piece.type===null){continue;}
        piece.img=`pieceImages/${piece.isWhite?"white":"black"}-${piece.type}.png`;
        this.#pieces.push(piece);
      }
    }
    //console.log(this.#pieces);
  }

  getPieces(){
    return this.#pieces;
  }
  //#endregion

  //#region Move Methods
  getPossibleMoves(){
    var list = [];
    if(DEBUG){console.groupCollapsed("Getting Possible Moves...")}
    for(let i=0; i<this.#chessBoard.length; i++){
      switch (this.#chessBoard[i]) {
        case "P" : list.push(...this.#MG.possiblePawn(i)); break;
        case "N" : list.push(...this.#MG.possibleKnight(i)); break;
        case "R" : list.push(...this.#MG.possibleRook(i)); break;
        case "B" : list.push(...this.#MG.possibleBishop(i)); break;
        case "Q" : list.push(...this.#MG.possibleQueen(i)); break;
        case "K" : list.push(...this.#MG.possibleKing(i)); break;
      }
    }
    if(DEBUG){console.groupEnd("Getting Possible Moves...");}
    return list;
  }

  makeMove(move){
    let piece = this.#chessBoard[this.getIndex(move.col,move.row)];

    const moves = GetPossibleMoves();
    console.log(moves.toString());

    for(const m of moves){
      if(m.col===move.col && m.row===move.row && m.newCol==move.newCol && m.newRow===move.newRow){
        if(piece==="P"){
          let direction = 1;
          //en Passant
          if(this.getIndex(move.newCol, move.newRow) == this.enPassantIndex){
            move.capture = this.#chessBoard[this.getIndex(move.newCol, move.newRow+direction)];
            this.setPiece(move.newCol, move.newRow+direction, " ");
            console.log(move.special);
          }
          if(Math.abs(move.row-move.newRow) == 2){
            this.enPassantIndex = this.getIndex(move.newCol, move.newRow+direction);
          } else {
            this.enPassantIndex = -1;
          }
          if(move.special==="="){
            console.log("Promotion Choice?"); // methond to pick promotion piece
            move.special = move.special+"Q";
            let p = move.special.substring(move.special.length-1);
            piece = p;
          }
        }

        this.setPiece(move.newCol, move.newRow, piece);
        this.setPiece(move.col, move.row, " ");
        if(piece=="K"){
          this.whiteKingIndex = this.getIndex(move.newCol, move.newRow);
        }
        //Record move
        this.printBoard();
        placePieces();
      }
    }
  }

  undoMove(move){
    let piece = this.#chessBoard[this.getIndex(move.col,move.row)];
    if(piece==="P"){
      let direction = 1;
      if(move.special==".e.p."){
        console.log("attempting to undo enpassant");
        this.enPassantIndex = this.getIndex(move.newCol, move.newRow+direction);
      }
    }
    if(move.special!=="" && move.special.charAt(0) == '='){piece="P";}
    this.setPiece(move.newCol, move.newRow, move.capture);
    this.setPiece(move.col, move.row, piece);
    if(piece=="K"){
      this.whiteKingIndex = this.getIndex(move.col, move.row);
    }
    //Record move
    this.printBoard();
    placePieces();
  }
  //#endregion
}