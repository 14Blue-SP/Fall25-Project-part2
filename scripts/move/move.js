class Move {
  constructor(col, row, newCol, newRow, capture){
    this.col = col;
    this.row = row;
    this.newCol = newCol;
    this.newRow = newRow;
    this.capture = capture;
    this.special = "";
  }
  isValidMove(){
    return true;
  }
  pieceCollision(){
    return false;
  }
  toString(){
    return `{${this.col}${this.row}${this.newCol}${this.newRow}${this.capture}}`;
  }
}

class KingMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)
  }

  isValidMove(){
    return Math.abs(this.col-this.newCol)<=1 && Math.abs(this.row-this.newRow)<=1;
  }
}