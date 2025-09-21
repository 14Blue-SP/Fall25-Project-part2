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
    let str = `${this.col}${this.row}${this.newCol}${this.newRow}${this.capture}`;
    //if(this.special!==""){str = str+this.special}
    return str;
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

class QueenMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)
  }

  isValidMove(){
    return this.col===this.newCol || this.row===this.newRow || Math.abs(this.col - this.newCol) == Math.abs(this.row - this.newRow);
  }

  pieceCollision(){
    return isVerticalCollision(this) || isHorizontalCollision(this) || isDiagonalCollision(this);
  }
}

class BishopMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)
  }

  isValidMove(){
    return Math.abs(this.col - this.newCol) === Math.abs(this.row - this.newRow);
  }

  pieceCollision(){
    return isDiagonalCollision(this);
  }
}

class RookMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)
  }

  isValidMove(){
    return this.col === this.newCol || this.row === this.newRow;
  }

  pieceCollision(){
    return isVerticalCollision(this) || isHorizontalCollision(this);
  }
}

class KnightMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)
  }

  isValidMove(){
    return Math.abs(this.col-this.newCol) * Math.abs(this.row-this.newRow) == 2;
  }
}

class PawnMove extends Move{
  constructor(col, row, newCol, newRow, capture){
    super(col, row, newCol, newRow, capture)

    // Promotion
    let promotionRank = 0;
    if(this.newRow == promotionRank){
      this.special = "=";
    }
  }

  isValidMove(){
    let direction = -1;

    // Promotion
    let promotionRank = 0;
    if(this.newRow == promotionRank){
      this.special = "=";
    }

    //Standard Move
    if(this.col===this.newCol && this.row+direction === this.newRow && GM.getChessBoard()[GM.getIndex(this.newCol, this.newRow)]==" "){
      return true;
    }

    //First Double Move
    if(this.row===6 && this.col===this.newCol && this.row+2*direction === this.newRow && GM.getChessBoard()[GM.getIndex(this.newCol, this.newRow)]==" " && GM.getChessBoard()[GM.getIndex(this.newCol, this.row+direction)]==" "){
      return true;
    }

    //capture
    if(Math.abs(this.col-this.newCol)==1 && this.row+direction==this.newRow && (GM.getChessBoard()[GM.getIndex(this.newCol, this.newRow)]) !== " "){
      return true;
    }

    //enPassant
    if(GM.enPassantIndex==GM.getIndex(this.newCol, this.newRow) && Math.abs(this.col-this.newCol)==1 && this.row+direction==this.newRow){
      this.special = "e.p.";
      return true;
    }
    return false;
  }
}

class MinMaxMove extends Move{
  constructor(move, score){
    super(move.col, move.row, move.newCol, move.newRow, move.capture);
    this.special = move.special;
    this.score = score;
  }

  toString(){
    let str = `Move: ${this.col}${this.row}${this.newCol}${this.newRow}${this.capture}, Score: ${this.score}`;
    //if(this.special!==""){str = str+this.special}
    return str;
  }
}