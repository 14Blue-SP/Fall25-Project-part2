class Move {
  initial; target;
  isWhite;
  special = "";
  score;

  constructor(initial, target) {
    this.initial = initial;
    this.target = target;
    if (!initial.isEmpty()) {
      this.isWhite = initial.piece.isWhite;
    }
  }

  toString() {
    return `${this.initial.col}${this.initial.row}${this.target.col}${this.target.row}${this.getChar()}`;
  }

  equals(o) {
    if (o == this) { return true; }
    if (!(o instanceof Move)) { return false; }

    //let s = o;
    return this.initial===o.initial && this.target===o.target;
  }

  getChar(){
    if (this.target.isEmpty()) { return ' '; }
    switch (this.target.piece.name) {
      case "pawn" : return 'p';
      case "knight" : return 'n';
      case "bishop" : return 'b';
      case "rook" : return 'r';
      case "queen" : return 'q';
      case "king" : return 'k';
      default : return ' ';
    }
  }

  serializeMove() {
    return {
      initial: {col: this.initial.col, row: this.initial.row},
      target: {col: this.target.col, row: this.target.row},
      isWhite: this.isWhite,
      special: this.special
    }
  }
}

class MinMaxMove extends Move {
  constructor (move, score) {
    super(move.initial, move.target);
    this.score = parseInt(score);
    this.special = move.special;
  }

  toString() {
    return `${super.toString()}, Score: ${this.score}`;
  }
}