class Square {
  col; row; piece;

  constructor(col, row, piece){
    this.col = col;
    this.row = row;
    this.piece = piece;
  }

  isEmpty(){
    return this.piece === undefined;
  }

  toString() {
    return `Square: {col: ${this.col}, row: ${this.row}, piece: ${this.piece===undefined ? null:this.piece.toString()}}`;
  }

  equals(o) {
    if (o == this) { return true; }
    if (!(o instanceof Square)) { return false; }

    return this.row===o.row && this.col===o.col;
  }

  serializeSquare() {
    let pieceData = ' ';
    if (this.piece !== undefined) {
      pieceData = this.piece.serializePiece();
    }
    return pieceData;
  }
}