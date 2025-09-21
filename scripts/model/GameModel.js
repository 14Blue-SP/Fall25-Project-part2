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

  MinMax(depth, min, max, move, isWhite){
    if(depth===0){return new MinMaxMove(move, this.score());}//*(isWhite ? 1:-1));}

    //#region Testing MinMax
    const temp = parseInt(prompt("Number of moves:"));
    console.log(`Number of Moves: ${temp}`);

    let test=[];
    for(let i=0; i<temp; i++){
      test.push(new Move(1,1,1,1,"b"));
    }
    //#endregion
    //Sort from best to worst;

    isWhite = !isWhite;
    //this.getPossibleMoves().forEach(element => {
    for(let e of test){
      this.makeMove(e);
      this.flipBoard();
      let pass = this.MinMax(depth-1, min, max, e, isWhite);
      
      this.flipBoard();
      this.undoMove(e);

      if(isWhite){
        if(pass.score<=min){min=pass.score; if(depth==MAX_DEPTH){move=pass;}}
      } else {
        if(pass.score>=max){max=pass.score; if(depth==MAX_DEPTH){move=pass;}}
      }
      if(max>=min){
        if(isWhite) {return new MinMaxMove(move, min);} else {return new MinMaxMove(move, max);}
      }
    }
    if(isWhite) {return new MinMaxMove(move, min);} else {return new MinMaxMove(move, max);}
  }

  score(){
    const score = parseInt(prompt("InputScore:"));
    console.log(`InputScore: ${score}`);
    return score;
  }

  //#region Board Methods
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
    createPieces();
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

  flipBoard(){
    let left=0; let right=this.#chessBoard.length-1;
    while(left<right){
      let temp = this.#chessBoard[left];
      this.#chessBoard[left] = this.#chessBoard[right];
      this.#chessBoard[right] = temp;

      left++;
      right--;
    }
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
    let _move =  GetPossibleMoves().find(m => m.toString()===move.toString());
    let possible = _move !== undefined;
    //console.log(`${move.toString()} ${possible ? "valid move":"not valid move"}`);
    //if(!possible){return;}
    //move = _move;
    
    let piece = this.#chessBoard[this.getIndex(move.col,move.row)];
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
      // promotion
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
    //this.printBoard();
    //placePieces();
    return move;
  }

  undoMove(move){
    //console.log(`Undo move: ${move.toString()}`);
    let piece = this.#chessBoard[this.getIndex(move.newCol,move.newRow)];
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
    //this.printBoard();
  }
  //#endregion
}