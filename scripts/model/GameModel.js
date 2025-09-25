class GameModel {
  static #INSTANCE = new GameModel();
  #MG = new MoveGenerator();
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
    let list=[];
    for(let i=0; i<this.#chessBoard.length; i++){
      switch (this.#chessBoard[i].toLowerCase()) {
        case 'p' : list.push(...this.#MG.possiblePawn(i)); break;
        case 'n' : list.push(...this.#MG.possibleKnight(i)); break;
        case 'r' : list.push(...this.#MG.possibleRook(i)); break;
        case 'b' : list.push(...this.#MG.possibleBishop(i)); break;
        case 'q' : list.push(...this.#MG.possibleQueen(i)); break;
        case 'k' : list.push(...this.#MG.possibleKing(i)); break;
      }
    }
    this.#possibleMoves = list;
    console.group("Possible Moves:")
    console.log(GM.GetPossibleMoves().toString());
    console.groupEnd();
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
    let m = this.#possibleMoves.find(m => m.toString()===move.toString());
    if(m === undefined) {return;}
    move = m;
    console.info("Making Move: " + move);

    // Pawn Moves
    if(move.piece.toLowerCase() == 'p'){
      // en Passant
      let direction = move.isWhite ? 1:-1;
      if(this.getIndex(move.coords[2], move.coords[3]) == this.enPassantSquare){
        move.capture = this.getChessBoard()[this.getIndex(move.coords[2], move.coords[3]+direction)];
        this.setBoard(move.coords[2], move.coords[3]+direction, ' ');
        let s1 = getCoordinate(move.coords[2],move.coords[3]+direction);
        const target = Array.from(squares).find(s=>s.id===s1);
        target.replaceChildren();
      }
      if(Math.abs(move.coords[1]-move.coords[3]) == 2){
        this.enPassantSquare = this.getIndex(move.coords[2], move.coords[3]+direction);
      } else {
        this.enPassantSquare = -1;
      }

      // Promotion
      if(move.special=="="){
        console.log("Promotion Choice?"); // methond to pick promotion piece
        move.special = move.special+"Q";
        let promPiece = move.special.charAt(move.special.length-1);
        if(move.isWhite){
          promPiece=promPiece.toUpperCase();
        } else {
          promPiece=promPiece.toLowerCase();
        }
        move.piece = promPiece;
      }
    }

    this.makeMove(move);
    this.printBoard();

    const _squares = Array.from(squares);
    const _pieces = Array.from(pieces);
    let s1 = getCoordinate(move.coords[0],move.coords[1]);
    let s2 = getCoordinate(move.coords[2],move.coords[3]);
    const target = _squares.find(s=>s.id===s2);
    const piece = _pieces.find(p=>p.id.split(" ")[1]===s1);
    if(move.special.charAt(0)==="="){
      piece.children[0].src=`pieceImages/${move.isWhite?"white":"black"}-${getType(move.piece)}.png`;
      piece.id = `${getType(move.piece)} ${s1}`
    }
    target.replaceChildren(piece);
    piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;
    console.log(piece);
    
    this.lastMove=move;
    this.isWhiteTurn=!this.isWhiteTurn;
    this.#getPossibleMoves();

  }

  UndoBoardMove(move){
    console.info("Undo Move: " + move);

    // Pawn Moves
    let direction = move.isWhite ? 1:-1;
    if(move.piece.toLowerCase() == 'p'){
      if(move.special==="e.p."){
        this.setBoard(move.coords[2], move.coords[3], ' ');
        this.enPassantSquare = this.getIndex(move.coords[2], move.coords[1]-direction);
        move.coords[3]+=direction;
      }
    }
    //Promotion
    if (move.special != "" && move.special.charAt(0) == '=') {
      move.piece=move.isWhite ? 'P':'p';
    }
    this.undoMove(move);
    this.printBoard();

    const _squares = Array.from(squares);
    const _pieces = Array.from(pieces);
    let s1 = getCoordinate(move.coords[0],move.coords[1]);
    let s2 = getCoordinate(move.coords[2],move.coords[3]);
    const target = _squares.find(s=>s.id===s1);
    var piece = _pieces.find(p=>p.id.split(" ")[1]===s2);
    target.replaceChildren(piece);
    if(piece===undefined){
      s2 = getCoordinate(move.coords[2],move.coords[3]-direction);
      piece = _pieces.find(p=>p.id.split(" ")[1]===s2);
      let s = _squares.find(s=>s.id === s2);
      target.replaceChildren(piece);
    }
    //Promotion
    if (move.special != "" && move.special.charAt(0) == '=') {
      piece.children[0].src=`pieceImages/${move.isWhite?"white":"black"}-${getType(move.piece)}.png`;
      piece.id = `${getType(move.piece)} ${s1}`
    }
    piece.id =`${piece.id.split(" ")[0]} ${piece.parentElement.id}`;

    if(move.capture !== " "){
      let piece = this.getPieces().find(piece => piece.col===move.coords[2] && piece.row===move.coords[3]);
        Chess.makePiece(piece, _squares);
    }

    this.isWhiteTurn=!this.isWhiteTurn;
    this.#getPossibleMoves();
  }
  //#endregion
}