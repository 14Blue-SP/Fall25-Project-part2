//#region Piece SuperClass
class Piece {
  board = GM.boardModel;
  name; img;
  isWhite;
  value; spriteIndex;
  pos = {col:0, row:0};
  moves = [];

  constructor(name, isWhite, value) {
    this.name = name;
    this.isWhite = isWhite;
    this.value = (isWhite ? 1:-1)*value;
  }

  isValidMove(move) {
    return true;
  }
  pieceCollision(move) {
    return false;
  }

  isVerticalCollision(move) {
    if (move.initial.col==move.target.col) {
      let start = Math.min(move.initial.row, move.target.row) +1;
      let end = Math.max(move.initial.row, move.target.row);
      for (let r=start; r<end; r++) {
        if (!this.board.getElement(move.initial.col, r).isEmpty()) {
          return true;
        }
      }
    }
    return false;
  }

  isHorizontalCollision(move) {
    if (move.initial.row==move.target.row) {
      let start = Math.min(move.initial.col, move.target.col) +1;
      let end = Math.max(move.initial.col, move.target.col);
      for (let c=start; c<end; c++) {
        if (!this.board.getElement(c, move.initial.row).isEmpty()) {
          return true;
        }
      }
    }
    return false;
  }

  isDiagonalCollision(move) {
    if (move.initial.col==move.target.col && move.initial.row==move.target.row) { return true; }
    if (Math.abs(move.initial.col-move.target.col)==Math.abs(move.initial.row-move.target.row)) {
      let colStep = parseInt((move.target.col-move.initial.col) / Math.abs(move.target.col-move.initial.col));
      let rowStep = parseInt((move.target.row-move.initial.row) / Math.abs(move.target.row-move.initial.row));
      let steps = Math.abs(move.target.col-move.initial.col);
      for (let i=1; i<steps; i++) {
        if (!this.board.getElement(move.initial.col+i*colStep, move.initial.row+i*rowStep).isEmpty()) {
          return true;
        }
      }
    }

    return false;
  }

  toString() {
    return `${this.isWhite ? "White":"Black"} ${this.name}|${this.value} points`;
  }

  serializePiece() {
    let c;
    switch(this.name) {
      case "pawn": c = 'p'; break;
      case "rook": c = 'r'; break;
      case "knight": c = 'n'; break;
      case "bishop": c = 'b'; break;
      case "queen": c = 'q'; break;
      case "king": c = 'k'; break;
      default: c = ' '; break;
    }
    c = this.isWhite ? c.toUpperCase() : c;
    return c;
  }
}
//#endregion

class Pawn extends Piece {
  dir;
  constructor(isWhite) {
    super("pawn", isWhite, 100);
    this.dir = isWhite ? -1:1;
  }

  isValidMove(move) {
    //Promotion
    if(move.target.row==((this.isWhite==GM.playerIsWhite) ? 0:7)){
      move.special = "=";
    }

    // Standard Move
    if(move.initial.col==move.target.col && move.target.row==move.initial.row+this.dir && this.board.getElement(move.target.col, move.target.row).isEmpty()){
      return true;
    }

    // First Double Move
    if (move.initial.row==((this.isWhite==GM.playerIsWhite) ? 6:1) && move.initial.col==move.target.col && move.target.row==move.initial.row+2*this.dir && this.board.getElement(move.target.col, move.target.row).isEmpty() && this.board.getElement(move.target.col, move.target.row-this.dir).isEmpty()) {
      return true;
    }

    // Capture
    if (Math.abs(move.initial.col-move.target.col)==1 && move.target.row==move.initial.row+this.dir && !this.board.getElement(move.target.col, move.target.row).isEmpty()) {
      return true;
    }

    //enPassant
    if(this.board.enPassantSquare===move.target && move.initial.row!=((this.isWhite==GM.playerIsWhite)?6:1) && Math.abs(move.initial.col-move.target.col)==1 && move.target.row==move.initial.row+this.dir){
      move.special="e.p.";
      return true;
    }
    return false;
  }
}

class Rook extends Piece {
  constructor(isWhite) {
    super("rook", isWhite, 500);
  }

  isValidMove(move) {
    return move.initial.col==move.target.col || move.initial.row==move.target.row;
  }

  pieceCollision(move) {
    return this.isVerticalCollision(move) || this.isHorizontalCollision(move);
  }
}

class Knight extends Piece {
  constructor(isWhite) {
    super("knight", isWhite, 300);
  }

  isValidMove(move) {
    return Math.abs(move.initial.col-move.target.col) * Math.abs(move.initial.row-move.target.row)==2;
  }
}

class Bishop extends Piece {
  constructor(isWhite) {
    super("bishop", isWhite, 350);
  }

  isValidMove(move) {
    return Math.abs(move.initial.col-move.target.col)==Math.abs(move.initial.row-move.target.row);
  }

  pieceCollision(move) {
    return this.isDiagonalCollision(move);
  }
}

class Queen extends Piece {
  constructor(isWhite) {
    super("queen", isWhite, 900);
  }

  isValidMove(move) {
    return move.initial.col==move.target.col || move.initial.row==move.target.row || Math.abs(move.initial.col-move.target.col)==Math.abs(move.initial.row-move.target.row);
  }

  pieceCollision(move) {
    return this.isVerticalCollision(move) || this.isHorizontalCollision(move) || this.isDiagonalCollision(move);
  }
}

class King extends Piece {
  constructor (isWhite) {
    super("king", isWhite, 10000);
  }

  isValidMove(move) {
    let checks = GM.checks;
    let castle;
    let isCheck;
    let king;

    if (this.isWhite) {
      king = [4,7];
      isCheck = checks[0];
      castle = [this.board.castle[0], this.board.castle[1]];
    } else {
      king = [4,0];
      isCheck = checks[1];
      castle = [this.board.castle[2], this.board.castle[3]];
    }

    if (!GM.playerIsWhite) {
      if (this.isWhite) {
        king = [3,0];
        isCheck = checks[0];
        castle = [this.board.castle[1], this.board.castle[0]];
      } else {
        king = [3,7];
        isCheck = checks[1];
        castle = [this.board.castle[3], this.board.castle[2]];
      }
    }

    // Castling King side
    if (move.initial.col==king[0] && move.initial.row==king[1]
        && move.target.col==move.initial.col+(GM.playerIsWhite ? 2:-2) && move.target.row==move.initial.row
        && this.board.getElement(king[0]+(GM.playerIsWhite ? 1:-1), king[1]).isEmpty()
        && this.board.getElement(king[0]+(GM.playerIsWhite ? 2:-2), king[1]).isEmpty()
        && !isCheck && castle[1])
    {
      let s1 = this.board.getElement(king[0], king[1]);
      let s2 = this.board.getElement(king[0]+(GM.playerIsWhite ? 1:-1), king[1]);
      let temp = new Move(s1, s2);
      if (!this.board.CS.isSafeMove(temp)){
        return false;
      }
      move.special="0-0";
      return true;
    }

    // Castling Queen side
    if (move.initial.col==king[0] && move.initial.row==king[1]
        && move.target.col==move.initial.col-(GM.playerIsWhite ? 2:-2) && move.target.row==move.initial.row
        && this.board.getElement(king[0]-(GM.playerIsWhite ? 1:-1), king[1]).isEmpty()
        && this.board.getElement(king[0]-(GM.playerIsWhite ? 2:-2), king[1]).isEmpty()
        && this.board.getElement(king[0]-(GM.playerIsWhite ? 3:-3), king[1]).isEmpty()
        && !isCheck && castle[0])
    {
      let s1 = this.board.getElement(king[0], king[1]);
      let s2 = this.board.getElement(king[0]-(GM.playerIsWhite ? 1:-1), king[1]);
      let temp = new Move(s1, s2);
      if (!this.board.CS.isSafeMove(temp)){
        return false;
      }
      move.special="0-0-0";
      return true;
    }

    return Math.abs(move.initial.col-move.target.col)<=1 && Math.abs(move.initial.row-move.target.row)<=1;
  }
}