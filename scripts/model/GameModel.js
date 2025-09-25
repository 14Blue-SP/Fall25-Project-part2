class GameModel {
  static #INSTANCE = new GameModel();
  files=8; ranks=8;
  whiteKingIndex; blackKingIndex; enPassantSquare=-1;

  #chessBoard = new Array(this.files*this.ranks);
  #pieces = [];

  static getInstance(){
    return this.#INSTANCE;
  }

  //#region Board Methods
  #clearBoard(){
    this.#chessBoard.fill(' ');
  }

  getChessBoard(){
    return this.#chessBoard;
  }

  getIndex(file, rank){
    return rank*this.ranks + file;
  }

  getCoordinates(index){
    return {file: (index%this.files), rank: parseInt(index/this.ranks)};
  }

  setBoard(col, row, piece){
    this.#chessBoard[this.getIndex(col,row)] = piece;
  }

  //Make new ChessBoard
  newStandardChessBoard(){
    this.#clearBoard();
    for(let c=0; c<2; c++){
      // Place pawns
      for(let i=0; i<this.files; i++){
        this.setBoard(i, c%2==0 ? 6:1, c%2==0 ? 'P':'p');
      }
      // Place rooks
      this.setBoard(0, c%2==0 ? 7:0, c%2==0 ? 'R':'r');
      this.setBoard(7, c%2==0 ? 7:0, c%2==0 ? 'R':'r');
      // Place knights
      this.setBoard(1, c%2==0 ? 7:0, c%2==0 ? 'N':'n');
      this.setBoard(6, c%2==0 ? 7:0, c%2==0 ? 'N':'n');
      // Place bishops
      this.setBoard(2, c%2==0 ? 7:0, c%2==0 ? 'B':'b');
      this.setBoard(5, c%2==0 ? 7:0, c%2==0 ? 'B':'b');
      // Place queens
      this.setBoard(3, c%2==0 ? 7:0, c%2==0 ? 'Q':'q');
      // Place kings
      this.setBoard(4, c%2==0 ? 7:0, c%2==0 ? 'K':'k');
      if(c%2==0){
        this.whiteKingIndex = this.getIndex(4,7);
      } else {
        this.blackKingIndex = this.getIndex(4,0);
      }
    }
    //getPossibleMoves();
    this.printBoard();
  }

  printBoard(){
    let board = [];
    for(let i=0; i<this.#chessBoard.length; i+=this.files){
      board.push(this.#chessBoard.slice(i,i+this.files));
    }
    this.#makePieces();
    console.table(board);
  }
  //#endregion

  //#region Piece Methods
  //make pieces from board
  #makePieces(){
    this.#pieces=[]
    for(let i=0; i<this.#chessBoard.length; i++){
      if(this.#chessBoard[i] !== ' '){
        let piece = Chess.Piece(this.getCoordinates(i), this.#chessBoard[i]);
        piece.img=`pieceImages/${piece.isWhite?"white":"black"}-${piece.type}.png`;
        this.#pieces.push(piece);
      }
    }
  }

  getPieces(){
    return this.#pieces;
  }
  //#endregion
}