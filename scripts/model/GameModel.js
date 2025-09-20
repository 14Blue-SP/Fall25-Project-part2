class GameModel {
  static #INSTANCE = new GameModel();
  files=8; ranks=8;
  whiteKingIndex; blackKingIndex;
  enPassantSquare = -1;

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
        this.setPiece(i, c%2==0 ? 6:1, c%2==0 ? "O":"p");
      }
      // Place rooks
      this.setPiece(0, c%2==0 ? 7:0, c%2==0 ? "R":"r");
      this.setPiece(7, c%2==0 ? 7:0, c%2==0 ? "R":"r");
      // Place knights
      this.setPiece(1, c%2==0 ? 7:0, c%2==0 ? "O":"n");
      this.setPiece(6, c%2==0 ? 7:0, c%2==0 ? "O":"n");
      // Place bishops
      this.setPiece(2, c%2==0 ? 7:0, c%2==0 ? "B":"b");
      this.setPiece(5, c%2==0 ? 7:0, c%2==0 ? "B":"b");
      // Place queens
      this.setPiece(3, c%2==0 ? 7:0, c%2==0 ? "O":"q");
      // Place kings
      this.setPiece(4, c%2==0 ? 7:0, c%2==0 ? "K":"k");
      if(c%2==0){
        this.whiteKingIndex = this.getIndex(4,7);
      } else {
        this.blackKingIndex = this.getIndex(4,0);
      }
    }
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
    if(DEBUG){console.group("Getting Possible Moves...")}
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
    if(DEBUG){console.groupEnd();}
    return list;
  }
  //#endregion
}