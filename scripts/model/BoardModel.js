class BoardModel {
  files=8; ranks=8;
  #board = new Array(this.files * this.ranks);
  whiteKing; blackKing; enPassantSquare=undefined;
  castle = [true, true, true, true];

  CS = new CheckScanner();
  
  //#region Board Methods
  getBoard(){
    return this.#board;
  }

  getIndex(file, rank){
    return rank*this.ranks + file;
  }

  getCoordinates(index){
    return {File: index%this.files, Rank: parseInt(index/this.ranks)};
  }

  getElement(file, rank){
    return this.#board[this.getIndex(file, rank)];
  }

  setElement(square){
    this.#board[this.getIndex(square.col, square.row)] = square;
  }

  #clearBoard(){
    for (let i=0; i<this.#board.length; i++) {
      let coords = this.getCoordinates(i);
      this.#board[i] = new Square(coords.File, coords.Rank);
    }
  }

  newStandardChessBoard(){
    this.#clearBoard();
    for(let c=0; c < 2; c++){
      let isWhite = c%2==0;
      // Place pawns
      for(let i=0;i<this.files;i++){
        this.setElement(new Square(i, isWhite? 6:1, new Pawn(isWhite)));
      }
      // Place rooks
      this.setElement(new Square(0, isWhite? 7:0, new Rook(isWhite)));
      this.setElement(new Square(7, isWhite? 7:0, new Rook(isWhite)));
      // Place knights
      this.setElement(new Square(1, isWhite? 7:0, new Knight(isWhite)));
      this.setElement(new Square(6, isWhite? 7:0, new Knight(isWhite)));
      // Place bishops
      this.setElement(new Square(2, isWhite? 7:0, new Bishop(isWhite)));
      this.setElement(new Square(5, isWhite? 7:0, new Bishop(isWhite)));
      // Place queens
      this.setElement(new Square(3, isWhite? 7:0, new Queen(isWhite)));
      // Place kings
      this.setElement(new Square(4, isWhite? 7:0, new King(isWhite)));
    }
    this.whiteKing = this.getElement(4, 7);
    this.blackKing = this.getElement(4, 0);

    this.castle = [true, true, true, true];
    if (!GM.playerIsWhite) {this.flipBoard();}
    //this.printBoard();
  }

  printBoard(){
    let board = [];
    for(let i=0; i<this.#board.length; i+=this.files) {
      let temp = new Array(this.files);
      for (let j=0; j<temp.length; j++) {
        let s = this.#board[i+j];
        if (s.isEmpty()) {temp[j] = ' '; continue;}
        if (s.piece instanceof Pawn) {temp[j] = 'p';}
        if (s.piece instanceof Knight) {temp[j] = 'n';}
        if (s.piece instanceof Bishop) {temp[j] = 'b';}
        if (s.piece instanceof Rook) {temp[j] = 'r';}
        if (s.piece instanceof Queen) {temp[j] = 'q';}
        if (s.piece instanceof King) {temp[j] = 'k';}
        if (s.piece.isWhite) {temp[j] = (String)(temp[j]).toUpperCase()}
      }
      board.push(temp);
    }
    console.table(board);
  }

  flipBoard(){
    let start = 0;
    let end = this.#board.length-1;

    while (start  < end) {
      let temp = this.#board[start];
      this.#board[start] = this.#board[end];
      let coord = this.getCoordinates(start);
      this.#board[start].col = coord.File;
      this.#board[start].row = coord.Rank;
      this.#board[end] = temp;
      coord = this.getCoordinates(end);
      this.#board[end].col = coord.File;
      this.#board[end].row = coord.Rank;
      start++;
      end--;
    }

    for (let square of this.#board) {
      if (!square.isEmpty()) {
        if (square.piece instanceof Pawn) {
          square.piece.dir *= -1;
        }
      }
    }

    this.whiteKing = this.getElement(3, 0);
    this.blackKing = this.getElement(3, 7);
  }

  serializeBoard() {
    let boardData = [];
    for (let square of this.#board) {
      boardData.push(square.serializeSquare()); 
    }
    return {files:this.files, ranks:this.ranks, castle: this.castle, enPassant: this.enPassantSquare ? {col: this.enPassantSquare.col, row: this.enPassantSquare.row} : null, board: boardData};
  }

  loadBoard(data) {
    this.files = data.files;
    this.ranks = data.ranks;
    this.castle = data.castle;
    if (data.enPassant !== null) {
      this.enPassantSquare = this.getElement(data.enPassant.col, data.enPassant.row);
    }
    //console.log(this.#board);
    for (let i=0; i<data.board.length; i++) {
      let coords = this.getCoordinates(i);
      let sqData = data.board[i];
      let piece = undefined;
      switch (sqData.toLowerCase()) {
        case 'p' : piece = new Pawn(sqData === sqData.toUpperCase()); break;
        case 'n' : piece = new Knight(sqData === sqData.toUpperCase()); break;
        case 'b' : piece = new Bishop(sqData === sqData.toUpperCase()); break;
        case 'r' : piece = new Rook(sqData === sqData.toUpperCase()); break;
        case 'q' : piece = new Queen(sqData === sqData.toUpperCase()); break;
        case 'k' : piece = new King(sqData === sqData.toUpperCase()); break;
      }
      let square = new Square(coords.File, coords.Rank, piece);
      this.setElement(square);

      if (piece instanceof King) {
        if (piece.isWhite) {this.whiteKing = square;}
        else {this.blackKing = square;}
      }
    }
  }
  //#endregion

  //#region Move Methods
  findMoves(square) {
    for (let i=0; i<this.#board.length; i++) {
      let target = this.#board[i];
      let move = new Move(square, target);
      if(this.CS.isLegalMove(move) && this.CS.isSafeMove(move)) {
        if (square.piece instanceof Pawn) {
          if (move.special.startsWith("=")) {
            let prom = "QRNB";
            for (let j=0; j<prom.length; j++){
              move = new Move(square, target);
              move.special = "="+prom.charAt(j);
              square.piece.moves.push(move);
            }
            continue;
          }
        }
        square.piece.moves.push(move);
      }
    }
  }

  getPossibleMoves(isWhite) {
    let list=[];
    for (let i=0; i<this.#board.length; i++) {
      let square = this.#board[i];
      if (!square.isEmpty() && square.piece.isWhite==isWhite) {
        this.findMoves(square);
        list.push(...square.piece.moves);
        square.piece.moves=[];
      }
    }
    return list;
  }

  makeMove(move) {
    // Pawn special move cases
    if (move.initial.piece instanceof Pawn) {
      if (!(move.initial.piece instanceof Pawn)) {return;}

      // enPassant
      let direction = move.initial.piece.dir;
      if(move.special==="e.p."){
        move.target.piece = this.getElement(move.target.col, move.target.row-direction).piece;
        this.getElement(move.target.col, move.target.row-direction).piece=undefined;
      }
      // Set enPassant square
      if(Math.abs(move.target.row-move.initial.row)==2){
        this.enPassantSquare = this.getElement(move.target.col, move.target.row-direction);
      } else {
        this.enPassantSquare = undefined;
      }

      // Promotion
      if (move.special.startsWith("=")) {
        var promPiece=undefined;
        const promChar = move.special.charAt(move.special.length-1);
        switch (promChar) {
          case 'Q': promPiece=new Queen(move.isWhite); break;
          case 'N': promPiece=new Knight(move.isWhite); break;
          case 'B': promPiece=new Bishop(move.isWhite); break;
          case 'R': promPiece=new Rook(move.isWhite); break;
        }
        promPiece.moves = move.initial.piece.moves;
        move.initial.piece = promPiece;
      }
    }

    // Update Board
    this.setElement(new Square(move.initial.col, move.initial.row));
    this.setElement(new Square(move.target.col, move.target.row, move.initial.piece));

    // Update King Index
    if (move.initial.piece instanceof King) {
      if (move.isWhite) {
        this.whiteKing = this.getElement(move.target.col, move.target.row);
        this.castle[0] = false;
        this.castle[1] = false;
      } else {
        this.blackKing = this.getElement(move.target.col, move.target.row);
        this.castle[2] = false;
        this.castle[3] = false;
      }
    }

    // Castling
    if(move.special==="0-0"){
      let rook = this.getElement(GM.playerIsWhite ? 7:0, move.initial.row);
      let square = this.getElement(move.target.col-(GM.playerIsWhite ? 1:-1), move.target.row);
      square.piece=rook.piece;
      rook.piece=undefined;
    }
    if(move.special==="0-0-0"){
      let rook = this.getElement(GM.playerIsWhite ? 0:7, move.initial.row);
      let square = this.getElement(move.target.col+(GM.playerIsWhite ? 1:-1), move.target.row);
      square.piece=rook.piece;
      rook.piece=undefined;
    }
    // Update Rook castle rights
    if (move.initial.piece instanceof Rook) {
      if (move.isWhite) {
        if (move.initial.col==(GM.playerIsWhite ? 0:7) && move.initial.row==(GM.playerIsWhite ? 7:0)) {
          if (GM.playerIsWhite) {this.castle[0]=false;}
          else {this.castle[1]=false;}
        }
        if (move.initial.col==(GM.playerIsWhite ? 7:0) && move.initial.row==(GM.playerIsWhite ? 7:0)) {
          if (GM.playerIsWhite) {this.castle[1]=false;}
          else {this.castle[0]=false;}
        }
      } else {
        if (move.initial.col==(GM.playerIsWhite ? 0:7) && move.initial.row==(GM.playerIsWhite ? 0:7)) {
          if (GM.playerIsWhite) {this.castle[2]=false;}
          else {this.castle[3]=false;}
        }
        if (move.initial.col==(GM.playerIsWhite ? 7:0) && move.initial.row==(GM.playerIsWhite ? 0:7)) {
          if (GM.playerIsWhite) {this.castle[3]=false;}
          else {this.castle[2]=false;}
        }
      }
    }
    // Rook capture rights
    if (move.target.piece instanceof Rook) {
      if (!move.isWhite) {
        if (move.target.col==(GM.playerIsWhite ? 0:7) && move.target.row==(GM.playerIsWhite ? 7:0)) {
          if (GM.playerIsWhite) {this.castle[0]=false;}
          else {this.castle[1]=false;}
        }
        if (move.target.col==(GM.playerIsWhite ? 7:0) && move.target.row==(GM.playerIsWhite ? 7:0)) {
          if (GM.playerIsWhite) {this.castle[1]=false;}
          else {this.castle[0]=false;}
        }
      } else {
        if (move.target.col==(GM.playerIsWhite ? 0:7) && move.target.row==(GM.playerIsWhite ? 0:7)) {
          if (GM.playerIsWhite) {this.castle[2]=false;}
          else {this.castle[3]=false;}
        }
        if (move.target.col==(GM.playerIsWhite ? 7:0) && move.target.row==(GM.playerIsWhite ? 0:7)) {
          if (GM.playerIsWhite) {this.castle[3]=false;}
          else {this.castle[2]=false;}
        }
      }
    }
  }

  undoMove(move) {
    // undo promotion
    if (move.special.startsWith("=")) {
      move.initial.piece = new Pawn(move.isWhite);
      if (!GM.playerIsWhite) {move.initial.piece.dir *= -1;}
    }

    // update Board
    this.setElement(move.initial);
    this.setElement(move.target);

    // Update King Index
    if (move.initial.piece instanceof King) {
      if (move.isWhite) {
        this.whiteKing = this.getElement(move.initial.col, move.initial.row);
      } else {
        this.blackKing = this.getElement(move.initial.col, move.initial.row);
      }
    }

    // Undo Pawn Move special cases
    if (move.initial.piece instanceof Pawn) {
    // undo enPassant
      if(move.special==="e.p.")  {
        let direction = move.initial.piece.dir;
        this.getElement(move.target.col, move.target.row-direction).piece=move.target.piece;
        this.getElement(move.target.col, move.target.row).piece=undefined;
      }

      // Update enPassant square
      const prevMove = GM.getMoves().length===0 ? undefined : GM.getMoves()[0];
      if (prevMove!==undefined && prevMove.initial.piece instanceof Pawn) {
        let direction = prevMove.initial.piece.dir;
        if(Math.abs(prevMove.target.row-prevMove.initial.row)==2) {
          this.enPassantSquare = this.getElement(prevMove.target.col, prevMove.target.row-direction);
        } else {
          this.enPassantSquare = undefined;
        }
      }
    }

    // Undo Castling
    if(move.special==="0-0"){
      let square = this.getElement(GM.playerIsWhite ? 7:0, move.initial.row);
      let rook = this.getElement(move.target.col-(GM.playerIsWhite ? 1:-1), move.target.row);
      square.piece=rook.piece;
      rook.piece=undefined;
    } else if(move.special==="0-0-0"){
      let square = this.getElement(GM.playerIsWhite ? 0:7, move.initial.row);
      let rook = this.getElement(move.target.col+(GM.playerIsWhite ? 1:-1), move.target.row);
      square.piece=rook.piece;
      rook.piece=undefined;
    }

    // Update Castle Rights
    if (move.initial.piece instanceof King || move.initial.piece instanceof Rook) {
      // Check if king has moved
      let KingMoved = true;
      let moves = Array.from(GM.getMoves());
      moves = moves.filter(m => m.isWhite===move.isWhite);
      moves = moves.filter(m => (m.initial.piece instanceof King));
      if (moves.length===0) {KingMoved = false;}
      // check if Rooks have moved
      moves = Array.from(GM.getMoves())
      moves = moves.filter(m => m.isWhite===move.isWhite);
      moves = moves.filter(m => (m.initial.piece instanceof Rook));
      let moves2 = Array.from(moves).filter(m => m.initial.col===(GM.playerIsWhite ? 7:0))
      moves = moves.filter(m => m.initial.col===(GM.playerIsWhite ? 0:7))
      if (move.isWhite && !KingMoved) {
        if (moves.length===0) {if (GM.playerIsWhite) {this.castle[0]=true;} else {this.castle[1]=true;}}
        if (moves2.length===0) {if (GM.playerIsWhite) {this.castle[1]=true;} else {this.castle[0]=true;}}
      }
      if (!move.isWhite && !KingMoved) {
        if (moves.length===0) {if (GM.playerIsWhite) {this.castle[2]=true;} else {this.castle[3]=true;}}
        if (moves2.length===0) {if (GM.playerIsWhite) {this.castle[3]=true;} else {this.castle[2]=true;}}
      }
    }

    // Undo Rook Capture rights
    if (move.target.piece instanceof Rook) {
      let moves = Array.from(GM.getMoves())
      moves = moves.filter(m => m.isWhite===move.isWhite);
      moves = moves.filter(m => (m.initial.piece instanceof Rook));
      let moves2 = Array.from(moves).filter(m => m.initial.col===(GM.playerIsWhite ? 7:0))
      moves = moves.filter(m => m.initial.col===(GM.playerIsWhite ? 0:7))
      if (!move.isWhite) {
        if (moves.length===0) {if (GM.playerIsWhite) {this.castle[0]=true;} else {this.castle[1]=true;}}
        if (moves2.length===0) {if (GM.playerIsWhite) {this.castle[1]=true;} else {this.castle[0]=true;}}
      } else {
        if (moves.length===0) {if (GM.playerIsWhite) {this.castle[2]=true;} else {this.castle[3]=true;}}
        if (moves2.length===0) {if (GM.playerIsWhite) {this.castle[3]=true;} else {this.castle[2]=true;}}
      }
    }
  }
  //#endregion

  //#region Evaluaton Methods
  getState() {
    let checks = GM.checks;
    checks[0] = this.CS.isCheck(true);
    checks[1] = this.CS.isCheck(false);
    let numMoves = this.getPossibleMoves(!GM.isWhiteTurn).length;

    // no possible moves
    if (numMoves==0){
      if (checks[0]) { return 2; }
      else if (checks[1]) { return 1; }
      else { return 3; }
    }

    // 50 moves
    if (this.checkMoves()) { return 3; }

    // 3 move repetition
    if (this.checkRepetition(GM.isWhiteTurn) && this.checkRepetition(!GM.isWhiteTurn)) { return 3; }

    // not enough material
    if (this.countMaterial()){return 3;}
    return 0;
  }

  checkMoves() {
    if (GM.getMoves().length<50) { return false; }
    let moves = GM.getMoves();
    let count=0;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].initial.piece instanceof Pawn || !moves[i].target.isEmpty()) {
        break;
      }
      count++;
      if (count>=50) {return true;}
    }
    return false;
  }

  checkRepetition(isWhite){
    if (GM.getMoves().length<2) { return false; }
    let moves = GM.getMoves()
    let target;
    if (isWhite == GM.isWhiteTurn) {
      target = GM.getMoves()[0].target;
    } else {
      target = GM.getMoves()[1].target;
    }

    let count=0, rep=0;
    for (let move of moves) {
      if (count>=5) {return false;}
      if (move.isWhite===isWhite) {
        if (move.target.equals(target)) {
          rep++;
          if (rep>=3) {return true;}
        }
        count++;
      }
    }
    return false;
  }

  countMaterial() {
    // [pawns, knights, bishops, rooks, queen, sum]
    let whiteMaterial = [0, 0, 0, 0, 0, 0];
    let blackMaterial = [0, 0, 0, 0, 0, 0];

    for (let square of this.#board){
      if (!square.isEmpty()) {
        switch (square.piece.name) {
          case "pawn" : 
            if (square.piece.isWhite){ whiteMaterial[0]++; }
            else { blackMaterial[0]++; } break;
          case "knight" : 
            if (square.piece.isWhite){ whiteMaterial[1]++; }
            else { blackMaterial[1]++; } break;
          case "bishop" : 
            if (square.piece.isWhite){ whiteMaterial[2]++; }
            else { blackMaterial[2]++; } break;
          case "rook" : 
            if (square.piece.isWhite){ whiteMaterial[3]++; }
            else { blackMaterial[3]++; } break;
          case "queen" : 
            if (square.piece.isWhite){ whiteMaterial[4]++; }
            else { blackMaterial[4]++; } break;
        }
      }
    }
    for(let i=0; i<whiteMaterial.length-1; i++) {
      whiteMaterial[5]+=whiteMaterial[i];
      blackMaterial[5]+=blackMaterial[i];
    }

    if (whiteMaterial[4]+whiteMaterial[3]+whiteMaterial[0]+
        blackMaterial[4]+blackMaterial[3]+blackMaterial[0]>0) {return false;}
    if (whiteMaterial[1]+blackMaterial[1]>1) {return false;}
    if ((whiteMaterial[2]>0 || blackMaterial[2]>0)
        && whiteMaterial[1]+blackMaterial[1]>0) {return false;}
    if (whiteMaterial[2]>1 || blackMaterial[2]>1) {return false;}
    if (whiteMaterial[2]==1 && blackMaterial[2]==1) {
      let whiteBishop=undefined, blackBishop=undefined;
      for (let square of this.#board) {
        if (!square.isEmpty()) {
          if (square.piece instanceof Bishop) {
            if (square.piece.isWhite) {whiteBishop = square;}
            else {blackBishop = square;}
          }
        }
      }
      if (whiteBishop==undefined || blackBishop==undefined) {return true;}
      let s1 = (whiteBishop.col+whiteBishop.row)%2 == 0;
      let s2 = (blackBishop.col+blackBishop.row)%2 == 0;
      if (s1 != s2) {return false;}
    }
    return true;
  }
  //#endregion
}