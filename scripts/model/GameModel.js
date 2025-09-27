class GameModel {
  static #INSTANCE = new GameModel();
  #MG = new MoveGenerator();
  
  files=8; ranks=8;  enPassantSquare=-1;
  whiteKingIndex; blackKingIndex;

  isWhiteTurn=true;
  checks = {white:false, black:false}
  castle = {white:true, black:true, cW:-1, cB:-1}

  #board = new Array(this.files*this.ranks);
  #pieces = [];
  #possibleMoves = [];

  static getInstance(){
    return this.#INSTANCE;
  }

  getState(){
    GM.isWhiteTurn = !GM.isWhiteTurn
    this.#getPossibleMoves()
    let x = this.GetPossibleMoves().length;
    GM.isWhiteTurn = !GM.isWhiteTurn
    if (x===0){
      console.warn("Checkmate");
      console.info(`${GM.isWhiteTurn ? "White":"Black"} Wins!`);
    }
  }

  //#region Board Methods
  #clearBoard(){
    this.#board.fill(' ');
  }

  // setters and getters
  getBoard(){
    return this.#board;
  }
  setBoard(col, row, piece){
    this.#board[this.getIndex(col,row)] = piece;
  }

  getCoordinates(index){
    return {col: (index%this.files), row: parseInt(index/this.ranks)};
  }

  getElement(col, row){
    return this.#board[this.getIndex(col, row)];
  }

  getIndex(col, row){
    return row * this.ranks + col;
  }

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
    this.printBoard();
  }

  printBoard(){
    let board = [];
    for(let i=0; i<this.#board.length; i+=this.files){
      board.push(this.#board.slice(i,i+this.files));
    }
    this.#makePieces();
    console.table(board);
    this.#getPossibleMoves();
    console.log("Possible Moves:", GM.GetPossibleMoves().toString());
    CS.scanForCheck();
    if(this.checks.white===true || this.checks.black===true) {
      console.log("Checks", GM.checks);
      this.getState();
    }
  }
  //#endregion

  //#region Piece Methods
  #makePieces(){
    this.#pieces=[]
    for(let i=0; i<this.#board.length; i++){
      if(this.#board[i] !== ' '){
        let piece = Chess.Piece(this.getCoordinates(i), this.#board[i]);
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
    for(let i=0; i<this.#board.length; i++){
      switch (this.#board[i].toLowerCase()) {
        case 'p' : list.push(...this.#MG.possiblePawn(i)); break;
        case 'n' : list.push(...this.#MG.possibleKnight(i)); break;
        case 'r' : list.push(...this.#MG.possibleRook(i)); break;
        case 'b' : list.push(...this.#MG.possibleBishop(i)); break;
        case 'q' : list.push(...this.#MG.possibleQueen(i)); break;
        case 'k' : list.push(...this.#MG.possibleKing(i)); break;
      }
    }
    this.#possibleMoves = list;
  }

  GetPossibleMoves(){
    return this.#possibleMoves;
  }

  #makeMove(move){
    // Pawn Move
    if (move.piece.toLowerCase()==='p') {
      let direction = move.isWhite ? 1:-1;
      if (this.getIndex(move.coords[2], move.coords[3])===this.enPassantSquare) {
        move.capture = this.getElement(move.coords[2], move.coords[3]+direction);
        this.setBoard(move.coords[2], move.coords[3]+direction, ' ');
      }
      if (Math.abs(move.coords[1]-move.coords[3])===2) {
        this.enPassantSquare = this.getIndex(move.coords[2], move.coords[3]+direction);
      } else {
        this.enPassantSquare = -1;
      }

      // Promotion
      let promRank = move.isWhite ? 0:7;
      if (move.coords[3] === promRank) {move.special="="}
      if(move.special==="="){
        console.warn("Promotion Choice?"); // methond to pick promotion piece
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
    //console.log("Castle", this.castle)
    this.setBoard(move.coords[2], move.coords[3], move.piece);
    this.setBoard(move.coords[0], move.coords[1], ' ');
    if(move.piece.toLowerCase()==='k'){
      //console.log(move)
      if(move.isWhite){
        this.whiteKingIndex = this.getIndex(move.coords[2], move.coords[3]);
      } else {
        this.blackKingIndex = this.getIndex(move.coords[2], move.coords[3]);
      }
      //castle
      if(move.special==="0-0"){
        this.setBoard(move.coords[2]-1, move.coords[3], move.isWhite ? 'R':'r');
        this.setBoard(7, move.coords[1], ' ');
      }
      if(move.special==="0-0-0"){
        this.setBoard(move.coords[2]+1, move.coords[3], move.isWhite ? 'R':'r');
        this.setBoard(0, move.coords[1], ' ');
      }
    }
  }
  #undoMove(move){
    this.setBoard(move.coords[2], move.coords[3], move.capture);
    this.setBoard(move.coords[0], move.coords[1], move.piece);
    let prevMove = Chess.moves[Chess.moves.length-1];
    if(prevMove !== undefined) {
      if (move.piece.toLowerCase()==='p') {
        let direction = prevMove.isWhite ? 1:-1;
        if(move.special==="e.p."){
          this.setBoard(move.coords[2], move.coords[3], ' ');
          this.setBoard(move.coords[2], move.coords[3]-direction, move.capture);
        }
        if (Math.abs(prevMove.coords[1]-prevMove.coords[3])===2) {
          this.enPassantSquare = this.getIndex(prevMove.coords[2], prevMove.coords[3]+direction);
        } else {
          this.enPassantSquare = -1;
        }
      }
    }
    // castling
    if (move.piece.toLowerCase()==='r' || move.piece.toLowerCase()==='k') {
      //console.log("PrevMove",prevMove)
      if(move.isWhite && this.castle.cW===0){
        this.castle.white=true;
        this.castle.cW--;
      }
      if(!move.isWhite && this.castle.cB===0) {
        this.castle.black=true;
        this.castle.cB--;
      }
    }
    if(move.special==="0-0"){
      this.setBoard(move.coords[2]-1, move.coords[3], ' ');
      this.setBoard(7, move.coords[3], move.isWhite ? 'R':'r');
      if(move.isWhite){
        this.castle.white=true;
        this.castle.cW=-1;
      } else {
        this.castle.black=true;
        this.castle.cB=-1;
      }
    }
    if(move.special==="0-0-0"){
      this.setBoard(move.coords[2]+1, move.coords[3], ' ');
      this.setBoard(0, move.coords[3], move.isWhite ? 'R':'r');
      if(move.isWhite){
        this.castle.white=true;
        this.castle.cW=-1;
      } else {
        this.castle.black=true;
        this.castle.cB=-1;
      }
    }
    //console.log("Castle", this.castle)
    if(move.special.charAt(0)==="="){
      this.setBoard(move.coords[0], move.coords[1], move.isWhite ? 'P':'p');
    }
    if(move.piece.toLowerCase()==='k'){
      if(move.isWhite){
        this.whiteKingIndex = this.getIndex(move.coords[0], move.coords[1]);
      } else {
        this.blackKingIndex = this.getIndex(move.coords[0], move.coords[1]);
      }
    }
  }

  MakeBoardMove(move){
    let m = this.GetPossibleMoves().find(m => m.toString()===move.toString());
    if(m === undefined) {return;}
    move = m;
    console.info("Making Move", move.toString());
    this.#makeMove(move);
    // castling
    if (move.piece.toLowerCase()==='r' || move.piece.toLowerCase()==='k') {
      if(move.isWhite){
        this.castle.white=false;
        this.castle.cW++;
      } else {
        this.castle.black=false;
        this.castle.cB++;
      }
    }
    this.printBoard();
    Chess.movePiece(move, false);
    Chess.moves.push(move);
    this.isWhiteTurn = !this.isWhiteTurn;
    this.#getPossibleMoves();
  }
  UndoBoardMove(move){
    console.info("Undo Move", move.toString());
    this.#undoMove(move);
    this.printBoard();
    Chess.movePiece(move, true);
    this.isWhiteTurn = !this.isWhiteTurn;
    this.#getPossibleMoves();
  }
  //#endregion
}
