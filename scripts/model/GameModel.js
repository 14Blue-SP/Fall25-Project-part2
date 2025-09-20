class GameModel {
  static #INSTANCE = new GameModel();
  files=8; ranks=8;

  #chessBoard = new Array(this.files*this.ranks);
  #pieces = [];

  static getInstance(){
    return this.#INSTANCE;
  }

  // Board Methods

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
    }
    this.#makePieces();
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

  setPiece(col, row, piece){
    this.#chessBoard[this.getIndex(col,row)] = piece;
  }

  getIndex(file, rank){
    return rank*this.ranks + file;
  }

  //make pieces from board
  #makePieces(){
    this.#pieces = [];
    for(let i=0; i<this.#chessBoard.length; i++){
      if(!(this.#chessBoard[i]===" ")){
        let piece = Chess.Piece(i%this.files, parseInt(i/this.ranks), isUpperCase(this.#chessBoard[i]))
        piece.type = getType(this.#chessBoard[i]);
        piece.img=`pieceImages/${piece.isWhite?"white":"black"}-${piece.type}.png`;
        this.#pieces.push(piece);
      }
    }
    //console.log(this.#pieces);
  }

  getPieces(){
    return this.#pieces;
  }
}