class GameModel {
  static #INSTANCE = new GameModel();
  static #MG = new MoveGenerator();
  files=8; ranks=8;
  whiteKingIndex; blackKingIndex; enPassantSquare=-1;
  isWhiteTurn=true;
  latstMove=null;

  #chessBoard = new Array(this.files*this.ranks);
  #pieces = [];
  #possibleMoves = [];

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
    this.#getPossibleMoves();
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

  //#region Move Methods
  #getPossibleMoves(){
    this.#possibleMoves = [1,2,3,4,5]
  }

  GetPossibleMoves(){
    return this.#possibleMoves;
  }

  makeMove(move){
    this.setBoard(move.coords[2], move.coords[3], move.piece);
    this.setBoard(move.coords[0], move.coords[1], ' ');
    if(move.piece.toLowerCase()==='k'){
      if(move.isWhite){
        this.whiteKingIndex = this.getIndex(move.coords[2], move.coords[3]);
      } else {
        this.blackKingIndex = this.getIndex(move.coords[2], move.coords[3]);
      }
    }
  }

  undoMove(move){
    this.setBoard(move.coords[2], move.coords[3], move.capture);
    this.setBoard(move.coords[0], move.coords[1], move.piece);
    if(move.piece.toLowerCase()==='k'){
      if(move.isWhite){
        this.whiteKingIndex = this.getIndex(move.coords[0], move.coords[1]);
      } else {
        this.blackKingIndex = this.getIndex(move.coords[0], move.coords[1]);
      }
    }
  }

  MakeBoardMove(move){
    this.makeMove(move);
    this.printBoard();

    if(false){return;}

    const _squares = Array.from(squares);
    const _pieces = Array.from(pieces);
    let s1 = getCoordinate(move.coords[0],move.coords[1]);
    let s2 = getCoordinate(move.coords[2],move.coords[3]);
    const target = _squares.find(s=>s.id===s2);
    const piece = _pieces.find(p=>p.id.split(" ")[1]===s1);
    target.replaceChildren(piece);
    piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;
    
    this.lastMove=move;
    this.isWhiteTurn=!this.isWhiteTurn;
    this.#getPossibleMoves();
  }

  UndoBoardMove(move){
    this.undoMove(move);
    this.printBoard();

    const _squares = Array.from(squares);
    const _pieces = Array.from(pieces);
    let s1 = getCoordinate(move.coords[0],move.coords[1]);
    let s2 = getCoordinate(move.coords[2],move.coords[3]);
    const target = _squares.find(s=>s.id===s1);
    const piece = _pieces.find(p=>p.id.split(" ")[1]===s2);
    target.replaceChildren(piece);
    piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;

    console.log(piece, target);

    if(move.capture !== " "){
      let piece = this.getPieces().find(piece => piece.col===move.coords[2] && piece.row===move.coords[3]);
        Chess.makePiece(piece, _squares);
    }

    this.isWhiteTurn=!this.isWhiteTurn;
    this.#getPossibleMoves();
  }
  //#endregion
}